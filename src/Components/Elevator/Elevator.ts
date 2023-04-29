import EventEmitter from "events";
import {
  ElevatorAction,
  ElevatorCommandType,
  ElevatorDirection,
  ElevatorState,
  ELEVATOR_STATE_CHANGE,
} from "./types";

export class Elevator extends EventEmitter {
  /**
   * Number of floors the elevator is configured to move
   */
  public floors: number;

  /**
   * Current Floor stores the last floor the elevator crossed.
   * Or if it is idle, then the current floor
   */
  private currentFloor: number;

  /**
   * The current direction in which elevator is moving
   */
  private currentDirection: ElevatorDirection;

  /**
   * Downward is a list of floors storing boolean values.
   * While moving downwards, the elevator will stop
   * at a floor if the floor index is true
   */
  protected downward: Array<boolean>;

  /**
   * Upward is a list of floors storing boolean values.
   * While moving upwards, the elevator will stop
   * at a floor if the floor index is true
   */
  protected upward: Array<boolean>;

  /**
   *
   * @param floors Number of floors elevator is configured to move
   */
  constructor(floors: number) {
    super({
      captureRejections: true,
    });
    this.floors = floors;
    this.currentFloor = 0;
    this.currentDirection = ElevatorDirection.UP;

    this.downward = new Array<boolean>(floors).fill(false);
    this.upward = new Array<boolean>(floors).fill(false);
  }

  /**
   * Checks if the given floor is in the same direction of motion
   */
  private getCommandDirection(floor: number) {
    if (this.currentFloor > floor) {
      return ElevatorDirection.DOWN;
    } else if (this.currentFloor < floor) {
      return ElevatorDirection.UP;
    } else {
      return ElevatorDirection.IDLE;
    }
  }

  /**
   * Updates downward or upward for a given command
   */
  addCommand(command: ElevatorAction) {
    let currentDirection = this.currentDirection;

    const previousState = this.getState();

    let { floor, type } = command;

    if (floor < 0) {
      throw new Error("Floor must be 0 - " + (this.floors - 1));
    }

    if (floor > this.floors - 1) {
      throw new Error("Floor must be 0 - " + (this.floors - 1));
    }

    if (type === ElevatorCommandType.PICK_DOWN) {
      // pick request for going down
      this.downward[floor] = true;
    } else if (type === ElevatorCommandType.PICK_UP) {
      // pick request for going up
      this.upward[floor] = true;
    } else {
      // drop request
      // it can change either downward or upward depending on the current floor
      let inDirection = this.getCommandDirection(floor);

      if (
        inDirection === ElevatorDirection.DOWN ||
        (inDirection === ElevatorDirection.IDLE &&
          currentDirection === ElevatorDirection.DOWN)
      ) {
        this.downward[floor] = true;
      } else if (
        inDirection === ElevatorDirection.UP ||
        (inDirection === ElevatorDirection.IDLE &&
          currentDirection === ElevatorDirection.UP)
      ) {
        this.upward[floor] = true;
      }
    }

    const newState = this.getState();

    this.emit(ELEVATOR_STATE_CHANGE, {
      previousState,
      newState,
    });
  }

  /**
   * Get the next floor to stop at
   */
  private nextFloorInDirection(
    direction: ElevatorDirection,
    fromFloor: number
  ) {
    if (
      direction === ElevatorDirection.DOWN ||
      direction === ElevatorDirection.IDLE
    ) {
      for (let floor = fromFloor - 1; floor >= 0; floor--) {
        if (this.downward[floor] === true) {
          return floor;
        }
      }
    }

    for (let floor = fromFloor + 1; floor < this.floors; floor++) {
      if (this.upward[floor] === true) {
        return floor;
      }
    }

    return -1;
  }

  /**
   * Calculates the next state - direction and floor that elevator should go to
   */
  public getNextStep(): ElevatorState {
    let nextFloor = this.nextFloorInDirection(
      this.currentDirection,
      this.currentFloor
    );

    if (nextFloor === -1) {
      return {
        direction: ElevatorDirection.IDLE,
        floor: this.currentFloor,
      };
    }
    let nextDirection = this.getCommandDirection(nextFloor);

    return {
      direction: nextDirection,
      floor: nextFloor,
    };
  }

  /**
   * Calculates the next state
   */
  public getCurrentState(): ElevatorState {
    return {
      direction: this.currentDirection,
      floor: this.currentFloor,
    };
  }

  /**
   * Updates the state to the next state,
   * Then updates the direction but not the floor
   */
  public goToNextStep() {
    let nextState = this.getNextStep();

    const previousState = this.getState();

    this.currentDirection = nextState.direction;
    this.currentFloor = nextState.floor;

    // Mark the command complete
    if (this.currentDirection === ElevatorDirection.DOWN) {
      this.downward[this.currentFloor] = false;
    } else {
      this.upward[this.currentFloor] = false;
    }

    nextState = this.getNextStep();
    this.currentDirection = nextState.direction;

    const newState = this.getState();

    this.emit(ELEVATOR_STATE_CHANGE, {
      previousState,
      newState,
    });
  }

  /**
   * Get downward and upward
   */
  public getStations() {
    return {
      downward: this.downward,
      upward: this.upward,
    };
  }

  public getState() {
    return {
      ...this.getCurrentState(),
      downward: [...this.downward],
      upward: [...this.upward],
    };
  }
}

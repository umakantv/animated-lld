import EventEmitter from "events";
import {
  ElevatorAction,
  ElevatorCommandType,
  ElevatorData,
  ElevatorDirection,
  ElevatorState,
  ELEVATOR_STATE_CHANGE,
  FloorRequest,
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
   * Upward is a list of floors storing boolean values.
   * While moving upwards, the elevator will stop
   * at a floor if the floor index is true
   */
  protected requests: Array<FloorRequest>;

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

    this.requests = new Array(floors);
    for (let i = 0; i < this.requests.length; i++) {
      this.requests[i] = {
        goUp: false,
        goDown: false,
        drop: false,
      };
    }
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
  public addCommand(command: ElevatorAction) {
    const previousState = this.getState();

    let { floor, type } = command;

    if (floor < 0) {
      throw new Error("Floor must be 0 - " + (this.floors - 1));
    }

    if (floor > this.floors - 1) {
      throw new Error("Floor must be 0 - " + (this.floors - 1));
    }

    if (type === ElevatorCommandType.GO_DOWN) {
      // pick request for going down
      this.requests[floor].goDown = true;
    } else if (type === ElevatorCommandType.GO_UP) {
      // pick request for going up
      this.requests[floor].goUp = true;
    } else {
      // drop request
      // it can change either downward or upward depending on the current floor
      let inDirection = this.getCommandDirection(floor);

      if (inDirection === ElevatorDirection.IDLE) {
        // No need to do anything
        // Open door maybe
      } else {
        this.requests[floor].drop = true;
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
    // If elevator is going down - then we check from current to 0
    // then from 0 to top for going up
    if (
      direction === ElevatorDirection.DOWN ||
      direction === ElevatorDirection.IDLE
    ) {
      for (let floor = fromFloor - 1; floor >= 0; floor--) {
        if (this.requests[floor].goDown === true) {
          return { direction: ElevatorDirection.DOWN, floor };
        }

        if (this.requests[floor].drop === true) {
          return { direction: ElevatorDirection.DOWN, floor };
        }
      }
      for (let floor = 0; floor < this.floors; floor++) {
        if (this.requests[floor].goUp === true) {
          return { direction: ElevatorDirection.UP, floor };
        }
        if (this.requests[floor].drop === true) {
          return { direction: ElevatorDirection.UP, floor };
        }
      }
    }

    // If elevator is going up - then we check from current + 1 to top
    // then we check from top to 0
    if (
      direction === ElevatorDirection.UP ||
      direction === ElevatorDirection.IDLE
    ) {
      for (let floor = fromFloor + 1; floor < this.floors; floor++) {
        if (this.requests[floor].goUp === true) {
          return { direction: ElevatorDirection.UP, floor };
        }

        if (this.requests[floor].drop === true) {
          return { direction: ElevatorDirection.UP, floor };
        }
      }

      for (let floor = this.floors - 1; floor >= 0; floor--) {
        if (this.requests[floor].goDown === true) {
          return { direction: ElevatorDirection.DOWN, floor };
        }

        if (this.requests[floor].drop === true) {
          return { direction: ElevatorDirection.DOWN, floor };
        }
      }
    }

    return { direction: ElevatorDirection.IDLE, floor: -1 };
  }

  /**
   * Calculates the next state - direction and floor that elevator should go to
   */
  public getNextRequest(): ElevatorState {
    let { direction: nextDirection, floor: nextFloor } =
      this.nextFloorInDirection(this.currentDirection, this.currentFloor);

    // No next step
    if (nextFloor === -1) {
      return {
        direction: ElevatorDirection.IDLE,
        floor: this.currentFloor,
      };
    }

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
    let nextState = this.getNextRequest();

    const previousState = this.getState();

    this.currentDirection = nextState.direction;
    this.currentFloor = nextState.floor;

    // Mark the command complete
    if (this.currentDirection === ElevatorDirection.DOWN) {
      this.requests[this.currentFloor].goDown = false;
      // completed both picking to go down or dropping
      this.requests[this.currentFloor].drop = false;
    } else {
      this.requests[this.currentFloor].goUp = false;
      // completed both picking to go up or dropping
      this.requests[this.currentFloor].drop = false;
    }

    nextState = this.getNextRequest();
    this.currentDirection = nextState.direction;

    const newState = this.getState();

    this.emit(ELEVATOR_STATE_CHANGE, {
      previousState,
      newState,
    });
  }

  /**
   * Get all requests
   */
  public getRequests() {
    return this.requests;
  }

  /**
   * Returns the current elevator state
   * It's a combination of getCurrentState and getStations
   */
  public getState(): ElevatorData {
    return {
      ...this.getCurrentState(),
      requests: [...this.requests],
    };
  }
}

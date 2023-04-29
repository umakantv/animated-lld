export enum ElevatorDirection {
  UP = "UP",
  DOWN = "DOWN",
  IDLE = "IDLE",
}

export enum ElevatorCommandType {
  PICK_DOWN = "PICK_DOWN",
  PICK_UP = "PICK_UP",
  GO_TO_FLOOR = "GO_TO_FLOOR",
}

export type ElevatorAction = {
  /**
   * Elevator Command Type
   */
  type: ElevatorCommandType;
  /**
   * floor for which command is issues, it is 0-based index
   */
  floor: number;
};

export type ElevatorState = {
  direction: ElevatorDirection;
  floor: number;
};

export type ElevatorData = {
  direction: ElevatorDirection;
  floor: number;
  downward: Array<boolean>;
  upward: Array<boolean>;
};

export const ELEVATOR_STATE_CHANGE = "ELEVATOR_STATE_CHANGE";

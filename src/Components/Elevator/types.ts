export enum ElevatorDirection {
  UP = "UP",
  DOWN = "DOWN",
  IDLE = "IDLE",
}

export enum ElevatorCommandType {
  GO_DOWN = "GO_DOWN",
  GO_UP = "GO_UP",
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

export type FloorRequest = {
  goUp: boolean;
  goDown: boolean;
  drop: boolean;
};

export type ElevatorState = {
  direction: ElevatorDirection;
  floor: number;
};

export type ElevatorData = {
  direction: ElevatorDirection;
  floor: number;
  requests: Array<FloorRequest>;
};

export const ELEVATOR_STATE_CHANGE = "ELEVATOR_STATE_CHANGE";

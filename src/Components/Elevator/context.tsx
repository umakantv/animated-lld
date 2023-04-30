import React from "react";
import { Elevator } from "./Elevator";
import { ElevatorData } from "./types";

const dummyElevator = new Elevator(0);

const ElevatorContext = React.createContext<{
  elevator: Elevator;
  elevatorState: ElevatorData;
}>({
  elevator: dummyElevator,
  elevatorState: dummyElevator.getState(),
});

export default ElevatorContext;

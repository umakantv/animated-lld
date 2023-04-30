import { useEffect, useState } from "react";
import { Elevator } from "./Elevator";
import { ElevatorData, ELEVATOR_STATE_CHANGE } from "./types";

export function useElevatorState(elevator: Elevator) {
  const [elevatorState, setElevatorState] = useState<ElevatorData>({
    requests: elevator.getRequests(),
    ...elevator.getCurrentState(),
  });

  useEffect(() => {
    elevator.addListener(ELEVATOR_STATE_CHANGE, (data) => {
      console.log("Elevator State", data);
      setElevatorState(data.newState);
    });
  }, [elevator]);

  return {
    elevatorState,
  };
}

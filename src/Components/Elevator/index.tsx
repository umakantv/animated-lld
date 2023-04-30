import React, { useEffect, useMemo } from "react";
import { Elevator } from "./Elevator";
import { useElevatorState } from "./hooks";
import "./elevator.css";

import ElevatorContext from "./context";
import ElevatorControls from "./Controls";
import ElevatorBox from "./ElevatorBox";

const ElevatorContainer = ({ floors }: { floors: number }) => {
  const elevator = useMemo(() => {
    let elevator = new Elevator(floors);
    return elevator;
  }, [floors]);

  const { elevatorState } = useElevatorState(elevator);

  console.log(elevatorState);

  useEffect(() => {
    let interval = setInterval(() => {
      // console.log(elevator.getNextStep());
      elevator.goToNextStep();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [elevator]);

  return (
    <ElevatorContext.Provider
      value={{
        elevator,
        elevatorState,
      }}
    >
      <div className="elevator-demo">
        <div
          className="elevator-action"
          onClick={() => {
            console.log(elevator.getNextRequest());
            elevator.goToNextStep();
          }}
        >
          Go to Next Step
        </div>{" "}
        <br />
        <div className="elevator-playground">
          <ElevatorBox />
          <ElevatorControls />
        </div>
      </div>
    </ElevatorContext.Provider>
  );
};

export default ElevatorContainer;

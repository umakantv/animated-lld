import React, { useMemo, useState } from "react";
import { Elevator } from "../Components/Elevator/Elevator";
import { useElevatorState } from "../Components/Elevator/hooks";
import "../Components/Elevator/elevator.css";
import { ElevatorCommandType } from "../Components/Elevator/types";

const ElevatorDemo = ({ floors }: { floors: number }) => {
  let levels = new Array(floors).fill(0);
  const elevator = useMemo(() => {
    let elevator = new Elevator(floors);
    return elevator;
  }, [floors]);

  const { elevatorState } = useElevatorState(elevator);

  const { floor: currentFloor, downward, upward } = elevatorState;

  console.log(elevatorState);

  return (
    <div>
      <button
        onClick={() => {
          elevator.goToNextStep();
        }}
      >
        Go to Next Step
      </button>{" "}
      <br />
      <div className="row elevator-queues">
        <div>
          <div className={`elevator-level`}>
            <div className={`floor-column`}>
              <h3>Upward</h3>
            </div>

            <div className={`floor-column`}>
              <h3>Downward</h3>
            </div>

            <div className={`floor-column`}>
              <h3>Commands</h3>
            </div>
          </div>
          {levels.map((_, i) => {
            let floorIndex = floors - i - 1;
            let downwardHighlight = downward[floorIndex];
            let upwardHighlight = upward[floorIndex];

            return (
              <div className={`elevator-level`} key={i}>
                <div
                  onClick={() => {
                    elevator.addCommand({
                      type: ElevatorCommandType.GO_TO_FLOOR,
                      floor: floorIndex,
                    });
                  }}
                  className={`floor-column elevator-floor ${
                    upwardHighlight ? "floor-queued" : ""
                  }  ${floorIndex == currentFloor ? "floor-current" : ""}`}
                >
                  <span>{floorIndex}</span>
                </div>
                <div
                  onClick={() => {
                    elevator.addCommand({
                      type: ElevatorCommandType.GO_TO_FLOOR,
                      floor: floorIndex,
                    });
                  }}
                  className={`floor-column elevator-floor ${
                    downwardHighlight ? "floor-queued" : ""
                  }  ${floorIndex == currentFloor ? "floor-current" : ""}`}
                >
                  <span>{floorIndex}</span>
                </div>
                <div className="floor-column">
                  {floorIndex < floors - 1 && (
                    <button
                      onClick={() => {
                        elevator.addCommand({
                          type: ElevatorCommandType.PICK_UP,
                          floor: floorIndex,
                        });
                      }}
                    >
                      ▲
                    </button>
                  )}
                  {floorIndex > 0 && (
                    <button
                      onClick={() => {
                        elevator.addCommand({
                          type: ElevatorCommandType.PICK_DOWN,
                          floor: floorIndex,
                        });
                      }}
                    >
                      ▼
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ElevatorDemo;

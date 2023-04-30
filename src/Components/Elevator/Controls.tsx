import React, { useContext } from "react";
import ElevatorContext from "./context";
import { ElevatorCommandType } from "./types";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ArrowUpwardOutlined from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownwardOutlined";
import IconButton from "@mui/material/IconButton";

function ElevatorControls() {
  const { elevator, elevatorState } = useContext(ElevatorContext);
  const floors = elevator.floors;
  let levels = new Array(floors).fill(0);

  const { floor: currentFloor, downward, upward } = elevatorState;

  return (
    <div className="row elevator-queues">
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
        style={{ margin: 0, paddingBottom: 0 }}
      >
        {levels.map((_, i) => {
          let floorIndex = floors - i - 1;
          let downwardHighlight = downward[floorIndex];
          let upwardHighlight = upward[floorIndex];

          return (
            <TimelineItem
              className={`elevator-level`}
              key={i}
              style={{ margin: 0, marginTop: 10, height: "70px" }}
            >
              {/* Floor */}
              <TimelineSeparator>
                <TimelineDot>
                  <div className="floor-number">{floorIndex}</div>
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {/* <div
                  onClick={() => {
                    elevator.addCommand({
                      type: ElevatorCommandType.GO_TO_FLOOR,
                      floor: floorIndex,
                    });
                  }}
                  className={`floor-column elevator-floor ${
                    downwardHighlight ? "floor-queued" : ""
                  }  ${floorIndex === currentFloor ? "floor-current" : ""}`}
                >
                  <span>Floor {floorIndex}</span>
                </div> */}
                <div className="floor-column">
                  {floorIndex < floors - 1 && (
                    <IconButton
                      className={`elevator-floor-button ${
                        upwardHighlight ? "highlight" : ""
                      }`}
                      onClick={() => {
                        elevator.addCommand({
                          type: ElevatorCommandType.PICK_UP,
                          floor: floorIndex,
                        });
                      }}
                    >
                      <ArrowUpwardOutlined
                        color={upwardHighlight ? "primary" : undefined}
                      />
                    </IconButton>
                  )}
                  {floorIndex > 0 && (
                    <IconButton
                      className={`elevator-floor-button ${
                        downwardHighlight ? "highlight" : ""
                      }`}
                      onClick={() => {
                        elevator.addCommand({
                          type: ElevatorCommandType.PICK_DOWN,
                          floor: floorIndex,
                        });
                      }}
                    >
                      <ArrowDownwardOutlined
                        color={downwardHighlight ? "primary" : undefined}
                      />
                    </IconButton>
                  )}
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}

export default ElevatorControls;

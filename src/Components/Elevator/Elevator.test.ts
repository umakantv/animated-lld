import { Elevator } from "./Elevator";
import {
  ElevatorCommandType,
  ElevatorData,
  ElevatorDirection,
  ELEVATOR_STATE_CHANGE,
} from "./types";

function checkPickAndDrop({
  pickUpFloor,
  dropFloor,
  initialCommandType,
  floors = 10,
}: {
  pickUpFloor: number;
  dropFloor: number;
  initialCommandType: ElevatorCommandType;
  floors?: number;
}) {
  const elevator = new Elevator(10);
  let previousState: ElevatorData, newState: ElevatorData;

  elevator.addListener(ELEVATOR_STATE_CHANGE, (data) => {
    previousState = data.previousState;
    newState = data.newState;
  });

  // Command to pick up from 8th Floor
  elevator.addCommand({
    floor: pickUpFloor,
    type: initialCommandType,
  });

  // Check stations are updated properly by addCommand function
  let stations = elevator.getStations();
  expect(stations.upward[pickUpFloor]).toBe(true);

  // Check next step function is giving correct data
  let nextStep = elevator.getNextStep();
  expect(nextStep.direction).toBe(ElevatorDirection.UP);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Move to the 8th floor
  elevator.goToNextStep();

  // After reaching the 8th floor, elevator is idle at the 8th floor
  stations = elevator.getStations();
  expect(stations.upward[pickUpFloor]).toBe(false);
  expect(newState!.floor).toBe(pickUpFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextStep();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Command to drop to the 5th Floor
  elevator.addCommand({
    floor: dropFloor,
    type: ElevatorCommandType.GO_TO_FLOOR,
  });

  // Check stations are updated properly by addCommand function
  stations = elevator.getStations();
  expect(stations.downward[dropFloor]).toBe(true);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextStep();
  expect(nextStep.direction).toBe(ElevatorDirection.DOWN);
  expect(nextStep.floor).toBe(dropFloor);

  elevator.goToNextStep();

  // After reaching the 3rd floor, elevator is idle at the 3rd floor
  stations = elevator.getStations();
  expect(stations.downward[dropFloor]).toBe(false);
  expect(newState!.floor).toBe(dropFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextStep();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(dropFloor);
}

it("test add command and pick from 8th floor and drop on 3rd floor ", () => {
  let pickUpFloor = 8,
    dropFloor = 3;

  checkPickAndDrop({
    pickUpFloor,
    dropFloor,
    initialCommandType: ElevatorCommandType.PICK_UP,
  });
});

it("test add command and pick (down) from 4th floor and drop on 3rd floor", () => {
  let pickUpFloor = 4,
    dropFloor = 2;

  checkPickAndDrop({
    pickUpFloor,
    dropFloor,
    floors: 5,
    initialCommandType: ElevatorCommandType.PICK_DOWN,
  });
});

it("test add command and throw error", () => {
  const elevator = new Elevator(3);

  expect(() => {
    elevator.addCommand({
      floor: -4,
      type: ElevatorCommandType.PICK_UP,
    });
  }).toThrowError();

  expect(() => {
    elevator.addCommand({
      floor: 7,
      type: ElevatorCommandType.PICK_UP,
    });
  }).toThrowError();
});

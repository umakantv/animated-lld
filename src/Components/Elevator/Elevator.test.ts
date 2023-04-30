import { Elevator } from "./Elevator";
import {
  ElevatorCommandType,
  ElevatorData,
  ElevatorDirection,
  ELEVATOR_STATE_CHANGE,
} from "./types";

it("test add command and pick from 8th floor and drop on 3rd floor ", () => {
  let pickUpFloor = 8,
    dropFloor = 3;

  const elevator = new Elevator(10);
  let previousState: ElevatorData, newState: ElevatorData;

  elevator.addListener(ELEVATOR_STATE_CHANGE, (data) => {
    previousState = data.previousState;
    newState = data.newState;
  });

  // Command to pick up from 8th Floor
  elevator.addCommand({
    floor: pickUpFloor,
    type: ElevatorCommandType.GO_DOWN,
  });

  // Check requests are updated properly by addCommand function
  let requests = elevator.getRequests();
  expect(requests[pickUpFloor].goDown).toBe(true);

  // Check next step function is giving correct data
  let nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.DOWN);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Move to the 8th floor
  elevator.goToNextStep();

  // After reaching the 8th floor, elevator is idle at the 8th floor
  requests = elevator.getRequests();
  expect(requests[pickUpFloor].goDown).toBe(false);
  expect(requests[pickUpFloor].drop).toBe(false);
  expect(newState!.floor).toBe(pickUpFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Command to drop to the 5th Floor
  elevator.addCommand({
    floor: dropFloor,
    type: ElevatorCommandType.GO_TO_FLOOR,
  });

  // Check stations are updated properly by addCommand function
  requests = elevator.getRequests();
  expect(requests[dropFloor].drop).toBe(true);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.DOWN);
  expect(nextStep.floor).toBe(dropFloor);

  elevator.goToNextStep();

  // After reaching the 3rd floor, elevator is idle at the 3rd floor
  requests = elevator.getRequests();
  expect(requests[dropFloor].drop).toBe(false);
  expect(newState!.floor).toBe(dropFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(dropFloor);
});

it("test add command and pick (down) from 4th floor and drop on 3rd floor", () => {
  let pickUpFloor = 4,
    dropFloor = 2;

  const elevator = new Elevator(10);

  let previousState: ElevatorData, newState: ElevatorData;

  elevator.addListener(ELEVATOR_STATE_CHANGE, (data) => {
    previousState = data.previousState;
    newState = data.newState;
  });

  // Command to pick up from 8th Floor
  elevator.addCommand({
    floor: pickUpFloor,
    type: ElevatorCommandType.GO_DOWN,
  });

  // Check requests are updated properly by addCommand function
  let requests = elevator.getRequests();
  expect(requests[pickUpFloor].goDown).toBe(true);

  // Check next step function is giving correct data
  let nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.DOWN);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Move to the 4th floor
  elevator.goToNextStep();

  // After reaching the 8th floor, elevator is idle at the 8th floor
  requests = elevator.getRequests();
  expect(requests[pickUpFloor].goDown).toBe(false);
  expect(requests[pickUpFloor].drop).toBe(false);
  expect(newState!.floor).toBe(pickUpFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(pickUpFloor);

  // Command to drop to the 5th Floor
  elevator.addCommand({
    floor: dropFloor,
    type: ElevatorCommandType.GO_TO_FLOOR,
  });

  // Check stations are updated properly by addCommand function
  requests = elevator.getRequests();
  expect(requests[dropFloor].drop).toBe(true);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.DOWN);
  expect(nextStep.floor).toBe(dropFloor);

  elevator.goToNextStep();

  // After reaching the 3rd floor, elevator is idle at the 3rd floor
  requests = elevator.getRequests();
  expect(requests[dropFloor].drop).toBe(false);
  expect(newState!.floor).toBe(dropFloor);
  expect(newState!.direction).toBe(ElevatorDirection.IDLE);

  // Check next step function is giving correct data again
  nextStep = elevator.getNextRequest();
  expect(nextStep.direction).toBe(ElevatorDirection.IDLE);
  expect(nextStep.floor).toBe(dropFloor);
});

it("test add command and throw error", () => {
  const elevator = new Elevator(3);

  expect(() => {
    elevator.addCommand({
      floor: -4,
      type: ElevatorCommandType.GO_UP,
    });
  }).toThrowError();

  expect(() => {
    elevator.addCommand({
      floor: 7,
      type: ElevatorCommandType.GO_UP,
    });
  }).toThrowError();
});

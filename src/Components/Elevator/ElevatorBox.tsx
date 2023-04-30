import React, { useContext } from "react";
import ElevatorContext from "./context";
import { motion } from "framer-motion";
import elevator from "./elevator.png";

function ElevatorBox() {
  const { elevatorState } = useContext(ElevatorContext);

  const { floor: currentFloor } = elevatorState;

  return (
    <div className="elevator-box-container">
      <motion.div
        className="elevator-box"
        animate={{ y: -10 - currentFloor * 80 }}
        transition={{ type: "just" }}
      >
        <img src={elevator} style={{ width: "100%" }} alt="elevator" />
      </motion.div>
    </div>
  );
}

export default ElevatorBox;

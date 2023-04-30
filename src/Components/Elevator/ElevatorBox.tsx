import React, { useContext } from "react";
import ElevatorContext from "./context";
import { motion } from "framer-motion";

function ElevatorBox() {
  const { elevatorState } = useContext(ElevatorContext);

  const { floor: currentFloor } = elevatorState;

  return (
    <div className="elevator-box-container">
      <motion.div
        className="elevator-box"
        animate={{ y: -currentFloor * 100 }}
        transition={{ type: "just" }}
      />
    </div>
  );
}

export default ElevatorBox;

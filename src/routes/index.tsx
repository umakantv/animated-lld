import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ElevatorDemo from "../Pages/Elevator";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Home</h2>
            </div>
          }
        />

        <Route
          path="/elevator"
          element={
            <div>
              <h2>Elevator</h2>
              <ElevatorDemo floors={5} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;

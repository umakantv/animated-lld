import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ElevatorDemo from "../Pages/Elevator";

const AppRouter = () => {
  return (
    <Router basename="/animated-lld">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Home</h2>
              <Link to="/elevator">Elevator</Link>
            </div>
          }
        />

        <Route
          path="/elevator"
          element={
            <div>
              <h2>Elevator</h2>
              <ElevatorDemo />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;

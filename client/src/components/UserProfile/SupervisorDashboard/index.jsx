import React from "react";
import "./indexOff.css";
import Sidebar from "./Sidebar";
import MainDash from "./MainDash";

const SupervisorDashboard = (info) => {
  return (
    <div className="SupervisorDashboard">
      <div className="SuperGlass">
        <Sidebar />
        <MainDash info={info} />
      </div>
    </div>
  );
};

export default SupervisorDashboard;

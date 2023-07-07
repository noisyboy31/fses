import React from "react";
import "./indexCord.css";
import Sidebar from "./Sidebar";
import MainDash from "./MainDash";

const CoodinatorDashboard = (info) => {
  return (
    <div className="CoodinatorDashboard">
      <div className="CordGlass">
        <Sidebar />
        <MainDash info={info} />
      </div>
    </div>
  );
};

export default CoodinatorDashboard;
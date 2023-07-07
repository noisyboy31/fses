// eslint-disable-next-line
import React from "react";
import "./indexOffAst.css";
import Sidebar from "./Sidebar";
import MainDash from "./MainDash";
import RightSide from "./RightSide";

export default function OffAssistantDashboard() {
  return (
    <div className="OffAssistantDashboard">
      <div className="OffGlass">
        <Sidebar />
        <MainDash />
        <RightSide />
      </div>
    </div>
  );
}

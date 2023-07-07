import React from "react";
import { useLocation } from "react-router-dom";
import SupervisorDashboard from "./SupervisorDashboard/index";
import OffAssistantDashboard from "./OffAssistantDashboard/index";
import CoodinatorDashboard from './CoodinatorDashboard/index';

const UserProfile = () => {
  const location = useLocation();
  const { position, info } = location.state || "";

  const renderDashboard = () => {
    switch (position) {
      case "Office Assistant":
        return <OffAssistantDashboard />;
      case "Research Supervisor":
        return <SupervisorDashboard info={info} />;
      case "Program Coordinator":
        return <CoodinatorDashboard /> ;
      default:
        return null;
    }
  };

  return <>{renderDashboard()}</>;
};

export default UserProfile;

import React from "react";
import "./indexOff.css";
import BasicTable from "./Table";

const MainDash = (info) => {
  const { username, roles, position } = info?.info?.info;
  return (
    <div className="MainDashSup">
      <span style={{ fontWeight: "bold", fontSize: "30px" }}>
        Dashboard
      </span>
      <BasicTable username={username} roles={roles} position={position} />
    </div>
  );
};

export default MainDash;

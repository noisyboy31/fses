import React from "react";
import "./indexCord.css";
import BasicTable from "./Table";
import Cards from "./Cards";

const MainDash = () => {
  return (
    <div className="MainDashCord">
      <span style={{ fontWeight: "bold", fontSize: "30px", marginTop: "70px" }}>
        Dashboard
      </span>
      <Cards />
      <BasicTable />
    </div>
  );
};

export default MainDash;

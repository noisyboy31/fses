import React from "react";
import "./indexOffAst.css";
import Cards from "./Cards";
import BasicTable from "./Table";

const MainDash = () => {
  return (
    <div className="MainDash">
      <span style={{ fontWeight: "bold", fontSize: "30px" }}>Dashboard</span>
      <Cards />
      <BasicTable />
    </div>
  );
};

export default MainDash;

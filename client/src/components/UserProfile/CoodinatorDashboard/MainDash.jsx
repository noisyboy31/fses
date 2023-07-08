import React from "react";
import "./indexCord.css";
import BasicTable from "./Table";
import Cards from "./Cards";

const MainDash = () => {
  return (
    <div className="MainDashCord">
      <span style={{ fontWeight: "bold", fontSize: "30px"}}>
        Dashboard
      </span>
      <h2 style={{marginBottom: "12px", color:"#ff919d"}}>
      <span style={{color: 'black'}}>Welcome Back,</span> DR HAZLIFAH BINTI MOHD RUSLI
      </h2>
      <Cards />
      <BasicTable />
    </div>
  );
};

export default MainDash;

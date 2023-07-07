import React from "react";
import "./indexOffAst.css";
import Updates from "./Updates";
import CustomerReview from "./CustomerReview";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>Updates</span>
        <Updates />
      </div>
      <div>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}></span>
        {/* <CustomerReview /> */}
      </div>
    </div>
  );
};

export default RightSide;

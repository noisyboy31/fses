import React from "react";
import "./indexCord.css";
import { CardsDataTwoCordinator } from "./Data/Charts";
import CardTwoCoodinator from './CardTwoCoodinator';


const Cards = () => {
  return (
    <div className="Cards">
      {CardsDataTwoCordinator.map((cardT, index) => {
        return (
          <div className="parentContainer" key={index}>
            <CardTwoCoodinator
              title={cardT.title}
              color={cardT.color}
              barValue={cardT.barValue}
              value={cardT.value}
              png={cardT.png}
              series={cardT.series}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;

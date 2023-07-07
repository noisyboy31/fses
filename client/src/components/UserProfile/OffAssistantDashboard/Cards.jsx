import React from "react";
import "./indexOffAst.css";
import { cardsData, cardsDataTwo } from "./Data/Charts";
import Card from "./Card";
import CardTwo from "./CardTwo";

const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
            />
          </div>
        );
      })}
      {cardsDataTwo.map((cardT, index) => {
        return (
          <div className="parentContainer" key={index}>
            <CardTwo
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

// Sidebar imports
import { UilCloudUpload, UilChartBar } from "@iconscout/react-unicons";

export const cardsData = [
  {
    title: "Upload File",
    color: {
      backGround: "linear-gradient(180deg, #FC9 0%, #bb67ff 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "XSLX",
    png: UilCloudUpload,
    series: [
      {
        name: "Upload File",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
];

export const cardsDataTwo = [
  {
    title: "BarChart",
    color: {
      backGround: "linear-gradient(180deg, #FF917f 0%, #FC9 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "Chart",
    png: UilChartBar,
    series: [
      {
        name: "BarChart",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
];

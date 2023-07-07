// eslint-disable-next-line
import React, { useState, useRef, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import { makeStyles } from "tss-react/mui";
import axios from "axios";
import Chart from "react-apexcharts";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonStyle: {
    textAlign: "center",
    marginBottom: "20px",
    margin: theme.spacing(2),
  },
}));

const CardTwoCoodinator = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={setExpanded}>
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>${param.value}</span>
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded }) {
  const classes = useStyles();
  const [tableData, setTableData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "grouped-bar",
        stacked: false,
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
  });

  const fetchData = async () => {
    try {
      const itemResponse = await axios.get("http://localhost:8080/api/list");
      const itemId = itemResponse.data.items;
      const ids = itemId.map((item) => item._id); // item.file
      const data = [];

      for (const id of ids) {
        const response = await axios.get(
          `http://localhost:8080/api/items/${id}`
        );

        for (let i = 0; i < response.data.length; i++) {
          const excelBuffer = response.data[i].data;
          data.push(excelBuffer);
        }
      }
      setTableData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching data
    }
  };

  const renderData = () => {
    const formattedData = [];
    const xaxisCategories = [];
    const series1Data = {};
    const series2Data = {};
    const series3Data = {};

    if (tableData && tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        let record = tableData[i];
        if (record && Array.isArray(record) && record.length > 0) {
          for (let j = 0; j < record.length; j++) {
            if (tableData[i] && tableData[i][j]) {
              let records = tableData[i][j];

              const programValue = records?.PROGRAM ?? "";
              const currentSemValue = records?.["CURRENT SEM"] ?? "";
              if (!xaxisCategories.includes(programValue)) {
                xaxisCategories.push(programValue);
              }
              formattedData.push({
                title: "NAME",
                key: "NAME",
                value: records?.NAME ?? "",
              });
              formattedData.push({
                title: "REVIVA",
                key: "REVIVA",
                value: records?.["REVIVA"] ?? "",
              });
              formattedData.push({
                title: "PROGRAM",
                key: "PROGRAM",
                value: programValue,
              });
              formattedData.push({
                title: "CURRENT SEM",
                key: "CURRENT SEM",
                value: currentSemValue,
              });
              formattedData.push({
                title: "MAIN SUPERVISOR",
                key: "MAIN SUPERVISOR",
                value: records?.["MAIN SUPERVISOR"] ?? "",
              });
              formattedData.push({
                title: "CO-SUPERVISOR 1",
                key: "CO-SUPERVISOR 1",
                value: records?.["CO-SUPERVISOR 1"] ?? "",
              });
              if (programValue && currentSemValue) {
                if (currentSemValue === "3/16") {
                  if (!series1Data[programValue]) {
                    series1Data[programValue] = 0;
                  }
                  series1Data[programValue] += 1;
                } else if (currentSemValue === "Re-PD") {
                  if (!series3Data[programValue]) {
                    series3Data[programValue] = 0;
                  }
                  series3Data[programValue] += 1;
                } else {
                  if (!series2Data[programValue]) {
                    series2Data[programValue] = 0;
                  }
                  series2Data[programValue] += 1;
                }
              }
            }
          }
        }
      }
    }
    // return formattedData;
    const series1 = Object.entries(series1Data).map(([key, value]) => ({
      x: key,
      y: value,
    }));

    const series2 = Object.entries(series2Data).map(([key, value]) => ({
      x: key,
      y: value,
    }));
    const series3 = Object.entries(series3Data).map(([key, value]) => ({
      x: key,
      y: value,
    }));

    const series = [
      {
        name: "Sem 3",
        data: series1,
      },
      {
        name: "Sem 4 & Above",
        data: series2,
      },
      {
        name: "Re-PD",
        data: series3,
      },
    ];
    setFormattedData(formattedData);
    setChartData((prevChartData) => ({
      ...prevChartData,
      options: {
        ...prevChartData.options,
        xaxis: {
          ...prevChartData.options.xaxis,
          categories: xaxisCategories,
        },
      },
      series,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormattedData(renderData());
  }, [tableData]);

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard">
      <span>{param.title}</span>
      <div className="chartContainer">
        <div style={{ width: "100%", height: "300px" }}>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height="100%"
            width="100%"
            type="bar"
          />
        </div>
      </div>
      <span>Last 24 hours</span>
      <div style={{ background: "white", borderRadius: "50px" }}>
        <UilTimes onClick={setExpanded} />
      </div>
    </motion.div>
  );
}

export default CardTwoCoodinator;

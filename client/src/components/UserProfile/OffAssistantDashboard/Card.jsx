// eslint-disable-next-line
import React, { useState, useRef, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import { makeStyles } from "tss-react/mui";
import axios from "axios";

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

const Card = (props) => {
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [notification, setNotification] = useState("");

  const getItem = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/list");
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNotification("Please add a name.");
      return;
    }
    if (!fileInputRef.current.files[0]) {
      setNotification("Please upload a valid file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", fileInputRef.current.files[0]);
      const res = await axios.post("http://localhost:8080/api/list", formData);
      console.log(res);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "file.xlsx";
      // link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  const handleFileChange = (event) => {
    fileInputRef.current.files = event.target.files;
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard">
      <h1
        style={{
          alignSelf: "flex-center",
          cursor: "pointer",
          display: "flex",
          color: "white",
          fontSize: "26px",
          fontWeight: "bold",
          textShadow: "0px 0px 15px white",
        }}
        className={classes.title}>
        Import or Upload Excel File
      </h1>
      <input
        type="text"
        placeholder="add name"
        onChange={(e) => setName(e.target.value)}
        style={{
          border: "1px red solix",
          borderRadius: "20px",
          textAlign: "center",
          height: "40px",
          width: "20rem",
        }}
      />
      <div className={`${classes.chartContainer} ${classes.buttonStyle}`}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="fileInput"
            style={{
              background:
                "linear-gradient(106.37deg, #ffcfd1 51.55%, #f3c6f1 90.85%)",
              fontFamily: 'inherit',
              fontSize: '100%',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              borderRadius: "20px",
              padding: "10px 20px",
              color: "black",
              cursor: "pointer",
              width: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
            Upload File
            <input
              id="fileInput"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          <span
            style={{
              background:
                "linear-gradient(106.37deg, #ffcfd1 51.55%, #f3c6f1 90.85%)",
              fontFamily: 'inherit',
              fontSize: '100%',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              borderRadius: "20px",
              padding: "10px 20px",
              color: "black",
              marginLeft: "10px",
              cursor: "pointer",
              width: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            onClick={!loading ? addItem : "please insert correct file"}>
            {!loading ? "Submit" : "Loading..."}
          </span>
        </div>
        {notification && (
          <p
            style={{
              color: "red",
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}>
            {notification}
          </p>
        )}
      </div>
      <div className="items">
        {items &&
          items.map((item) => (
            <div className="item" key={item._id}>
              <h3>{item.name}</h3>
              <button onClick={() => downloadFile(item._id)}>
                Download File
              </button>
            </div>
          ))}
      </div>
      <div style={{ background: "white", borderRadius: "50px" }}>
        <UilTimes onClick={setExpanded} />
      </div>
    </motion.div>
  );
}

export default Card;

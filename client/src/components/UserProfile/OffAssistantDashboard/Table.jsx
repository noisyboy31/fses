import "./indexOffAst.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BasicTable() {
  const [tableData, setTableData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedValues, setUpdatedValues] = useState({});

  const fetchData = async () => {
    try {
      const itemResponse = await axios.get("http://localhost:8080/api/list");
      const itemId = itemResponse.data.items;
      const ids = itemId.map((item) => item._id); // item.file
      const data = [];

      for (const id of ids) {
        if (itemId) {
          const response = await axios.get(
            `http://localhost:8080/api/items/${id}`
          );

          for (let i = 0; i < response.data.length; i++) {
            const excelBuffer = response.data[i].data;
            data.push(excelBuffer);
          }
        } else {
          const updateResponse = await axios.put(
            `http://localhost:8080/api/item/${id}`,
            updatedValues
          );
          console.log("updateResponse", updateResponse.data);
          data.push(updateResponse.data);
          console.log("update", updateResponse.data);
        }
      }
      setTableData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching data
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormattedData(renderData());
  }, [tableData, updatedValues]);

  const handleInputChange = (key, value) => {
    setUpdatedValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const renderData = () => {
    const formattedData = [];

    if (tableData && tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        let record = tableData[i];
        if (record && Array.isArray(record) && record.length > 0) {
          for (let j = 0; j < record.length; j++) {
            if (tableData[i] && tableData[i][j]) {
              let records = tableData[i][j];
              formattedData.push({
                title: "NAME",
                key: "NAME",
                value: updatedValues["NAME"] || records?.NAME || "",
              });
              formattedData.push({
                title: "REVIVA",
                key: "REVIVA",
                value: updatedValues["REVIVA"] || records?.["REVIVA"] || "",
              });
              formattedData.push({
                title: "PROGRAM",
                key: "PROGRAM",
                value: updatedValues["PROGRAM"] || records?.PROGRAM || "",
              });
              formattedData.push({
                title: "CURRENT SEM",
                key: "CURRENT SEM",
                value:
                  updatedValues["CURRENT SEM"] ||
                  records?.["CURRENT SEM"] ||
                  "",
              });
              formattedData.push({
                title: "MAIN SUPERVISOR",
                key: "MAIN SUPERVISOR",
                value:
                  updatedValues["MAIN SUPERVISOR"] ||
                  records?.["MAIN SUPERVISOR"] ||
                  "",
              });
              formattedData.push({
                title: "CO-SUPERVISOR 1",
                key: "CO-SUPERVISOR 1",
                value:
                  updatedValues["CO-SUPERVISOR 1"] ||
                  records?.["CO-SUPERVISOR 1"] ||
                  "",
              });
            }
          }
        }
      }
    }
    return formattedData;
  };

  return (
    <div className="Table">
      <h3 className="Table-heading">Report Table</h3>
      <div className="Table-container">
        {isLoading ? (
          <div className="Table-loading">Loading...</div>
        ) : tableData.length > 0 ? (
          <div className="Table-scrollable">
            <table className="Table-table">
              <thead className="Table-head">
                <tr className="Table-row-head">
                  <th className="Table-cell-head">NAME</th>
                  <th className="Table-cell-head">REVIVA</th>
                  <th className="Table-cell-head">PROGRAM</th>
                  <th className="Table-cell-head">CURRENT SEM</th>
                  <th className="Table-cell-head">MAIN SUPERVISOR</th>
                  <th className="Table-cell-head">CO-SUPERVISOR 1</th>
                </tr>
              </thead>
              <tbody className="Table-body">
                {formattedData.map((column, colIndex) => (
                  <tr className="Table-row-body" key={colIndex}>
                    <td
                      className={`Table-cell ${
                        column.key === "CO-SUPERVISOR 1" ? "multiline" : ""
                      }`}>
                      {column.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{marginTop: '180px', color: "black"}} className="Table-noData">No data available</div>
        )}
      </div>
    </div>
  );
}

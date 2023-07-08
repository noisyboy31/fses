import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "./indexCord.css";
import { dataChairperson} from "./TableData";
import {
  Paper,
  Alert,
  AlertTitle,
  Table,
  TableCell,
  FormControl,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  MenuItem,
  Select,
  Stack,
  Chip,
  Grid,
  Button,
} from "@mui/material";

export default function BasicTable() {
  const [tableData, setTableData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedValues, setUpdatedValues] = useState([]);
  const [isId, setId] = useState("");
  const [selectedRecordNo, setSelectedRecordNo] = useState([]);

  const axiosApi = axios.create({
    headers: {
      Authorization : localStorage.getItem("token")
      }
  });

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

  const fetchData = async () => {
    try {
      const itemResponse = await axiosApi.get("http://localhost:8080/api/list");
      const ids = itemResponse?.data?.items.map((item) => item._id); // item.file
      const data = [];

      for (const id of ids) {
        if (ids?.length > 0) {
          const response = await axios.get(
            `http://localhost:8080/api/items/${id}`
          );

          for (let i = 0; i < response.data.length; i++) {
            const excel = response.data[i];
            data.push(excel?.data?.map(item => ({ excelId: excel?.id, ...item })));
          }
        }
      }

      setTableData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormattedData(renderData());
  }, [tableData, updatedValues]);
  // console.log("select", selectedRecordNo);

  const generateExaminerWarningMessage = (deniedRecordNo) => {
    const warningMessage = deniedRecordNo.forEach((recordNo) =>
      toast.error(`${recordNo} : Main Supervisor | Co-Supervisor | Examiner is not Professor.`)
    );
  };

  const validateAllowExaminerRecords = (value) => {
    const isValuePROF = value?.substring(0, 4) === "PROF";
    const allowedRecordNo = [];
    const deniedRecordNo = [];

    selectedRecordNo.forEach((recordNo) => {
      const target = formattedData.find((data) => data.recordNo === recordNo);

      const isMainSupervisorPROF =
        target["MAIN SUPERVISOR"]?.substring(0, 4) === "PROF" ?? false;
      const isCoSupervisorPROF =
        target["CO-SUPERVISOR 1"]?.substring(0, 4) === "PROF" ?? false;
      const isExaminor1PROF = 
        target["EXAMINER 1"]?.substring(0, 4) === "PROF" ?? false;
      const isExaminor2PROF = 
        target["EXAMINER 2"]?.substring(0, 4) === "PROF" ?? false;
      const isExaminor3PROF = 
        target["EXAMINER 3"]?.substring(0, 4) === "PROF" ?? false;

      if ((isMainSupervisorPROF || isCoSupervisorPROF) && !isValuePROF) {
        deniedRecordNo.push(recordNo);
      } else if (!isMainSupervisorPROF && !isCoSupervisorPROF && isValuePROF) {
        deniedRecordNo.push(recordNo);
      } else if (isExaminor1PROF || isExaminor2PROF || isExaminor3PROF) {
        deniedRecordNo.push(recordNo);
      } else {
        allowedRecordNo.push(recordNo);
      }
    });

    return { allowedRecordNo, deniedRecordNo };
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
              const excelId = records?.["excelId"];
              const recordNo = records?.["NO"];
              
              const latestChairman = updatedValues.find(
                (item) =>
                  item.recordNo === recordNo && item.key === "CHAIRPERSON"
              )?.value;

              formattedData.push({
                excelId,
                recordNo,
                ["NAME"]: records["NAME"],
                ["CURRENT SEM"]: records["CURRENT SEM"],
                ["MAIN SUPERVISOR"]: records["MAIN SUPERVISOR"],
                ["CO-SUPERVISOR 1"]: records["CO-SUPERVISOR 1"],
                ["REVIVA"]: records["REVIVA"],
                ["PROGRAM"]: records["PROGRAM"],
                ["PROPOSAL"]: records["PROPOSAL"],
                ["EXAMINER 1"]: records["EXAMINER 1"],
                ["EXAMINER 2"]: records["EXAMINER 2"],
                ["EXAMINER 3"]: records["EXAMINER 3"],
                ["CHAIRPERSON"]: latestChairman ?? records["CHAIRPERSON"]
              });
            }
          }
        }
      }
    }
    return formattedData;
  };

  const submitData = async (requiredUpdateData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/submitData`,
        requiredUpdateData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (key, value) => {
    let requiredUpdateValues = updatedValues.filter(
      (item) => !(item.key === key && selectedRecordNo.includes(item.recordNo))
    );

    const { allowedRecordNo, deniedRecordNo } =
      key === "CHAIRPERSON"
        ? validateAllowExaminerRecords(value)
        : { allowedRecordNo: selectedRecordNo };

    const updateRecords = allowedRecordNo.map((recordNo) => ({
      recordNo: Number(recordNo),
      key,
      value,
    }));

    if (deniedRecordNo?.length > 0) {
      generateExaminerWarningMessage(deniedRecordNo);
    }

    setUpdatedValues([...requiredUpdateValues, ...updateRecords]);
  };

  //console.log("formattedData", formattedData);
  const handleFormSubmit = async () => {
    const requiredUpdateRecordNo = [
      ...new Set(updatedValues.map((item) => item.recordNo)),
    ];

    const requiredUpdateData = requiredUpdateRecordNo.map((recordNo) => {
      const tableValue = formattedData?.find((item) => item.recordNo === recordNo);

      return {
        "excelId": tableValue['excelId'],
        "recordNo": tableValue["recordNo"],
        "PROPOSAL": tableValue["PROPOSAL"] ?? "",
        "EXAMINER 1": tableValue["EXAMINER 1"] ?? "",
        "EXAMINER 2": tableValue["EXAMINER 2"] ?? "",
        "EXAMINER 3": tableValue["EXAMINER 3"] ?? "",
        "CHAIRPERSON": tableValue["CHAIRPERSON"] ?? ""
      };
    });

    try {
      await submitData(requiredUpdateData);
      console.log("Form submitted successfully.");
      setUpdatedValues([]);
      setSelectedRecordNo([]);
    } catch (error) {
      console.log("Form submission error:", error);
    } finally {
      const requiredExcelId = [...new Set(requiredUpdateData.map(item => item.excelId))];
      console.log(requiredExcelId)
      requiredExcelId.forEach(reportId => downloadFile(reportId));
      fetchData();
    }
  };

  const displayLongText = (value = "") => {
    return value?.length > 0 ? value?.match(/.{1,15}/g)?.join("\n") : "";
  };

  return (
    <div style={{marginTop : "2rem"}} className="TableCord">
      <Toaster />
      <h1 style={{marginBottom: "6px",marginTop: "14px", color:"#ff919d", fontSize: "2.3vmin", fontWeight: "bold"}}>
      <span style={{color: 'black'}}>Report Table</span>
      </h1>
      <TableContainer
        component={Paper}
        style={{
          boxShadow: "0px 13px 20px 0px #80808029",
          borderRadius: "44px",background: "hotpink", maxHeight: "500px", maxWidth: "1188px"
        }}>
        <div className="Table-scrollableCord">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="Table-headCord">
            <TableRow>
                <TableCell align="left">NO</TableCell>
                <TableCell align="left">NAME</TableCell>
                <TableCell align="left">REVIVA</TableCell>
                <TableCell align="left">PROGRAM</TableCell>
                <TableCell align="left">CURRENT SEM</TableCell>
                <TableCell align="left">MAIN SUPERVISOR</TableCell>
                <TableCell align="left">CO-SUPERVISOR 1</TableCell>
                <TableCell align="left">PROPOSAL</TableCell>
                <TableCell align="left">EXAMINER 1</TableCell>
                <TableCell align="left">EXAMINER 2</TableCell>
                <TableCell align="left">EXAMINER 3</TableCell>
                <TableCell align="left">CHAIRPERSON</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="Table-bodyCord" style={{ color: "white" }}>
              {formattedData.map(({ isEditable, ...item }, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="left">{item["recordNo"]}</TableCell>
                    <TableCell align="left">{item["NAME"]}</TableCell>
                    <TableCell align="left">{item["REVIVA"]}</TableCell>
                    <TableCell align="left">{item["PROGRAM"]}</TableCell>
                    <TableCell align="left">{item["CURRENT SEM"]}</TableCell>
                    <TableCell align="left">{item["MAIN SUPERVISOR"]}</TableCell>
                    <TableCell align="left">{item["CO-SUPERVISOR 1"]}</TableCell>
                    <TableCell align="left">{displayLongText(item["PROPOSAL"])}</TableCell>
                    <TableCell align="left">{displayLongText(item["EXAMINER 1"])}</TableCell>
                    <TableCell align="left">{displayLongText(item["EXAMINER 2"])}</TableCell>
                    <TableCell align="left">{displayLongText(item["EXAMINER 3"])}</TableCell>
                    <TableCell align="left">{displayLongText(item["CHAIRPERSON"])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>  
      </TableContainer>
      <div style={{ marginTop: "15px", justifyContent: "center" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={6}>
            <FormControl fullWidth>
              <label htmlFor="recordNo" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize:"17px"}}>Number</label>
              <Select
                multiple
                style={{ borderRadius: "20px", border: "1px solid #ff919d" }}
                value={selectedRecordNo}
                onChange={(e) => setSelectedRecordNo([...e.target.value])}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Stack>
                )}>
                {formattedData
                  ?.map((option, index) => (
                    <MenuItem value={option?.recordNo} key={index}>
                      {option?.recordNo}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={6}>
            <FormControl fullWidth>
              <label htmlFor="chairperson" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize:"17px"}}>Chairperson:</label>
              <select
                style={{background: 'transparent', border: "3px solid #ff919d", borderRadius: "20px"}}
                id="chairperson"
                name="chairperson"
                onChange={(e) =>
                  handleInputChange("CHAIRPERSON", e.target.value)
                }>
                {dataChairperson.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{textAlign: "center"}} >
            <div className="Form-group">
              <Button style={{background: "#ff919d", borderRadius: "40px"}} onClick={handleFormSubmit} variant="contained">
                SUBMIT
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "./indexOff.css";
import { dataExamOne, dataExamThree, dataExamTwo } from "./TableData";
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

export default function BasicTable(props) {
  const { username, roles, position } = props;
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
      console.log(data)
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
      toast.error(`${recordNo} : Main Supervisor | Co-Supervisor is not Professor.`)
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

      if ((isMainSupervisorPROF || isCoSupervisorPROF) && !isValuePROF) {
        deniedRecordNo.push(recordNo);
      } else if (!isMainSupervisorPROF && !isCoSupervisorPROF && isValuePROF) {
        deniedRecordNo.push(recordNo);
      } else {
        allowedRecordNo.push(recordNo);
      }
    });

    return { allowedRecordNo, deniedRecordNo };
  };

  const renderData = () => {
    const formattedData = [];
    const formattedDataNew = [];

    if (tableData && tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        let record = tableData[i];
        if (record && Array.isArray(record) && record.length > 0) {
          for (let j = 0; j < record.length; j++) {
            if (tableData[i] && tableData[i][j]) {
              let records = tableData[i][j];
              const excelId = records?.["excelId"];
              const recordNo = records?.["NO"];
              const displaySupervisorData = (supervisorName, isEditable) => {
                const latestProposal = updatedValues.find(
                  (item) =>
                    item.recordNo === recordNo && item.key === "PROPOSAL"
                )?.value;
                const latestExaminer1 = updatedValues.find(
                  (item) =>
                    item.recordNo === recordNo && item.key === "EXAMINER 1"
                )?.value;
                const latestExaminer2 = updatedValues.find(
                  (item) =>
                    item.recordNo === recordNo && item.key === "EXAMINER 2"
                )?.value;
                const latestExaminer3 = updatedValues.find(
                  (item) =>
                    item.recordNo === recordNo && item.key === "EXAMINER 3"
                )?.value;

                formattedDataNew.push({
                  excelId,
                  recordNo,
                  ["MAIN SUPERVISOR"]: supervisorName,
                  ["NAME"]: records["NAME"],
                  ["CURRENT SEM"]: records["CURRENT SEM"],
                  ["CO-SUPERVISOR 1"]: records["CO-SUPERVISOR 1"],
                  ["REVIVA"]: records["REVIVA"],
                  ["PROGRAM"]: records["PROGRAM"],
                  ["PROPOSAL"]: latestProposal ?? records["PROPOSAL"],
                  ["EXAMINER 1"]: latestExaminer1 ?? records["EXAMINER 1"],
                  ["EXAMINER 2"]: latestExaminer2 ?? records["EXAMINER 2"],
                  ["EXAMINER 3"]: latestExaminer3 ?? records["EXAMINER 3"],
                  isEditable,
                });

                formattedData.push({
                  recordNo: recordNo,
                  title: "MAIN SUPERVISOR",
                  key: "MAIN SUPERVISOR",
                  value: supervisorName,
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "CO-SUPERVISOR 1",
                  key: "CO-SUPERVISOR 1",
                  value:
                    updatedValues["CO-SUPERVISOR 1"] ||
                    records?.["CO-SUPERVISOR 1"] ||
                    "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "NAME",
                  key: "NAME",
                  value: updatedValues["NAME"] || records?.NAME || "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "REVIVA",
                  key: "REVIVA",
                  value: updatedValues["REVIVA"] || records?.["REVIVA"] || "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "PROGRAM",
                  key: "PROGRAM",
                  value: updatedValues["PROGRAM"] || records?.PROGRAM || "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "CURRENT SEM",
                  key: "CURRENT SEM",
                  value:
                    updatedValues["CURRENT SEM"] ||
                    records?.["CURRENT SEM"] ||
                    "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "PROPOSAL",
                  key: "PROPOSAL",
                  value:
                    latestProposal ||
                    `${recordNo} ${records?.["PROPOSAL"] ?? ""}` ||
                    "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "EXAMINER 1",
                  key: "EXAMINER 1",
                  value:
                    updatedValues["EXAMINER 1"] ||
                    records?.["EXAMINER 1"] ||
                    "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "EXAMINER 2",
                  key: "EXAMINER 2",
                  value:
                    updatedValues["EXAMINER 2"] ||
                    records?.["EXAMINER 2"] ||
                    "",
                });
                formattedData.push({
                  recordNo: recordNo,
                  title: "EXAMINER 3",
                  key: "EXAMINER 3",
                  value:
                    updatedValues["EXAMINER 3"] ||
                    records?.["EXAMINER 3"] ||
                    "",
                });
              };

              if (
                [
                  tableData[i][j]["MAIN SUPERVISOR"],
                  tableData[i][j]["CO-SUPERVISOR 1"],
                ].includes(`${roles.join(" ")} ${username}`)
              ) {
                const isEditable =
                  tableData[i][j]["MAIN SUPERVISOR"] ===
                  `${roles.join(" ")} ${username}`;

                displaySupervisorData(
                  `${roles.join(" ")} ${username}`,
                  isEditable
                );
              }
            }
          }
        }
      }
    }
    return formattedDataNew;
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
      key === "EXAMINER 1"
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
      fetchData();
    }
  };

  const displayLongText = (value = "") => {
    return value?.length > 0 ? value?.match(/.{1,15}/g)?.join("\n") : "";
  };

  return (
    <div className="TableSup">
      <h2 style={{marginBottom: "12px", marginTop: "14px", color:"#ff919d", fontSize: "2.3vmin"}}>
      <span style={{color: 'black'}}>Welcome Back,</span> {roles.join(" ")} {username}
      </h2>
      <Toaster />
      <h1 style={{marginBottom: "6px",marginTop: "14px", color:"#ff919d", fontSize: "2.3vmin", fontWeight: "bold"}}>
      <span style={{color: 'black'}}>Report Table</span>
      </h1>
      <TableContainer
        component={Paper}
        style={{
          boxShadow: "0px 13px 20px 0px #80808029",
          borderRadius: "44px", background: "hotpink", maxHeight: "500px", maxWidth: "1188px", minWidth: "600px",
        }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="Table-headSup">
            <TableRow>
              <TableCell align="left">NO</TableCell>
              <TableCell align="left">MAIN SUPERVISOR</TableCell>
              <TableCell align="left">NAME</TableCell>
              <TableCell align="left">REVIVA</TableCell>
              <TableCell align="left">PROGRAM</TableCell>
              <TableCell align="left">CURRENT SEM</TableCell>
              <TableCell align="left">CO-SUPERVISOR 1</TableCell>
              <TableCell align="left">PROPOSAL</TableCell>
              <TableCell align="left">EXAMINER 1</TableCell>
              <TableCell align="left">EXAMINER 2</TableCell>
              <TableCell align="left">EXAMINER 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="Table-body" style={{ color: "white" }}>
            {formattedData.map(({ isEditable, ...item }, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left">{item["recordNo"]}</TableCell>
                <TableCell align="left">{item["MAIN SUPERVISOR"]}</TableCell>
                <TableCell align="left">{item["NAME"]}</TableCell>
                <TableCell align="left">{item["REVIVA"]}</TableCell>
                <TableCell align="left">{item["PROGRAM"]}</TableCell>
                <TableCell align="left">{item["CURRENT SEM"]}</TableCell>
                <TableCell align="left">{item["CO-SUPERVISOR 1"]}</TableCell>
                <TableCell align="left">
                  {isEditable
                    ? displayLongText(item["PROPOSAL"])
                    : "not applicable"}
                </TableCell>
                <TableCell align="left">
                  {isEditable
                    ? displayLongText(item["EXAMINER 1"])
                    : "not applicable"}
                </TableCell>
                <TableCell align="left">
                  {isEditable
                    ? displayLongText(item["EXAMINER 2"])
                    : "not applicable"}
                </TableCell>
                <TableCell align="left">
                  {isEditable
                    ? displayLongText(item["EXAMINER 3"])
                    : "not applicable"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "15px", justifyContent: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <label htmlFor="examiner1" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize: "17px"}}>Number</label>
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
                  ?.filter((item) => item.isEditable)
                  ?.map((option, index) => (
                    <MenuItem value={option?.recordNo} key={index}>
                      {option?.recordNo}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <label htmlFor="examiner1"style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize: "17px"}}>Examiner 1:</label>
              <select
                style={{background: 'transparent', border: "3px solid #ff919d", borderRadius: "20px"}}
                id="examiner1"
                name="examiner1"
                onChange={(e) =>
                  handleInputChange("EXAMINER 1", e.target.value)
                }>
                {dataExamOne.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <label htmlFor="examiner2" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize: "17px"}}>Examiner 2:</label>
              <select
               style={{background: 'transparent', border: "3px solid #ff919d", borderRadius: "20px"}}
                id="examiner2"
                name="examiner2"
                onChange={(e) =>
                  handleInputChange("EXAMINER 2", e.target.value)
                }>
                {dataExamTwo.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth>
              <label htmlFor="examiner3" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize: "17px"}}>Examiner 3:</label>
              <select
               style={{background: 'transparent', border: "3px solid #ff919d", borderRadius: "20px"}}
                id="examiner3"
                name="examiner3"
                onChange={(e) =>
                  handleInputChange("EXAMINER 3", e.target.value)
                }>
                {dataExamThree.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={12}>
            <FormControl fullWidth>
              <label htmlFor="proposal" style={{fontWeight:"inherit", fontSize:"bold", textAlign: "center", fontSize: "17px"}}>PROPOSAL:</label>
              <textarea
                style={{minlength:"10", maxlength:"40", background: 'transparent', border: "3px solid #ff919d", borderRadius: "20px"}}
                type="text"
                id="proposal"
                name="proposal"
                onChange={(e) => handleInputChange("PROPOSAL", e.target.value)}
              />
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

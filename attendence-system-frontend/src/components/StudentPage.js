import React, { useState, useEffect } from "react";

import axios from "axios";
import AttendenceTable from "./AttendenceTable";
import ButtonsPanels from "./ButtonsPanel";

const Home = () => {
  const [showTable, setShowTable] = useState(true);
  const [attendence, setAttendence] = useState();

  const getAttendence = () => {
    axios
      .get("http://localhost:8000/getStudentRequests", {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setAttendence(response.data.student.requests);
      });
  };

  useEffect(() => {
    getAttendence();
  }, []);

  const showTableHandler = () => {
    setShowTable(!showTable);
  };

  return (
    <>
      <ButtonsPanels
        setAttendence={setAttendence}
        showTableHandler={showTableHandler}
        showTable={showTable}
      />
      {showTable ? <AttendenceTable attendence={attendence} /> : null}
    </>
  );
};

export default Home;

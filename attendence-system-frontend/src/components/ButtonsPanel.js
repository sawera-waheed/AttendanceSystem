import React, { useEffect, useState } from "react";

import "./ButtonsPanel.css";
import axios from "axios";
import moment from "moment";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";

const ButtonsPanels = (props) => {
  const [isPresentLoading, setIsPresentLoading] = useState(false);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
  const [requestData, setRequestData] = useState({
    date: "",
    day: "",
    createdBy: "",
    requestType: "",
    status: "Pending",
  });

  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString();
    const day = today.toLocaleString("default", { weekday: "long" });
    setRequestData({ ...requestData, date: date, day: day });
  }, [requestData.date]);

  // const dateHandler = (event) => {
  //   setShouldDisable(false);
  //   setRequestData({ ...requestData, date: event.target.value });
  // };

  // const dayHandler = (event) => {
  //   setRequestData({ ...requestData, day: event.target.value });
  // };

  const presentHandler = () => {
    if (requestData.date && requestData.day) {
      setIsPresentLoading(true);
      axios
        .post(
          "http://localhost:8000/attendence?requestType=present",
          requestData,
          {
            headers: {
              authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          props.setAttendence(response.data.student.requests);
          setIsPresentLoading(false);
          setShouldDisable(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setShouldDisable(true);
      alert("Please select date and day.");
    }
  };

  const leaveHandler = () => {
    setIsLeaveLoading(true);
    axios
      .post("http://localhost:8000/attendence?requestType=leave", requestData, {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        props.setAttendence(response.data.student.requests);
        setIsLeaveLoading(false);
        setShouldDisable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="btns_container_holder">
        <div className="btns_container">
          <div className="btns_container_title">
            <h5>{moment().format("LL")}</h5>
            {/* <Form>
              <Row>
                <Col>
                  <Form.Control
                    onChange={dateHandler}
                    type="date"
                    placeholder="Date"
                    style={{ width: "12rem" }}
                  />
                </Col>
                <Col>
                  <Form.Select
                    style={{ width: "12rem" }}
                    aria-label="Day of the week"
                    onChange={dayHandler}
                  >
                    <option>Day of the week</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thirsday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </Form.Select>
                </Col>
              </Row>
  </Form> */}
          </div>
          <div className="btns_group">
            <Button
              disabled={shouldDisable ? true : false}
              variant="primary"
              onClick={presentHandler}
            >
              {isPresentLoading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                "Present"
              )}
            </Button>
            <Button
              disabled={shouldDisable ? true : false}
              variant="danger"
              onClick={leaveHandler}
            >
              {isLeaveLoading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                "Leave"
              )}
            </Button>
            <Button variant="warning" onClick={props.showTableHandler}>
              {props.showTable ? "Hide" : "View"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonsPanels;

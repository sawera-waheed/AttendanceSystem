import React, { useEffect, useState } from "react";

import "./AdminPage.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const AdminPage = () => {
  const [adminData, setAdminData] = useState();

  const getAdminRequests = () => {
    axios
      .get("http://localhost:8000/getAdminRequests", {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setAdminData(response.data.admin);
        }
      });
  };

  useEffect(() => {
    getAdminRequests();
  }, []);

  const acceptHandler = (id) => {
    axios
      .post(
        `http://localhost:8000/acceptRequest/${id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setAdminData(response.data.admin);
      });
  };

  const rejectHandler = (id) => {
    axios
      .post(
        `http://localhost:8000/rejectRequest/${id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setAdminData(response.data.admin);
      });
  };

  return (
    <>
      <div className="admin_table_container">
        <Table hover variant="dark" className="admin_attendence_table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "20%" }}>Date</th>
              <th style={{ width: "20%" }}>Day of the week</th>
              <th style={{ width: "20%" }}>Request Type</th>
              <th style={{ width: "20%" }}>Accept/Reject</th>
            </tr>
          </thead>
          <tbody>
            {adminData &&
              adminData.requests.map((request) => {
                const uniqueId = uuidv4();
                return (
                  <tr key={uniqueId}>
                    <td>{request.createdBy?.name}</td>
                    <td>{request.date}</td>
                    <td>{request.day}</td>
                    <td>{request.requestType}</td>
                    <td className="admin_buttons_container">
                      <Button
                        className="btn-primary btn_style"
                        style={{ marginRight: ".5rem" }}
                        onClick={() => acceptHandler(request._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="btn-danger btn_style"
                        onClick={() => rejectHandler(request._id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default AdminPage;

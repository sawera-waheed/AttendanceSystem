import React, { useState, useEffect } from "react";
import styles from "./FindAccountForm.module.css";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindAccountForm = () => {
  const [isLoading, setIsLoading] = useState();
  const [shouldDisable, setShouldDisable] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [accountData, setAccountData] = useState({ email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }, [showMessage]);

  const changeHandler = (event) => {
    setAccountData({ ...accountData, email: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setShouldDisable(true);
    axios
      .post("http://localhost:8000/find-account", accountData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setIsLoading(false);
          setShouldDisable(false);
          window.localStorage.setItem("userId", response.data.userId);
          navigate("/recovery-code");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 404) {
          setShowMessage(true);
          setIsLoading(false);
          setShouldDisable(false);
        }
      });
  };

  return (
    <div className={styles.form_container}>
      <Form className="shadow-sm rounded" onSubmit={submitHandler}>
        {showMessage && (
          <Alert
            key="danger"
            variant="danger"
            className={styles.bootstrap_alert}
          >
            User not found!
          </Alert>
        )}
        <h3>Find your account</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={changeHandler}
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            {/* We'll never share your email with anyone else. */}
          </Form.Text>
        </Form.Group>

        <Button disabled={shouldDisable} variant="primary" type="submit">
          {isLoading ? (
            <Spinner animation="border" variant="light" />
          ) : (
            "Search"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default FindAccountForm;

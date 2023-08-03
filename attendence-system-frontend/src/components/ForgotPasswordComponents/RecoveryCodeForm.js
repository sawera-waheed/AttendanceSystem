import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./RecoveryCodeForm.module.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

const RecoveryCodeForm = () => {
  const [isLoading, setIsLoading] = useState();
  const [shouldDisable, setShouldDisable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [codeDate, setCodeData] = useState({
    recoveryCode: "",
    userId: window.localStorage.getItem("userId"),
  });
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setCodeData({
      ...codeDate,
      recoveryCode: event.target.value,
    });
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }, [showMessage]);

  const submitHandler = (event) => {
    setIsLoading(true);
    setShouldDisable(true);
    event.preventDefault();
    axios
      .post("http://localhost:8000/recovery-code", codeDate)
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setShouldDisable(false);
          navigate("/new-password");
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setIsLoading(false);
          setShouldDisable(false);
          setShowMessage(true);
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
            Invalid recovery code
          </Alert>
        )}
        <h3>Enter recovery code</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            Please check your email. Recovery code has been sent to the provided
            email.
          </Form.Label>
          <Form.Control
            type="text"
            name="email"
            onChange={changeHandler}
            placeholder="Enter code"
          />
          <Form.Text className="text-muted">
            {/* We'll never share your email with anyone else. */}
          </Form.Text>
        </Form.Group>

        <Button disabled={shouldDisable} variant="primary" type="submit">
          {isLoading ? (
            <Spinner animation="border" variant="light" />
          ) : (
            "Continue"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default RecoveryCodeForm;

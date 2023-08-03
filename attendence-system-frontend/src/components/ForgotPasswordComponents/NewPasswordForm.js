import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewPasswordForm.module.css";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

const NewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState();
  const [shouldDisable, setShouldDisable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    cpassword: "",
    userId: window.localStorage.getItem("userId"),
  });
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setShouldDisable(true);
    axios
      .post("http://localhost:8000/change-password", passwordData)
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setShouldDisable(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response.status) {
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
            Something went wrong, Try again.
          </Alert>
        )}
        <h3>Choose a new password</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>New password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={changeHandler}
            placeholder="Password"
          />
          <Form.Text className="text-muted">
            {/* We'll never share your email with anyone else. */}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label> Confirm new password</Form.Label>
          <Form.Control
            name="cpassword"
            onChange={changeHandler}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Button disabled={shouldDisable} variant="primary" type="submit">
          {isLoading ? (
            <Spinner animation="border" variant="light" />
          ) : (
            "Change password"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default NewPasswordForm;

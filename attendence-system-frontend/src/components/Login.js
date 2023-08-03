import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Login.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect } from "react";

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }, [showMessage]);

  const changeHandler = (event) => {
    setShouldDisable(false);
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoading(true);
      axios
        .post("http://localhost:8000/login", loginData)
        .then((response) => {
          if (response.status === 200 && response.data.token) {
            window.localStorage.setItem("token", response.data.token);
            window.localStorage.setItem("isLoggedIn", true);
            window.localStorage.setItem(
              "user",
              JSON.stringify(response.data.student)
            );
            setIsLoading(false);
            if (response.data.student.isAdmin === true) {
              navigate("/admin");
            } else {
              navigate("/student");
            }
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            setIsLoading(false);
            setShowMessage(true);
          }
        });
    } else {
      setShouldDisable(true);
    }
  };

  return (
    <>
      <div className="login_form_container">
        <Form className="shadow-sm rounded" onSubmit={submitHandler}>
          {showMessage && (
            <Alert key="danger" variant="danger" className="bootstrap_alert">
              Wrong email or password.
            </Alert>
          )}
          <h3>Login</h3>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={changeHandler}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              {/* We'll never share your email with anyone else. */}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              onChange={changeHandler}
              type="password"
              placeholder="Password"
            />
          </Form.Group>

          <Button disabled={shouldDisable} variant="primary" type="submit">
            {isLoading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Login"
            )}
          </Button>
          <p style={{ marginTop: ".5rem", textAlign: "right" }}>
            <Link to="/forgot-password" className="fp_link">
              Forgot password?
            </Link>
          </p>
        </Form>
      </div>
    </>
  );
};

export default Login;

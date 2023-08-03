import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Register.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const navigate = useNavigate();

  const changeHandler = (event) => {
    setStudentData({ ...studentData, [event.target.name]: event.target.value });
  };

  const passwordValidator = () => {
    if (studentData.password === studentData.cpassword) {
      setStudentData({
        ...studentData,
        errorMessage: "Passwords didn't match",
      });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    passwordValidator();
    setIsLoading(true);
    axios
      .post("http://localhost:8000/register", studentData)
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        if (response.statusText === "OK") {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="form_container">
        <Form className="shadow-sm rounded" onSubmit={submitHandler}>
          <h3>Register</h3>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              onChange={changeHandler}
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="email"
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
              type="password"
              onChange={changeHandler}
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              name="cpassword"
              type="password"
              onChange={changeHandler}
              placeholder="Password"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isLoading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Register;

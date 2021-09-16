import React, { useState } from "react";
import { Container, Form, Row, Button, Col } from "react-bootstrap";
import FormData from "form-data";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { api } from "../../utils/api";
import { setCurrentUser } from "../../redux/user/user-actions";

function Register({ setCurrentUser, history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);

    setDisabled(true);

    api({
      method: "post",
      url: "/register",
      data: formData,
    })
      .then((response) => {
        toast.info("Login Succesfully");
        setCurrentUser(response.data);
        setDisabled(false);

        history.push("/dashboard");
      })
      .catch((error) => {
        try {
          const { errors } = error.response.data;
          errors.map((err) => {
            toast.error(err);
          });
        } catch (err) {
          toast.error("Something went wrong");
        }
        setDisabled(false);
      });
  };

  return (
    <Container className="w-50 my-5 form-design">
      <h1 className="text-center mt-3">Register</h1>
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="text-center">
              <Button
                variant="secondary"
                type="submit"
                onClick={handleSubmit}
                disabled={disabled}
              >
                Register
              </Button>
              <a href="/" className="mx-2 registered">
                Already Registered?
              </a>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default withRouter(connect(null, mapDispatchToProps)(Register));

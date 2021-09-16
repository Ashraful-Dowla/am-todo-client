import React, { useState } from "react";
import { Container, Form, Row, Button, Col } from "react-bootstrap";
import { connect } from "react-redux";

import FormData from "form-data";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

import { api } from "../../utils/api";
import { setCurrentUser } from "../../redux/user/user-actions";
import './login.css';
// import img from "./images/login.jpg";
function Login({ setCurrentUser, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    var formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    setDisabled(true);

    api({
      method: "post",
      url: "/login",
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
          const { errors, message } = error.response.data;

          if (message) toast.error(message);
          if (errors) errors.map((err) => toast.error(err));
        } catch (err) {
          toast.error("Something went wrong");
        }
        setDisabled(false);
      });
  };

  return (
    <Container className="my-5 form-design">
     <div className="loginImg"> <img src={`${process.env.PUBLIC_URL}/images/lo.png`} /></div>
      <h1 className="text-center login">Login</h1>
      <Row>
        <Col>
          <Form>
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
            <Form.Group className="text-center">
              <Button
                variant="secondary"
                onClick={handleSubmit}
                disabled={disabled}
              >
                Login
              </Button>
              <a href="/register" className="mx-2 registered">
                Not Registered?
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

export default withRouter(connect(null, mapDispatchToProps)(Login));

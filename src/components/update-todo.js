import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useLocation, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { toast } from "react-toastify";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import Dashboard from "./dashboard";

import { api } from "../utils/api";
import { formattedDate } from "../utils/format-date";

function UpdateTodo({ user, history }) {
  const location = useLocation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState();

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    try {
      getDataById(location.state.id);
    } catch (error) {
      history.push("/todo-list");
    }
  }, []);

  const getDataById = async (idx) => {
    const response = await api({
      method: "get",
      url: "/task/" + idx,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
    });
    const { name, description, deadline } = response.data.task;

    setName(name);
    setDescription(description);
    setDeadline(new Date(deadline));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let date;
    if(deadline){
      date = formattedDate(deadline);
    }

    setDisabled(true);

    api({
      method: "put",
      url: "/task/" + location.state.id,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
      data: {
        name,
        description,
        deadline: date,
      },
    })
      .then((response) => {
        toast.info(response.data.message);
        history.push("/todo-list");

        setDisabled(false);
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
    <>
      <Dashboard />
      <h1 className="text-center mt-3">Update Todo List</h1>
      <Container className="w-50">
        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  placeholder="Enter Descriptions"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Deadline</Form.Label>
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                />
              </Form.Group>
              <Form.Group className="text-center">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Update
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  user: currentUser,
});

export default withRouter(connect(mapStateToProps)(UpdateTodo));

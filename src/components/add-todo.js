import React, { useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FormData from "form-data";
import { toast } from "react-toastify";

import Dashboard from "./dashboard";
import { api } from "../utils/api";
import { formattedDate } from "../utils/format-date";

function AddTodo({ user, history }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState();

  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    var formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);

    if (deadline) {
      let date = formattedDate(deadline);
      formData.append("deadline", date);
    }

    setDisabled(true);

    api({
      method: "post",
      url: "/task",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
      data: formData,
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
          // console.log(error);
        }

        setDisabled(false);
      });
  };
  return (
    <>
      <Dashboard />
      <h1 className="text-center mt-3">Add Todo List</h1>
      <Container className="w-50">
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
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  placeholder="Enter Descriptions"
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
                  Submit
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

export default withRouter(connect(mapStateToProps)(AddTodo));

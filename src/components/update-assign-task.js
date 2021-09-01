import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import { toast } from "react-toastify";

import SelectSearch, { fuzzySearch } from "react-select-search";
import "../utils/select-search.css";

import Dashboard from "./dashboard";

import { api } from "../utils/api";

function UpdateAssignTask({ currentUser: { access_token }, history }) {
  const location = useLocation();

  const [disabled, setDisabled] = useState(false);
  const [assignedTo, setAssignedTo] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [options, setOptions] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    try {
      getUserList();
      getAssignTaskById();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, []);

  const getUserList = async () => {
    const response = await api({
      method: "get",
      url: "/user_list",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
    });

    setOptions(response.data);
  };

  const getAssignTaskById = async () => {
    const response = await api({
      method: "get",
      url: "/assigned_task/" + location.state.id,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
    });

    const { assigned_to, steps } = response.data[0];

    setAssignedTo(assigned_to);
    setSteps(steps);
  };

  const handleAddSteps = () => {
    if (title && description) {
      setSteps([...steps, { title, description }]);
      setTitle("");
      setDescription("");
    }
  };

  const handleRemoveSteps = (idx) => {
    const list = [...steps];
    list.splice(idx, 1);
    setSteps(list);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setDisabled(true);

    api({
      method: "put",
      url: "/assigned_task/" + location.state.id,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
      data: {
        assigned_to: assignedTo,
        steps,
      },
    })
      .then((response) => {
        toast.info(response.data.message);
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
      <h1 className="text-center mt-3">Update Assign Task</h1>
      <Container className="w-50">
        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <SelectSearch
                  options={options}
                  search
                  filterOptions={fuzzySearch}
                  placeholder="Select User"
                  onChange={(e) => setAssignedTo(e)}
                  value={assignedTo}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  placeholder="Enter Descriptions"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </Form.Group>
              <Button
                variant="warning"
                className="m-2"
                onClick={handleAddSteps}
              >
                Add
              </Button>
              {steps.length != 0 && (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((step, idx) => (
                      <tr>
                        <td>{idx}</td>
                        <td>{step.title}</td>
                        <td>{step.description}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveSteps(idx)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {steps.length != 0 && (
                <Form.Group className="text-center mt-5">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={disabled}
                  >
                    Submit
                  </Button>
                </Form.Group>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

export default withRouter(connect(mapStateToProps)(UpdateAssignTask));

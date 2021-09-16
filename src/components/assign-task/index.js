import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button, Table } from "react-bootstrap";
import { connect } from "react-redux";

import { toast } from "react-toastify";

import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../utils/select-search.css";

import Dashboard from "../dashboard";
import { api } from "../../utils/api";
import './assign-task.css';
function AssignTask({ currentUser: { access_token } }) {
  const [disabled, setDisabled] = useState(false);
  const [assignedTo, setAssignedTo] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [options, setOptions] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    try {
      getUserList();
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
      method: "post",
      url: "/assigned_task",
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
      <div className="assignTask">
      <h1 className="text-center mt-3">Assign Task</h1>
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
                variant="success"
                className="m-2 text-end"
                onClick={handleAddSteps}
              >
                Add
              </Button>
              {steps.length != 0 && (
                <Table striped bordered hover size="sm" variant="dark">
                  <thead className="text-center">
                    <tr >
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
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
                    variant="secondary"
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
      </div>
    </>
  );
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

export default connect(mapStateToProps)(AssignTask);

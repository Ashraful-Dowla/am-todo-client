import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Dashboard from "./dashboard";

import { api } from "../utils/api";
import { toast } from "react-toastify";
import { Checkmark } from "react-checkmark";

function TodoList({ user, history }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    try {
      getList();
    } catch (error) {}
  }, []);

  useEffect(() => {}, [list]);

  const getList = async () => {
    const response = await api({
      method: "get",
      url: "/task",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
    });
    setList(response.data.tasks);
  };
  const handleCompleted = async (idx, chk) => {
    api({
      method: "put",
      url: "/completed/task/" + idx,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
      data: {
        completed: 1 - chk,
      },
    })
      .then((response) => {
        toast.info(response.data.message);
        history.push("/add-todo");
      })
      .catch((error) => {
        toast.error("Failed to Update");
      });
  };
  const handleUpdate = (idx) => {
    history.push({
      pathname: "/update-todo",
      state: { id: idx },
    });
  };
  const handleDelete = async (idx) => {
    api({
      method: "delete",
      url: "/task/" + idx,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + user.access_token,
      },
    })
      .then((response) => {
        toast.info(response.data.message);
        history.push("/add-todo");
      })
      .catch((error) => {
        toast.error("Failed to Delete");
      });
  };
  return (
    <>
      <Dashboard />
      <Container className="mt-5">
        <Row>
          {!list.length && <p>No Data Found</p>}
          {list &&
            list.map((item, idx) => (
              <Card key={idx} style={{ width: "25rem" }} className="m-2">
                <Card.Body>
                  <Card.Title>
                    Title: {item.name}
                    {item.completed && <Checkmark size="medium" />}
                  </Card.Title>
                  <Card.Text>Description: {item.description}</Card.Text>
                  <Card.Text>Deadline: {item.deadline}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="warning"
                    className="mx-2"
                    onClick={() => handleCompleted(item.id, item.completed)}
                  >
                    {item.completed ? "Incomplete" : "Complete"}
                  </Button>
                  <Button
                    variant="info"
                    className="mx-2"
                    onClick={() => handleUpdate(item.id)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            ))}
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  user: currentUser,
});

export default withRouter(connect(mapStateToProps)(TodoList));

import React, { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { Container, Row, Card, Button } from "react-bootstrap";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";

import { api } from "../utils/api";

function MyAssignTask({ currentUser: { access_token }, history }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const response = await api({
      method: "get",
      url: "/my_assigned_task",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token
      }
    });
    setList(response.data);
  };

  const handleCompleted = async (idx, chk) => {
    if (window.confirm("Are you sure?")) {
      api({
        method: "put",
        url: "completed/assigned_task/" + idx,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + access_token
        },
        data: {
          completed: 1 - chk
        }
      })
        .then(response => {
          toast.info(response.data.message);
          history.push("/assign-task");
        })
        .catch(error => {
          toast.error("Failed to Update");
        });
    }
  };
  return (
    <>
      <Dashboard />
      <h1 className="text-center mt-3">My Assign Task</h1>
      <Container className="w-50">
        <Row>
          {!list.length && <p>No Data Found</p>}
          {list &&
            list.map((item, idx) => (
              <Card key={idx} style={{ width: "25rem" }} className="m-2">
                <Card.Body>
                  <Card.Title>Steps</Card.Title>
                  {item.steps.map((stp, indx) => (
                    <Card.Text key={indx}>
                      Title: {stp.title} <br />
                      Description: {stp.description}
                    </Card.Text>
                  ))}
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="warning"
                    className="mx-2"
                    onClick={() => handleCompleted(item.id, item.completed)}
                  >
                    {item.completed ? "Incomplete" : "Complete"}
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
  currentUser
});

export default withRouter(connect(mapStateToProps)(MyAssignTask));

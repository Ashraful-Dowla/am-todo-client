import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Card, Button } from "react-bootstrap";

import { toast } from "react-toastify";

import { api } from "../utils/api";
import Dashboard from "./dashboard";

function AssignTaskList({ currentUser: { access_token }, history }) {
  const [list, setList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    getAssignedTaskList();
  }, []);

  const getAssignedTaskList = async () => {
    const response = await api({
      method: "get",
      url: "assigned_task",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
    });

    setList(response.data);
  };

  const handleUpdate = (idx) => {
    history.push({
      pathname: "/update-assign-task-list",
      state: { id: idx },
    });
  };
  const handleDelete = async (idx) => {
    if (window.confirm("Are you sure you want to Delete?")) {
      setDisabled(true);
      api({
        method: "delete",
        url: "assigned_task/" + idx,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + access_token,
        },
      })
        .then((response) => {
          toast.info(response.data.message);
          history.push("/assign-task");
          setDisabled(false);
        })
        .catch((error) => {
          toast.error("Failed to Delete");
          setDisabled(false);
        });
    }
  };
  return (
    <>
      <Dashboard />
      <h1 className="text-center mt-3">Assign Task List</h1>
      <Container className="w-50">
        <Row>
          {!list.length && <p>No Data Found</p>}
          {list &&
            list.map((item, idx) => (
              <Card key={idx} style={{ width: "18rem" }} className="m-2">
                <Card.Body>
                  <Card.Title>Assigned To: {item.assigned_to}</Card.Title>
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
                    variant="info"
                    className="mx-2"
                    onClick={() => handleUpdate(item.id)}
                    disabled={disabled}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    onClick={() => handleDelete(item.id)}
                    disabled={disabled}
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
  currentUser,
});

export default withRouter(connect(mapStateToProps)(AssignTaskList));

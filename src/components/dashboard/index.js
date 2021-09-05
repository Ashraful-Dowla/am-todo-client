import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCurrentUser } from "../../redux/user/user-actions";

import { api } from "../../utils/api";
import { toast } from "react-toastify";

function Dashboard({ user: { user, access_token }, setCurrentUser }) {
  const history = useHistory();
  const handleLogout = async event => {
    event.preventDefault();

    api({
      method: "post",
      url: "/logout",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token
      }
    })
      .then(response => {
        toast.info(response.data.message);
        setCurrentUser(null);
        localStorage.clear();
        history.push("/");
      })
      .catch(error => {
        toast.error("Something went wrong");
      });
  };
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">TODO</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/add-todo">Add Todo</Nav.Link>
          <Nav.Link href="/todo-list">Todo List</Nav.Link>
          <Nav.Link href="/assign-task">Assign Task</Nav.Link>
          <Nav.Link href="/assign-task-list">Assign Task List</Nav.Link>
          <Nav.Link href="/my-assign-task">My Assign Task </Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown
            id="nav-dropdown-dark-example"
            title={user.name}
            menuVariant="dark"
          >
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="/" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

const mapStateToProps = ({ user: { currentUser } }) => ({
  user: currentUser
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

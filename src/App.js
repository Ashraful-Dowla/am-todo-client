import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import AddTodo from "./components/add-todo";
import TodoList from "./components/todo-list";
import UpdateTodo from "./components/update-todo";
import Profile from "./components/profile";
import AssignTask from "./components/assign-task";
import AssignTaskList from "./components/assign-task-list";
import UpdateAssignTask from "./components/update-assign-task";
import MyAssignTask from "./components/my-assign-task";

function App({ user }) {
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (user ? <Dashboard /> : <Login />)}
        />
        <Route
          exact
          path="/register"
          render={() => (user ? <Dashboard /> : <Register />)}
        />
        <Route
          exact
          path="/dashboard"
          render={() => (user ? <Dashboard /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/add-todo"
          render={() => (user ? <AddTodo /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/todo-list"
          render={() => (user ? <TodoList /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/update-todo"
          render={() => (user ? <UpdateTodo /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/profile"
          render={() => (user ? <Profile /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/assign-task"
          render={() => (user ? <AssignTask /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/assign-task-list"
          render={() => (user ? <AssignTaskList /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/update-assign-task-list"
          render={() => (user ? <UpdateAssignTask /> : <Redirect to="/" />)}
        />
        <Route
          exact
          path="/my-assign-task"
          render={() => (user ? <MyAssignTask /> : <Redirect to="/" />)}
        />
      </Switch>
      <ToastContainer />
    </>
  );
}

//state.user.currentUser
const mapStateToProps = ({ user: { currentUser } }) => ({
  user: currentUser
});

export default connect(mapStateToProps)(App);

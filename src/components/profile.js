import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import FormData from "form-data";
import Dashboard from "./dashboard";

import { api } from "../utils/api";

function Profile({ currentUser: { user, access_token } }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [contactNo, setContactNo] = useState(user.contact_no);
  const [img, setImg] = useState(null);

  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async () => {
    let formData = new FormData();

    formData.append("name", name);
    formData.append("contact_no", contactNo);

    if (img) formData.append("avatar", img, img.name);

    setDisabled(true);

    api({
      method: "post",
      url: "/profile",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
      data: formData,
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
        } catch (error) {
          toast.error("Something went wrong");
        }
        
        setDisabled(false);
      });
  };
  return (
    <>
      <Dashboard />
      <h1 className="text-center mt-3">Profile</h1>
      <Container className="w-50">
        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-2 text-center">
                <Image
                  src={
                    user.avatar
                      ? process.env.REACT_APP_IMAGE_URL + user.avatar
                      : process.env.REACT_APP_PUBLIC_URL +
                        "profile-demo-img.jpg"
                  }
                  width={150}
                  height={150}
                  roundedCircle
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact number"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Choose a profile pictue</Form.Label>
                <br />
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </Form.Group>
              <Form.Group className="text-center">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Save
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
  currentUser,
});

export default connect(mapStateToProps)(Profile);

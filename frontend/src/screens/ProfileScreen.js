import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getMyOrders } from "../actions/orderActions";
import { decimalWithCommas } from "../utils/utilFunctions";
import { Link } from "react-router-dom";

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState("Enter your name");
  const [email, setEmail] = useState("Enter your email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, error, loading } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const myOrders = useSelector((state) => state.orderMyList.myOrders);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(getMyOrders());
      }
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, userInfo, history, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    //DISPATCH PRFILE UPDATE ACTION
    if (password !== confirmPassword) {
      setMessage("Passwords didn't match! Try again.");
    } else {
      dispatch(updateUserProfile({ _id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md="4">
        <h1>My Profile</h1>
        {success && <Message varient="success">Profile Updated!</Message>}
        {message && <Message varient="danger">{message}</Message>}
        {error && <Message varient="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder={name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder={email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Please confirm your password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Info
          </Button>
        </Form>
      </Col>
      <Col md="8">
        <h1>My Orders</h1>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Amount (BDT)</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/order/${order._id}`}>
                    {order._id.toUpperCase()}
                  </Link>
                </td>
                <td>{new Date(order.createdAt).toDateString()}</td>
                <td>{decimalWithCommas(order.itemsPrice)}</td>
                <td>{order.isPaid ? order.paidAt : "NOT PAID"}</td>
                <td>{order.isDelivered ? "Delivered" : "Not Delivered"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;

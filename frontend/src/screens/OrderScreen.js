import React, { useState, useEffect } from "react";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getOrderDetails } from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";
import { decimalWithCommas } from "../utils/utilFunctions";
import uniqid from "uniqid";

const OrderScreen = ({ match }) => {
  const [popupStatus, setPopupStatus] = useState("no pop up");

  let browser = window;
  let popup = null;
  let timer = null;

  function popupWatcher() {
    if (popup === null) {
      clearInterval(timer);
      timer = null;
    } else if (popup !== null && !popup.closed) {
      popup.focus();
    } else if (popup !== null && popup.closed) {
      clearInterval(timer);
      browser.focus();
      browser.onClose("closed");
      timer = null;
      popup = null;
    }
  }

  const popupStatusHandler = (err, res) => {
    if (err) {
      setPopupStatus(err);
    }
    console.log("from home", res);
    setPopupStatus(res);
  };

  browser = window.self;

  browser.onSuccess = (res) => {
    popupStatusHandler(null, res);
  };

  browser.onError = (error) => {
    popupStatusHandler(error);
  };

  browser.onOpen = (message) => {
    popupStatusHandler(null, message);
  };

  browser.onClose = (message) => {
    popupStatusHandler(null, message);
  };

  async function getGatewayURL() {
    const txId = uniqid();
    const post_body = {
      total_amount: order.totalPrice,
      currency: "BDT",
      tran_id: `${txId}`,
      success_url: `http://localhost:5000/api/payments/success?orderid=${order._id}&txid=${txId}`,
      fail_url: "http://localhost:5000/api/payments/fail",
      cancel_url: "http://localhost:5000/api/payments/cancel",
      // ipn_url: "http://localhost:5000/api/payments/ipn_listener",
      emi_option: 0,
      cus_name: order.user.name,
      cus_email: order.user.email,
      cus_phone: "01700000000",
      cus_add1: "customer address",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      multi_card_name: "",
      num_of_item: 1,
      product_name: "Test",
      product_category: "Test Category",
      product_profile: "general",
    };

    const {
      data: { GatewayPageURL, status },
    } = await axios.post("/api/config/sslcommerz", post_body);

    if (status === "SUCCESS") {
      return GatewayPageURL;
    } else {
      return null;
    }
  }

  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (popupStatus === "closed") {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, popupStatus]);

  const setGatewayURLtoPopUp = async (e) => {
    if (popup && !popup.closed) {
      popup.focus();

      return;
    }

    const sslcommerzurl = await getGatewayURL();
    if (sslcommerzurl) {
      popup = browser.open(
        sslcommerzurl,
        "Payment Gateway Window",
        `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=${400}, height=${600}`
      );
    }

    setTimeout(() => {
      popup.opener.onOpen("opened");
    }, 0);
    if (timer === null) {
      timer = setInterval(popupWatcher, 0);
    }
    return;
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order #{order._id.toUpperCase()}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>SHIPPING</h2>
              <p>
                <strong>Recepient name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Ship to address: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered!</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>PAYMENT</h2>
              <p>
                <strong>Preferred method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <ListGroup>
                  <h3>Payment Details</h3>
                  <ListGroup.Item variant="success">
                    <strong> Paid at:</strong> {order.paidAt}
                  </ListGroup.Item>
                  <ListGroup.Item variant="success">
                    <strong>Status:</strong> {order.paymentResult.status}
                  </ListGroup.Item>
                  <ListGroup.Item variant="success">
                    <strong>Tx ID: </strong>
                    {order.paymentResult.transaction_id}
                  </ListGroup.Item>
                  <ListGroup.Item variant="success">
                    <strong>Gateway Validation ID:</strong>{" "}
                    {order.paymentResult.validation_id}
                  </ListGroup.Item>
                </ListGroup>
              ) : (
                <Message variant="danger">Not paid!</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>ORDERED ITEMS</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="warning">
                  Your order is empty !
                  <br />
                  <Link to="/">Add something to cart</Link>{" "}
                </Message>
              ) : (
                order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x Tk. {item.price} = Tk.{" "}
                        {item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup.Item>
            <h2>Order Summary</h2>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Items Price</Col>
              <Col>Tk. {decimalWithCommas(order.itemsPrice)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Shipping</Col>
              <Col>Tk. {decimalWithCommas(order.shippingPrice)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Tax</Col>
              <Col>Tk. {decimalWithCommas(order.taxPrice)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Total</Col>
              <Col>Tk. {decimalWithCommas(order.totalPrice)}</Col>
            </Row>
          </ListGroup.Item>

          {error && (
            <ListGroup.Item>
              {" "}
              <Message variant="danger">{error}</Message>
            </ListGroup.Item>
          )}

          <ListGroup>
            <ListGroup.Item>
              {order.isPaid ? (
                <Button type="button" className="btn-block" disabled>
                  <strong>PAID</strong>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn-block"
                  disabled={order.orderItems === 0}
                  onClick={setGatewayURLtoPopUp}
                >
                  {/* <WindowOpener
                    // url={popupURL}
                    popupResponseHandler={popupResponseHandler}
                    // popupOpenerHandler={popupOpenerHandler}
                  > */}
                  <strong>PAY BDT {decimalWithCommas(order.totalPrice)}</strong>
                  {/* </WindowOpener> */}
                  <Form.Text class="text-muted">
                    Secured by SSLCOMMERZ
                  </Form.Text>
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;

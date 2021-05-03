import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);
  // @ts-ignore
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  // @ts-ignore
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  // @ts-ignore
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  // @ts-ignore
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }
  // ASzhvcUbuWwCV3M5yXjSfmenTwpZcJkzPVcAGkafsPtvVAOKIg1HTWQE5QISC3Ods4wfEGXu-o_MoJfk

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ASzhvcUbuWwCV3M5yXjSfmenTwpZcJkzPVcAGkafsPtvVAOKIg1HTWQE5QISC3Ods4wfEGXu-o_MoJfk";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
      <h1>Zamówienie: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Dostawa</h2>
              <p>
                <strong>Imię: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Adres dostawy: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{"  "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant='success'>Dostarczono {order.deliveredAt}</Message>
              ) : (
                <Message variant='warning'>Oczekiwanie na dostarczenie</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Płatność</h2>
              <p>
                <strong>Metoda płatności: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Zapłacono {order.paidAt}</Message>
              ) : (
                <Message variant='warning'>Oczekiwanie na zapłatę</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Zamawiane produkty</h2>
              {order.orderItems.length === 0 ? (
                <Message variant='info'>Brak zamówienia.</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>

                        <Col md={5}>
                          {item.qty} x {item.price} PLN ={" "}
                          {(item.qty * item.price).toFixed(2)} PLN
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Podsumowanie: </h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Produkty: </Col>
                  <Col>{order.itemsPrice} PLN </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Dostawa: </Col>
                  <Col>{order.shippingPrice} PLN </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>w tym VAT: </Col>
                  <Col>{order.taxPrice} PLN </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Całość: </Col>
                  <Col>{order.totalPrice} PLN </Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                  Oznacz jako dostarczone
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;

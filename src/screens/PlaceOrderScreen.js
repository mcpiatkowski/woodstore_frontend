import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  const placeOrder = () => {
    console.log("zamówionko!");
  };

  cart.taxPrice = Number(0.082 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Dostawa</h2>
              <p>
                <strong>Adres dostawy: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{"  "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Płatność</h2>
              <p>
                <strong>Metoda płatności: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Zamawiane produkty</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant='info'>Twój koszyk jest pusty.</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                <Col>Produkty: </Col>
                <Col>{cart.itemsPrice} PLN </Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>Dostawa: </Col>
                <Col>{cart.shippingPrice} PLN </Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>w tym VAT: </Col>
                <Col>{cart.taxPrice} PLN </Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>Całość: </Col>
                <Col>{cart.totalPrice} PLN </Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Złóż zamówienie
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;

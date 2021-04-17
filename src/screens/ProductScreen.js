import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails, listProducts } from '../actions/productActions'


function ProductScreen({ match }) {

    const dispatch = useDispatch()
    const productDetails = useSelector( state => state.productDetails )
    const { loading, error, product } = productDetails


    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
    }, [])

    return (
        <div>
            <Link to="/" className="btn btn-light my-3">Go back</Link>
            <Row>
                <Col md={6}>
                    <Image src={ product.image } alt={product.name} fluid />
                </Col>

                <Col md={3}>
                    <ListGroup variant="flush">

                        <ListGroup.Item>
                            <h3>{ product.name }</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} recenzji`} color={'#f8e825'} />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Cena: { product.price }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Opis: { product.description }
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Price:
                                    </Col>
                                    <Col md="auto">
                                        <strong>{product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Status:
                                    </Col>
                                    <Col md="auto">
                                        {product.countInStock > 0 ? 'W magazynie' : 'Brak'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button className="btn-block" disabled={product.countInStock === '0'} type="button">Do koszyka</Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen

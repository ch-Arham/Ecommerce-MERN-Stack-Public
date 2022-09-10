import React, { useEffect } from 'react'
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getOrderDetails } from "../../action/orderAction";

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

// importing material ui components
import { Typography } from "@material-ui/core";

// importing styles
import "./OrderDetails.css";


const OrderDetails = ({ match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector(state => state.orderDetails);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [error, alert, dispatch]);

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, match.params.id]);

  return (
    <>
        {loading ? <Loader /> : (
            <>
                <MetaData title="Order Details" />

                <div className="orderDetailsPage">
                    <div className="orderDetailsContainer">
                        <Typography component="h1">
                            Order #{order && order?._id}
                        </Typography>

                        <Typography>Shipping Info</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p>Name:</p>
                                <span>{order.user && order.user.name}</span>
                            </div>

                            <div>
                                <p>Phone:</p>
                                <span>
                                    {order.shippingInfo && order?.shippingInfo?.phoneNo}
                                </span>
                            </div>

                            <div>
                                <p>Address:</p>
                                <span>
                                    {order.shippingInfo &&
                                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                                </span>
                            </div>
                        </div>

                        <Typography>Payment</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p
                                    className={
                                        order.paymentInfo &&
                                        order.paymentInfo.status === "succeeded"
                                        ? "greenColor"
                                        : "redColor"
                                    }
                                >
                                    {order.paymentInfo &&
                                        order.paymentInfo.status === "succeeded"
                                        ? "PAID"
                                        : "NOT PAID"
                                    }
                                </p>
                            </div>

                            <div>
                                <p>Amount:</p>
                                <span>{order.totalPrice && order.totalPrice}</span>
                            </div>
                        </div>

                        <Typography>Order Status</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p
                                    className={
                                    order.orderStatus && order.orderStatus === "Delivered"
                                        ? "greenColor"
                                        : "redColor"
                                    }
                                >
                                    {order.orderStatus && order.orderStatus}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="orderDetailsCartItems">
                        <Typography>Order Items:</Typography>
                        <div className="orderDetailsCartItemsContainer">
                            {order && order.orderItems && order.orderItems.map(item => (
                                <div key={item.product}>
                                    <img src={item.image} alt="Product" />
                                    <Link to={`/product/${item.product}`}>
                                        {item.name}
                                    </Link>
                                    <span>
                                        {item.quantity} X Rs.{item.price} =&nbsp;
                                        <b>Rs.{item.price * item.quantity}</b>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default OrderDetails
import React from 'react'
import { Link } from "react-router-dom";

// importing redux
import { useSelector } from 'react-redux'

// importing component
import CheckoutSteps from "../Cart/CheckoutSteps";
import MetaData from "../layout/MetaData";

// importing material ui components
import { Typography } from "@material-ui/core";

// importing styles
import "./ConfirmOrder.css";


// ConfirmOrder component
const ConfirmOrder = ({ history }) => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // Calculate Order Prices
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
        subtotal,
        shippingCharges,
        tax,
        totalPrice,
    };
  
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
  
    history.push("/process/payment");
  }

  return (
    <>
        <MetaData title="Confirm Order" />
        <CheckoutSteps activeStep={1} />
        <div className="confirmOrderPage">
            <div>
                <div className="confirmshippingArea">
                    <Typography>Shipping Info</Typography>
                    <div className="confirmshippingAreaBox">
                        <div>
                            <p>Name:</p>
                            <span>{user.name}</span>
                        </div>

                        <div>
                            <p>Phone:</p>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>

                        <div>
                            <p>Address:</p>
                            <span>{address}</span>
                        </div>
                    </div>
                </div>

                <div className="confirmCartItems">
                    <Typography>Your Cart Items:</Typography>
                    <div className="confirmCartItemsContainer">
                        {
                            cartItems && 
                                cartItems.map((item) => (
                                    <div key={item.product}>
                                        <img src={item.image} alt="Product" />
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                        <span>
                                            {item.quantity} X ₹{item.price} =&nbsp;
                                            <b>Rs.{item.price * item.quantity}</b>
                                        </span>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>



            <div>
                <div className="orderSummary">
                    <Typography>Order Summery</Typography>
                    <div>
                        <div>
                            <p>Subtotal</p>
                            <span>Rs.{subtotal}</span>
                        </div>

                        <div>
                            <p>Shipping Charges</p>
                            <span>Rs.{shippingCharges}</span>
                        </div>

                        <div>
                            <p>Tax</p>
                            <span>Rs.{tax}</span>
                        </div>
                    </div>

                    <div className="orderSummaryTotal">
                        <p>
                            <b>Total:</b>
                        </p>
                        <span>Rs.{totalPrice}</span>
                    </div>

                    <button onClick={proceedToPayment}>Proceed To Payment</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default ConfirmOrder
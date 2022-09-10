import React, { useEffect, useRef } from 'react'
import { useAlert } from "react-alert";
import axios from "../../utils/axios";

// importing redux
import { useSelector, useDispatch } from "react-redux";
import { createOrder, clearErrors } from "../../action/orderAction";

// importing components
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

// importing stripe
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";

// importing material ui components
import { Typography } from "@material-ui/core";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

// importing styles
import "./Payment.css";


// Payment Component ----------------------------------------------------------
const Payment = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };


  // Use Ref
  const payBtn = useRef(null);

  // useEffect
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
            payBtn.current.disabled = false;
        }
    }, [dispatch, alert, error]);

  // Functions
  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
      
        const { data } = await axios.post("/api/v1/payment/process", paymentData, config);

        const clientSecret = data.client_secret;

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: user.name,
                    email: user.email,
                    address: {
                        line1: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        postal_code: shippingInfo.postalCode,
                        country: shippingInfo.country,
                    }
                },
            }
        });

        if (result.error) {
            alert.error(result.error.message);
            payBtn.current.disabled = false;
        } else{
            if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                }

                dispatch(createOrder(order));

                history.push("/success");
            } else {
                alert.error("There is some issue while payment processing");
            }
        }
        
    } catch (error) {
        alert.error(error.response.data.message);
        payBtn.current.disabled = false;
    }
  }

  return (
    <>
        <MetaData title="Payment" />
        <CheckoutSteps activeStep={2} />

        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>

                <div>
                    <CreditCardIcon /> {/* 4000 0027 6000 3184 */}
                    <CardNumberElement className="paymentInput" />
                </div>
                <div>
                    <EventIcon />
                    <CardExpiryElement className="paymentInput" />
                </div>
                <div>
                    <VpnKeyIcon />
                    <CardCvcElement className="paymentInput" />
                </div>

                <input
                    type="submit"
                    value={`Pay - Rs.${orderInfo && orderInfo.totalPrice}`}
                    ref={payBtn}
                    className="paymentFormBtn"
                />
            </form>
        </div>
    </>
  )
}

export default Payment
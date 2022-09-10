import React from 'react'
import { Link } from "react-router-dom";

// importing redux
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from "../../action/cartAction";

// importing components
import MetaData from "../layout/MetaData";
import CartItemCard from "./CartItemCard";

// importing material ui components
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";

// importing styles
import "./Cart.css";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const user = useSelector(state => state.user);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <>  
        {
            user.isAuthenticated ? (
                <MetaData title={`${user.user.name}'s Cart`} />
            ) : (
                <MetaData title={"Your Cart"} />
            )
        }
        { cartItems.length === 0 ? (
            <div className="emptyCart">
                <RemoveShoppingCartIcon />

                <Typography>No Product in Your Cart</Typography>
                <Link to="/products">View Products</Link>
            </div>
        ) : (
            <>
                <div className="cartPage">
                    <div className="cartHeader">
                        <p>Product</p>
                        <p>Quantity</p>
                        <p>Subtotal</p>
                    </div>

                    {/* Items in Cart */}
                    {
                        cartItems && cartItems.map(item => (
                            <div className="cartContainer" key={item.product}>
                                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                <div className="cartInput">
                                    <button
                                        onClick={() =>
                                            decreaseQuantity(item.product, item.quantity)
                                        }
                                    >
                                        -
                                    </button>

                                    <input type="number" value={item.quantity} readOnly />

                                    <button
                                        onClick={() =>
                                            increaseQuantity( item.product, item.quantity, item.stock )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="cartSubtotal">
                                    {`Rs.${item.price * item.quantity}`}
                                </p>
                            </div>
                        ))
                    }

                    {/* Overall Total */}
                    <div className="cartGrossTotal">
                        <div></div>

                        <div className="cartGrossTotalBox">
                        <p>Gross Total</p>
                        <p>
                            {`Rs.${cartItems.reduce((acc, item) => acc + item.quantity * item.price,0)}`}
                        </p>
                        </div>

                        <div></div>

                        <div className="checkOutBtn">
                            <button 
                                onClick={checkoutHandler}
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
        }
    </>
  )
}

export default Cart
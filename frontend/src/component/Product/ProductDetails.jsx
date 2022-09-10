import React,{ useState, useEffect } from 'react'
import { useAlert } from "react-alert";

// imports for redux
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, newReview, clearErrors } from "../../action/productAction"
import { addItemsToCart } from "../../action/cartAction";

// importing components
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";

// importing constants
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

// importing Material UI Components
import Carousel from "react-material-ui-carousel";
import { Rating } from "@material-ui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";

// importing styles
import "./ProductDetails.css";


const ProductDetails = ({match}) => {
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));
    }, [dispatch, match.params.id, success]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Review Posted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }
    },[dispatch, error, reviewError, alert, success]);

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const increaseQuantity = () => {
        if (product.stock <= quantity) return;
    
        const qty = quantity + 1;
        setQuantity(qty);
    };
    
    const decreaseQuantity = () => {
        if (1 >= quantity) return;
    
        const qty = quantity - 1;
        setQuantity(qty);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(match.params.id, quantity));
        alert.success("Item added to cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const reviewSubmitHandler = () => {
        const formData = new FormData();
        formData.set("rating", rating);
        formData.set("comment", comment);
        formData.set("productId", match.params.id);

        dispatch(newReview(formData));
        setOpen(false);
    }

    const productPrice = product.price && product.price.toLocaleString("en-US");

  return (
    <>
        {loading ? (
                <Loader />
            )
            :
            (
                <>
                    <MetaData  title={`${product.name} -- ECOMMERCE`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel>
                                {product.images &&
                                    product.images.map((item, index) => (
                                        <img
                                            src={item.url}
                                            alt={`${index} Slide`}
                                            className="CarouselImage"
                                            key={index}
                                        />
                                    ))
                                }
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>

                            <div className="detailsBlock-2">
                                <Rating key={product._id} {...options} />
                                <span className="detailsBlock-2-span">
                                {" "}
                                ({product.numOfReviews} Reviews)
                                </span>
                            </div>

                            <div className="detailsBlock-3">
                                <h1>{`Rs ${product.price && productPrice}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>

                                    <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler} >
                                        Add to Cart
                                    </button>
                                </div>

                                <p>
                                    Status:&nbsp;
                                    <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                        {product.stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description&nbsp;:&nbsp;<p>{product.description}</p>
                            </div>

                            <button className="submitReview" onClick={submitReviewToggle}>
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>

                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                name="rating"
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                name="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>

                        <DialogActions>
                            <Button color="secondary" onClick={submitReviewToggle} >
                                Cancel
                            </Button>
                            <Button color="primary" onClick={reviewSubmitHandler}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                  
                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review) => (
                                <ReviewCard key={review._id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </>
            )
        }

    </>
  )
}

export default ProductDetails
import React, { useState, useEffect } from 'react';
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllReviews, deleteReviews } from "../../action/productAction";

// importing constants
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

// importing componens
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

// importing material ui components
import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

// importing styles
import './ProductReviews.css';

const ProductReviews = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

  const { loading, error, reviews } = useSelector((state) => state.productReviews);
  const { isDeleted, error: deleteError, loading: deleteLoading } = useSelector((state) => state.review);

  // useState
  const [productId, setProductId] = useState("");

  // UseEffect
  useEffect(() => {
    if (productId.length === 24) {
        dispatch(getAllReviews(productId));
    }

    if (error) {
        alert.error(error);
        dispatch(clearErrors());
    }

    if (deleteError) {
        alert.error(deleteError);
        dispatch(clearErrors());
    }

    if (isDeleted) {
        history.push("/admin/reviews");
        alert.success("Review deleted successfully");
        dispatch({ type: DELETE_REVIEW_RESET });
    }

  }, [dispatch, alert, error, deleteError, isDeleted, history, productId]);

  // Functions
  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
        field: "user",
        headerName: "User",
        minWidth: 200,
        flex: 0.6,
    },
  
    {
        field: "comment",
        headerName: "Comment",
        minWidth: 350,
        flex: 1,
    },

    {
        field: "rating",
        headerName: "Rating",
        type: "number",
        minWidth: 100,
        flex: 0.25,
  
        cellClassName: (params) => {
          return params.getValue(params.id, "rating") >= 3
            ? "greenColor"
            : "redColor";
        },
    },

    {
        field: "actions",
        flex: 0.25,
        headerName: "Actions",
        minWidth: 100,
        type: "number",
        sortable: false,
        renderCell: (params) => {
          return (
            <>
              <Button
                onClick={() =>
                  deleteReviewHandler(params.getValue(params.id, "id"))
                }

                disabled={deleteLoading ? true : false}
              >
                <DeleteIcon />
              </Button>
            </>
          );
        },
    },
  ];

  const rows = [];
  reviews &&
  reviews.forEach((item) => {
    rows.push({
      id: item._id,
      rating: item.rating,
      comment: item.comment,
      user: item.name,
    });
  });

  return (
    <>
        <MetaData title={"All Reviews - Admin"} />

        <div className="dashboard">
            <Sidebar />

            <div className="productReviewsContainer">
                <form 
                    className="productReviewsForm"
                    onSubmit={productReviewsSubmitHandler}
                >
                    <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                    <div>
                        <Star />
                        <input
                            type="text"
                            placeholder="Product Id"
                            required
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                        />
                    </div>

                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={
                            loading ? true : false || productId === "" ? true : false
                        }
                        >
                        Search
                    </Button>
                </form>

             
                {reviews && reviews.length > 0 ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                ): (
                    <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                )}
             
            </div>
        </div>
    </>
  )
}

export default ProductReviews
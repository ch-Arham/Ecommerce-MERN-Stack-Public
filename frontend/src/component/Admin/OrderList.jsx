import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../action/orderAction";

// importing constants
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

// importing components
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";

// importing material ui components
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

// importing styles
import "./ProductList.css";


// OrderList component --------------------------------
const OrderList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, orders } = useSelector((state) => state.allOrders);
  const {  error: deleteError, isDeleted } = useSelector((state) => state.order);

  // useEffect hook
  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
        alert.error(error);
        dispatch(clearErrors());
    }

    if (deleteError) {
        alert.error(deleteError);
        dispatch(clearErrors());
    }

    if (isDeleted) {
        alert.success("Order deleted successfully");
        history.push("/admin/orders");
        dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted, history]);

  // Function
  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 0.75 },

    {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        flex: 0.4,
        cellClassName: (params) => {
          return params.getValue(params.id, "status") === "Delivered"
            ? "greenColor"
            : "redColor";
        },
    },

    {
        field: "itemsQty",
        headerName: "Items Qty",
        type: "number",
        minWidth: 150,
        flex: 0.35,
    },

    {
        field: "amount",
        headerName: "Amount",
        type: "number",
        minWidth: 180,
        flex: 0.4,
    },

    {
        field: "actions",
        flex: 0.3,
        headerName: "Actions",
        minWidth: 150,
        type: "number",
        sortable: false,
        renderCell: (params) => {
          return (
            <>
              <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                <EditIcon />
              </Link>
  
              <Button
                onClick={() =>
                  deleteOrderHandler(params.getValue(params.id, "id"))
                }
              >
                <DeleteIcon />
              </Button>
            </>
          );
        },
    },
  ];

  const rows = [];

  orders &&
  orders.forEach((item) => {
    rows.push({
      id: item._id,
      itemsQty: item.orderItems.length,
      amount: item.totalPrice,
      status: item.orderStatus,
    });
  });

  return (
    <>
        <MetaData title={`ALL ORDERS - Admin`} />

        <div className="dashboard">
            <Sidebar />

            <div className="productListContainer">
                <h1 id="productListHeading">ALL ORDERS</h1>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight
                />
            </div>
        </div>
    </>
  )
};

export default OrderList;

import React, { useEffect } from 'react'
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../../action/orderAction";

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

// importing material-ui components
import { DataGrid } from "@material-ui/data-grid";
import Typography from "@material-ui/core/Typography";
import LaunchIcon from "@material-ui/icons/Launch";

// importing styles
import "./MyOrders.css";


// MyOrders Component
const MyOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector(state => state.myOrders);
  const { user } = useSelector(state => state.user);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 0.75 },

    {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        flex: 0.5,
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
        flex: 0.3,
    },

    {
        field: "amount",
        headerName: "Amount",
        type: "number",
        minWidth: 220,
        flex: 0.45,
    },

    {
        field: "actions",
        headerName: "Actions",
        minWidth: 150,
        flex: 0.3,
        type: "number",
        sortable: false,
        renderCell: (params) => {
            return (
                <Link to={`/order/${params.getValue(params.id, "id")}`}>
                    <LaunchIcon />
                </Link>
            );
        }
    }
  ];


  const rows = [];

  orders &&
    orders.forEach((item,index) => {
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,
        });
    });
  

  // Use Effect Hooks
  useEffect(() => {
    dispatch(myOrders());
  },[dispatch]);

  useEffect(() => {
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
  },[dispatch, error, alert]);

  return (
    <>
        {loading ? <Loader /> : (
            <>
                <MetaData title={`${user.name} - Orders`} />
                
                <div className="myOrdersPage">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="myOrdersTable"
                        autoHeight
                    />

                    <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
                </div>
            </>
        )}
    </>
  )
}

export default MyOrders
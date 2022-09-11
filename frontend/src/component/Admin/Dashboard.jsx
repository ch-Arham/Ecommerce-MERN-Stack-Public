import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { getAdminProduct } from "../../action/productAction";
import { getAllUsers } from "../../action/userAction";
import { getAllOrders } from "../../action/orderAction";

// importing components
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";

// importing material ui components
import { Typography } from "@material-ui/core";

// importing styles
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.allUsers);
  const { products } = useSelector((state) => state.products);
  const { orders, totalAmount, loading } = useSelector(
    (state) => state.allOrders
  );

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllUsers());
    dispatch(getAllOrders());
  }, [dispatch]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <MetaData title="Dashboard - Admin Panel" />
          <Sidebar />

          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>

            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br /> Rs.&nbsp;
                  {totalAmount && totalAmount.toLocaleString("en-US")}
                </p>
              </div>

              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Product</p>
                  <p>{products && products.length}</p>
                </Link>

                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{orders && orders.length}</p>
                </Link>

                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{users && users.length}</p>
                </Link>
              </div>
            </div>

            <div className="lineChart">
              <Line data={lineState} />
            </div>
        
            {
              doughnutState?.datasets[0]?.data[0] === 0 && doughnutState?.datasets[0]?.data[1] === 0 ? (
                <div className="doughnutChartNotShown">
                  <p>Nothing In Stock</p>
                </div>
              ) : (
                <div className="doughnutChart">
                  <Doughnut data={doughnutState} />
                </div>
              )
            }
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

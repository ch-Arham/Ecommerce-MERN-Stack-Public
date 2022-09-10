import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";

//importing redux
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers, clearErrors, deleteUser } from "../../action/userAction";

// importing components
import SideBar from "./Sidebar";
import MetaData from "../layout/MetaData";

// importing material ui components
import DeleteIcon from "@material-ui/icons/Delete";
import { DataGrid } from "@material-ui/data-grid";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from "@material-ui/core";

// importing constants
import { DELETE_USER_RESET } from "../../constants/userConstants";

// importing styles
import "./ProductList.css";


// ------------------ UserList Component ------------------
const UsersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message, loading } = useSelector((state) => state.profile);

  // ------------------ useEffect ------------------
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      history.push("/admin/users");
      alert.success(message);
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, history, isDeleted, message]);

  // ------------------ deleteHandler ------------------
  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.60 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.65,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 120,
      flex: 0.4,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 120,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
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
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }

              disabled={loading ? true : false}
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

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
  );
};

export default UsersList;
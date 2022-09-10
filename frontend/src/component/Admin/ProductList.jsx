import React,{ useEffect } from 'react'
import { Link } from "react-router-dom";
import { useAlert } from 'react-alert';

// importing redux
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getAdminProduct, deleteProduct } from '../../action/productAction';

// importing components
import MetaData from '../layout/MetaData';
import SideBar from "./Sidebar";

// importing constants
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

// importing material ui components
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DataGrid } from "@material-ui/data-grid";

// importing styles
import './ProductList.css';


// ProductList Component ------------------------------------------------------
const ProductList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted, loading } = useSelector((state) => state.product);

  // UseEffect Hook
  useEffect(() => {
    dispatch(getAdminProduct());
  }, [dispatch, isDeleted]);

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
        alert.success("Product deleted successfully");
        history.push("/admin/dashboard");
        dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted, history]);

  // Functions
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
    
    {
        field: "name",
        headerName: "Name",
        minWidth: 300,
        flex: 0.6,
    },

    {
        field: "stock",
        headerName: "Stock",
        type: "number",
        minWidth: 150,
        flex: 0.3,
    },
  
    {
        field: "price",
        headerName: "Price",
        type: "number",
        minWidth: 250,
        flex: 0.5,
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
              <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                <EditIcon />
              </Link>
  
              <Button
                onClick={() =>
                  deleteProductHandler(params.getValue(params.id, "id"))
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

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });


  return (
    <>
        <MetaData title={`ALL PRODUCTS - Admin`} />

        <div className="dashboard">
            <SideBar />

            <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>

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
}

export default ProductList
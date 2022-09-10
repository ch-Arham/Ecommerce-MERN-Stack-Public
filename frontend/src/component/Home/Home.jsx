import React, { useEffect } from 'react'
import { clearErrors, getProduct } from "../../action/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

// importing components
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

// importing icons
import { CgMouse } from "react-icons/all";

// importing styles
import "./Home.css";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [error, alert, dispatch])

  return (
    <>
    {loading ? 
      (
        <Loader />
      ) : (
        <>
          <MetaData title="ECOMMERCE" />
          <div className="home-banner">
              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>

              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
          </div>
        </>
      )
    }
    </>
  )
}

export default Home
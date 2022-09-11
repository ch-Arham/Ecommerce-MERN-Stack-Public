import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";

// importing components
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ProductCard from "../Home/ProductCard";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { getProduct, clearErrors } from "../../action/productAction.js";

// importing material ui
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

// importing constants
import { 
    CATEGORY_1,
    CATEGORY_2,
    CATEGORY_3,
    CATEGORY_4,
    CATEGORY_5,
    CATEGORY_6,
    CATEGORY_7,
    CATEGORY_8
 } from "../../constants/productCategories";

// importing styles
import "./Products.css";

const categories = [
    CATEGORY_1,
    CATEGORY_2,
    CATEGORY_3,
    CATEGORY_4,
    CATEGORY_5,
    CATEGORY_6,
    CATEGORY_7,
    CATEGORY_8
];

const Products = ({ history, match }) => {
  // UseStates
  const [price, setPrice] = useState([0, 350000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Necessary UseHooks
  const alert = useAlert();
  const dispatch = useDispatch();
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);


  const keyword = match.params.keyword;
  const count = filteredProductsCount;

  // UseEffects
  useEffect(() => {
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert, keyword, currentPage, price, category, ratings]);


  // Functions
    const handlePriceChange = (event, newValue) => {
        setPrice(newValue);
    };

    const setCurrentPageNo = e => {
        setCurrentPage(e);
    }

  return (
    <>
        {loading ? <Loader /> : 
            <div className="product-wrapper">
                <MetaData title="PRODUCTS -- ECOMMERCE" />
                <h2 className="productsHeading">Products</h2>
          
                <div className="products">
                    {products.length > 0 ? (
                        products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ): (
                        <div className="noProductFound">
                            <h3>No Products Found</h3>
                            {keyword && (
                                <p onClick={()=>history.goBack()}>Go Back</p>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="filterBox">

                    <Typography>Price</Typography>
                    <Slider 
                        value={price}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={350000}
                    />

                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                key={category}
                                className="category-link"
                                onClick={() => setCategory(category)}
                            >
                                {category}
                            </li>   
                        ))}
                    </ul>

                    <div style={{marginBottom: '1.5vmax'}} />

                    <fieldset>
                        <Typography component="legend">Ratings Above</Typography>
                        <Slider 
                            value={ratings}
                            onChange={(event, newValue) => setRatings(newValue)}
                            aria-labelledby="continuous-slider"
                            valueLabelDisplay="auto"
                            min={0}
                            max={5}
                        />
                    </fieldset>
                    
                    {keyword && (
                        <>     
                            <div style={{marginBottom: '1.8vmax'}} />
                            <Link to="/products">Clear All Filters</Link>
                        </>
                    )}
               
                </div>

                {resultPerPage < count && (
                    <div className="paginationBox">
                        <Pagination 
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>
                )}

            </div>
        
        }
    </>

  )
};

export default Products;

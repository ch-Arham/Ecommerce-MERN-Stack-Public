import React, { useState } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) { // if keyword is not empty
        history.push(`/products/${keyword}`);
    } else {
        history.push("/products");
    }
  }
  return (
    <>
        <MetaData title="Search A Product -- ECOMMERCE" />
        <form className="searchBox" onSubmit={searchSubmitHandler}>
            <input 
                type="text" 
                placeholder="Search A Product"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <input type="submit" value="Search" />
        </form>
    </>
  )
}

export default Search
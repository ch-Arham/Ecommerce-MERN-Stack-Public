import React from 'react'
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
    defaultValue: 0,
  };
  const price = product.price.toLocaleString("en-US");
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      {/* product.images[0].url ||  */}
      <img src={product.images[0].url || "https://via.placeholder.com/450"} alt={product.name} />
      <p>{product.name}</p>

      <div>
        <Rating {...options} className="rating-stars"/>{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>

      <span>
        {`Rs ${price}`}
      </span>

    </Link>
  )
}

export default ProductCard
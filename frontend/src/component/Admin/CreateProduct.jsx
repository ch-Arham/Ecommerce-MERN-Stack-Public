import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";

// importing redux
import { useDispatch, useSelector } from "react-redux";
import { createProduct, clearErrors } from "../../action/productAction";

// importing components
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

// importing constants
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import {
  CATEGORY_1,
  CATEGORY_2,
  CATEGORY_3,
  CATEGORY_4,
  CATEGORY_5,
  CATEGORY_6,
  CATEGORY_7,
} from "../../constants/productCategories";

// importing material ui components
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { Button } from "@material-ui/core";

// importing styles
import "./CreateProduct.css";

// ----------------------Create Product Component-----------------------
const CreateProduct = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, loading, success } = useSelector((state) => state.newProduct);

  const categories = [
    CATEGORY_1,
    CATEGORY_2,
    CATEGORY_3,
    CATEGORY_4,
    CATEGORY_5,
    CATEGORY_6,
    CATEGORY_7
  ];

  // usestate Hook
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // useEffect Hook
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      history.push("/admin/dashboard");
      alert.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, success, history]);

  // Functions
  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    // Array.from creates a copy of the array
    const files = Array.from(e.target.files); // converting files into array

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader(); // reading the file

      reader.onload = () => { // onload is a function that is called when the file is loaded
        if (reader.readyState === 2) { // 2 means the file is loaded
          setImagesPreview((old) => [...old, reader.result]); // setting the image preview
          setImages((old) => [...old, reader.result]); // setting the image
        }
      };

      reader.readAsDataURL(file); // converting the file into url
    });
  };

  return (
    <>
      <MetaData title={"Create Product"} />
      <div className="dashboard">
        <Sidebar />

        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading ? "Creating..." : "Create"}
            </Button>

          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;

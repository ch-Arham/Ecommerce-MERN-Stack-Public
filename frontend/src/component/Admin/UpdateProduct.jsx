import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

// importing redux
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updateProduct, getProductDetails } from "../../action/productAction.js";

// importing Components
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';

// importing Constants
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import {
    CATEGORY_1,
    CATEGORY_2,
    CATEGORY_3,
    CATEGORY_4,
    CATEGORY_5,
    CATEGORY_6,
    CATEGORY_7
} from "../../constants/productCategories";

// importing material ui components
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { Button } from "@material-ui/core";


// Update Product Component ----------------------------------------------------------------
const UpdateProduct = ({ history, match }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const productId = match.params.id;

    const { error, product } = useSelector((state) => state.productDetails);
    const { error: updateError, isUpdated, loading } = useSelector((state) => state.product);

    const categories = [
        CATEGORY_1,
        CATEGORY_2,
        CATEGORY_3,
        CATEGORY_4,
        CATEGORY_5,
        CATEGORY_6,
        CATEGORY_7,
    ];
  
    // UseState Hook
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    // UseEffect Hook
    useEffect(() => {
        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            history.push("/admin/products");
            alert.success("Product updated successfully");
            dispatch({ type: UPDATE_PRODUCT_RESET });
            dispatch(getProductDetails(productId));
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, history, isUpdated, updateError, product, productId]);

    // Functions
    const updateProductSubmitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("stock", stock);

        images.forEach((image) => {
            formData.append("images", image);
        });

        dispatch(updateProduct(product._id, formData));
    };


    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files); // converting files into array of files from file list

        setImagesPreview([]);
        setImages([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
      
            reader.onload = () => { // onload is a event listener which is called when the file is loaded
              if (reader.readyState === 2) { // readyState 2 means file is loaded
                setImagesPreview((old) => [...old, reader.result]); // setting images preview
                setImages((old) => [...old, reader.result]); // setting images to be uploaded
              }
            };
      
            reader.readAsDataURL(file); // reading file as data url
        });
    };


  return (
    <>
        <MetaData title="Update Product" />
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
                <form
                    className="createProductForm"
                    encType="multipart/form-data"
                    onSubmit={updateProductSubmitHandler}
                >
                    <h1>Update Product</h1>

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
                            value={price}
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
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
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
                            value={stock}
                        />
                    </div>

                    <div id="createProductFormFile">
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateProductImagesChange}
                            multiple
                        />
                    </div>

                    <div id="createProductFormImage">
                        {oldImages &&
                            oldImages.map((image, index) => (
                            <img key={index} src={image.url} alt="Old Product Preview" />
                            ))}
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
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </form>
            </div>
        </div>
    </>
  )
}

export default UpdateProduct
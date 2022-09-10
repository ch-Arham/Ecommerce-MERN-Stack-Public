const Product = require('../models/productModel');
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

/*
Controller 01: Create Product               /api/v1/admin/products/new (POST)
Controller 02: Get All Products             /api/v1/products (GET)
Controller2.1: Get All Products (Admin)     /api/v1/admin/products (GET)
Controller 03: Update Product               /api/v1/admin/products/:id (PUT)
Controller 04: Delete Product               /api/v1/admin/products/:id (DELETE)
Controller 05: Get Single Product           /api/v1/products/:id (GET)
Controller 06: Create or Update Review      /api/v1/products/:id (PUT)
Controller 07: Get All Reviews              /api/v1/reviews (GET)
Controller 08: Delete Review                /api/v1/products/:id (DELETE)
*/

// Controller 1: Create a new product /api/v1/admin/products/new -- Admin only -- POST
exports.createProduct = catchAsyncErrors(async (req, res) => {
    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    };

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    
    res.status(201).json({ success: true, product, message: 'Product Created Successfully'});
});


// Controller 2: Get all products /api/v1/products  -- GET
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
});


// Controller 2.1: Get all products for admin /api/v1/admin/products  -- GET
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
});

// Controller 3: Update a product /api/v1/admin/products/:id -- Admin only -- PUT
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    //Find the product to update and update it
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Images----------------------------------
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if(images !== undefined){
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
              folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    // Update Product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({ success: true, product, message: 'Product Updated Successfully'});
});


// Controller 4: Delete a product /api/v1/admin/products/:id -- Admin only -- DELETE
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler(`Product not found with id of ${req.params.id}`, 404));
    }

    // Delete Images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: product, message: 'Product Deleted Successfully'});
});


// Controller 5: Get a single product /api/v1/products/:id -- GET
exports.getSingleProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler("Product not found", 404));
    } 
    
    res.status(200).json({ success: true, product, message: 'Product Details Fetched Successfully'});
});


// Controller 6: Create New Review or Update an existing review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    
    const { rating, comment, productId } = req.body;
    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    // Check if the user has already reviewed the product 
    const isReviewed = product.reviews.some(review => review.user.toString() === req.user._id.toString());

    if(isReviewed){
        // Update the review
        product.reviews.map(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.rating = Number(rating);
                review.comment = comment;
            }
        });

    }else{
        // Add the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    // Gets us the average rating of the product
    product.ratings = product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length;

    // Save the product
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, product, message: 'Product Review Created Successfully'});

});


// Controller 7: Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({ success: true, reviews: product.reviews, message: 'Product Reviews Fetched Successfully'});
});


// Controller 8: Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    // only keep required reviews for the product (remove the review of the user)
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString());

    let ratings = 0;

    if(reviews.length === 0){
        ratings = 0;
    }else{
        // Gets us the average rating of the product
        ratings = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({ success: true, reviews, message: 'Review Deleted Successfully'});

});
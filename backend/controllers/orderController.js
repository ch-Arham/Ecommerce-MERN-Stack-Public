const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

/*
Controller 01: Create Order                 /api/v1/order/new (POST)
Controller 02: Get Single Order             /api/v1/order/:id (GET)
Controller 03: Logged In User's Orders      /api/v1/orders/me (GET)
Controller 04: Get All Orders               /api/v1/admin/orders (GET)
Controller 05: Update Order Status          /api/v1/admin/order/:id (PUT)
Controller 06: Delete Order                 /api/v1/admin/order/:id (DELETE)
*/

// Controller 1: Create New Order /api/v1//order/new -- POST
exports.createNewOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    
    const productIds = orderItems.map(item => item.product);

    // get only price array from Product Model
    const product = await Product.find({ _id: { $in: productIds } }, { price: 1, stock: 1 });
    
    const productStock = product.map(item => item.stock);

    // check if product stock is enough for the orderItems quantity
    const enoughStock = productStock.every((stock,index) => stock >= orderItems[index].quantity);
 
    if (!enoughStock) return next(new ErrorHandler("Not Enough Stock", 400));


    const productPriceArray = product.map(item => item.price);

    const orderItemsPrice = orderItems.map(item => item.price);
    
    if(productPriceArray.length !== orderItemsPrice.length) return next(new ErrorHandler("Product Price Not Found", 404));
 
    // compare productPriceArray with orderItemsPrice
    if(productPriceArray.toString() !== orderItemsPrice.toString()) return next(new ErrorHandler("Product Price Does Not Match", 404));

    // check if the itemsPrice is equal to orderItemsPrice
    let itemsPriceSum = 0;
    orderItems.forEach(item => {
        itemsPriceSum += item.price * item.quantity;
    } );
    if (itemsPriceSum !== itemsPrice) return next(new ErrorHandler("Items Price Sum Is Not Equal To Items Price", 400));


    // check if the totalPrice is equal to itemsPrice + taxPrice + shippingPrice
    if(itemsPrice + taxPrice + shippingPrice !== totalPrice) return next(new ErrorHandler("Total Price Is Not Correct", 400));

    const newOrder = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({ status: "success", data: { order: newOrder }, message: "Order Created Successfully" });

});


// Controller 2: Get Single Order /api/v1/order/:id -- GET -- Admin Only
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    // populate will check user id and populate user info from its collection
    const order = await Order.findById(req.params.id).populate("user","name email");

    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    res.status(200).json({ success: true, data: { order } });

});


// Controller 3: Get Logged In User's Orders /api/v1/orders/me -- GET
exports.myOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        data: { orders }
    });

});


// Controller 4: Get All Orders /api/v1/admin/orders -- GET -- Admin Only
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find();

    const totalOrders = orders.length;

    let totalAmount = 0;

    // Calculate Total Amount of Orders
    orders.forEach(order => totalAmount += order.totalPrice );

    res.status(200).json({ success: true, data: { orders, totalAmount, totalOrders } });

});


// Controller 5: Update Order Status /api/v1/admin/order/:id -- PUT -- Admin Only
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id);

    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    
    if(!req.body.orderStatus) return next(new ErrorHandler("Order Status Not Found", 400));
    
    // check whether the orderStatus is valid
    if(!["Processing", "Shipped", "Delivered", "Cancelled"].includes(req.body.orderStatus)) return next(new ErrorHandler("Order Status Is Not Valid", 400));
    
    if (order.orderStatus === "Delivered") return next(new ErrorHandler("Order Already Delivered", 400));

    if(order.orderStatus === "Cancelled") return next(new ErrorHandler("Order Already Cancelled", 400));

    if(req.body.orderStatus ==="Shipped" && order.orderStatus === "Shipped") return next(new ErrorHandler("Order Already Shipped", 400));


    if(req.body.orderStatus === "Shipped") {
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity);
        })
    }

    order.orderStatus = req.body.orderStatus;

    if(req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: { order },
        message: "Order Updated Successfully"
    });

});

// updateStock function will update the product stock quantity
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    
    product.stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }


// Controller 6: Delete Order /api/v1/admin/order/:id -- DELETE -- Admin Only
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    await order.remove();

    res.status(200).json({ success: true, data: { order }, message: "Order Deleted Successfully" });

});
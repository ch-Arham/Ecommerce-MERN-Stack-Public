const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Address Is Required"],
            minlength: [3, "Address Must Be At Least 3 Characters"],
            maxlength: [100, "Address Must Be At Most 100 Characters"],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City Is Required"],
            minlength: [3, "City Must Be At Least 3 Characters"],
            maxlength: [100, "City Must Be At Most 100 Characters"],
            trim: true
        },
        state: {
            type: String,
            required: [true, "State Is Required"],
        },
        country: {
            type: String,
            required: [true, "Country Is Required"],
        },
        pinCode: {
            type: Number,
            required: [true, "Pin Code Is Required"],
            min: [10000, "Pin Code Must Be At Least 5 Digits"],
            max: [999999, "Pin Code Must Be At Most 6 Digits"],
        },
        phoneNo: {
            type: Number,
            required: [true, "Phone No Is Required"],
            min: [1000000000, "Phone No Must Be At Least 10 Digits"],
            max: [999999999999999, "Phone No Must Be At Most 15 Digits"],
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "Name Is Required"],
                minlength: [2, "Name Must Be At Least 2 Characters"],
                maxlength: [100, "Name Must Be At Most 100 Characters"],
                trim: true
            },
            price: {
                type: Number,
                required: [true, "Price Is Required"],
                min: [0, "Product Price Must Be At Least 0"],
                max: [99999999, "Product Price Must Be At Most 99999999"],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity Is Required"],
                min: [1, "Quantity Must Be At Least 1"],
                max: [9999, "Quantity Must Be At Most 9999"],
            },
            image: {
                type: String,
                required: [true, "Image Is Required"]
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: [true, "Payment Id Is Required"],
        },
        status: {
            type: String,
            required: [true, "Payment Status Is Required"],
        }
    },
    paidAt: {
        type: Date,
        required: [true, "Paid At Date Is Required"],
    },
    itemsPrice: {
        type: Number,
        required: [true, "Items Price Is Required"],
        default: 0,
        max: [99999999, "Items Price Must Be At Most 99999999"],
    },
    taxPrice: {
        type: Number,
        required: [true, "Tax Price Is Required"],
        default: 0,
        max: [99999999, "Tax Price Must Be At Most 99999999"],
    },
    shippingPrice: {
        type: Number,
        required: [true, "Tax Price Is Required"],
        default: 0,
        max: [99999999, "Tax Price Must Be At Most 99999999"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Tax Price Is Required"],
        default: 0,
        max: [99999999, "Tax Price Must Be At Most 99999999"],
    },
    orderStatus: {
        type: String,
        required: [true, "Order Status Is Required"],
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);

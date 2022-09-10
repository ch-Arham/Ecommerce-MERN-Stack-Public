const mongooose = require('mongoose');
const Schema = mongooose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product Name Is Required"],
        minlength: [2, "Product Name Must Be At Least 2 Characters Long"],
        maxlength: [50, "Product Name Must Be At Most 50 Characters Long"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product Description Is Required"],
        minlength: [2, "Product Description Must Be At Least 2 Characters Long"],
        maxlength: [500, "Product Description Must Be At Most 500 Characters Long"],
    },
    price: {
        type: Number,
        required: [true, "Product Price Is Required"],
        min: [0, "Product Price Must Be At Least 0"],
        max: [99999999, "Product Price Must Be At Most 99999999"],
    },
    ratings: {
        type: Number,
        min: [0, "Product Ratings Must Be At Least 0"],
        max: [5, "Product Ratings Must Be At Most 5"],
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Product Category Is Required"]
    },
    stock: {
        type: Number,
        required: [true, "Product Stock Is Required"],
        max: [9999, "Product Stock Must Be At Most 9999"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId, // mongoose.Schema.ObjectId
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Create a model based on the schema
const Product = mongooose.model('Product', ProductSchema);

module.exports = Product;

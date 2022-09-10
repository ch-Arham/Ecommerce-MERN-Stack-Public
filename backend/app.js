const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

// import Routes
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute')

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

// parsing 
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// allow cross-origin requests
app.use(cors({
    origin: true,
    credentials: true
}));

// use routes
app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', payment);

// serve static files from frontend build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
})

// Middleware for Error Handling
app.use(errorMiddleware)



module.exports = app;
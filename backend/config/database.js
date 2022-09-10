const mongoose = require('mongoose');

// Connect to MongoDB
const connectToMongoDB = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
}

module.exports = connectToMongoDB;

import axios from "axios";


export default axios.create({
    baseURL: "https://royal-collections.herokuapp.com",
    // withCredentials: true,
});

// localhost --> http://localhost:5000
// heroku -->   https://royal-collections.herokuapp.com
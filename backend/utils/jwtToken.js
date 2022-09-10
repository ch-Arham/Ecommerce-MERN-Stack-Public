// Generate a JWT token for the user and store it in the cookie
const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();

    // options for cookie to be sent to the client
    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000) // convert to milliseconds
        ),
        httpOnly: true
    }

    // removing password from user object
    user.password = undefined;

    // send the token to the client
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user: user,
        token: token,
        message: message
    });
    
}

module.exports = sendToken;


// Using the HttpOnly flag when generating a cookie helps mitigate the risk of 
// client side script accessing the protected cookie
//https://www.geeksforgeeks.org/http-cookies-in-node-js/?ref=lbp
const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const { 
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
    getUserDetail, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser
} = require('../controllers/userController');


router.route("/users/new").post(registerUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetail);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizedRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateUserRole)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser)
;


module.exports = router;
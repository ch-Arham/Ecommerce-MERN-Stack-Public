const express = require('express');
const router = express.Router();
const {
    createNewOrder,
    getSingleOrder, 
    myOrders, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder
} = require('../controllers/orderController');

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.route('/order/new').post(isAuthenticatedUser, createNewOrder);

router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);

router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router
    .route('/admin/orders')
    .get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrders)
;

router
    .route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder)
;


module.exports = router;
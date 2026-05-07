const express = require('express');
const orderRouter = express.Router();
const { placeOrderCOD, getUserOrders, getAllOrders,updateOrderStatus ,togglePaymentStatus } = require('../controllers/orderController');
const authUser = require('../middleware/authUser');
const authAdmin = require('../middleware/authAdmin');
const limiter = require('../middleware/rateLimiter');


// ✅ Apply rate limiter globally
orderRouter.use(limiter);

// User Routes
orderRouter.post('/place-cod', authUser, placeOrderCOD);
orderRouter.get('/user-orders', authUser, getUserOrders);

// Admin Routes
orderRouter.get('/all-orders', getAllOrders);
// updated ordersatatus 
orderRouter.post('/update-status', updateOrderStatus);
orderRouter.post('/toggle-payment',  togglePaymentStatus);

module.exports = orderRouter;
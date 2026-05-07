const express = require('express');
const cartRouter = express.Router();
const { updateCart} = require('../controllers/cartController');
const authUser = require('../middleware/authUser');

// Protected routes using authUser middleware
cartRouter.post('/update', authUser, updateCart);

module.exports = cartRouter;
const express = require('express');
const userRouter = express.Router();
const { register, login, isAuth, logout, addToCart , updateCart , getCart } = require('../controllers/userController');
const authUser = require('../middleware/authUser');

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.post('/logout', logout); // Changed to POST (standard) or GET is fine
userRouter.post('/cart/add', authUser, addToCart);
userRouter.post('/cart/update', authUser, updateCart);
userRouter.get('/cart/get', authUser, getCart);

module.exports = userRouter;
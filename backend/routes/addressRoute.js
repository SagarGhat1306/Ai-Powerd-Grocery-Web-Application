const express = require('express');
const addressRouter = express.Router();
const { addAddress, getAddresses } = require('../controllers/addressController');
const authUser = require('../middleware/authUser');

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddresses);

module.exports = addressRouter;
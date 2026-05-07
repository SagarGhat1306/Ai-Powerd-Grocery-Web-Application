const express = require('express');
const adminRouter = express.Router(); // Renamed to adminRouter for clarity
const { AdminLogin, Adminlogout, isAdminAuth } = require('../controllers/adminController');
const authAdmin = require('../middleware/authAdmin');

adminRouter.post('/login', AdminLogin);
adminRouter.get('/is-auth', authAdmin, isAdminAuth);
adminRouter.post('/logout', Adminlogout); // Fixed function name

module.exports = adminRouter;
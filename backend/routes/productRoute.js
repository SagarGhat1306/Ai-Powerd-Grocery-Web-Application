const express = require("express");
const productRouter = express.Router();

const upload = require('../middleware/multer');
const authAdmin = require('../middleware/authAdmin');
const limiter = require("../middleware/rateLimiter");

const { 
    addProduct, 
    productList, 
    productById, 
    deleteProductById, 
    updateProduct,
    changeStock 
} = require("../controllers/productController");

// ✅ Apply rate limiter to all product routes
productRouter.use(limiter);

// Routes
productRouter.post("/add", upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.get("/list", productList);

productRouter.get("/single/:id", productById);

productRouter.delete("/delete/:id", deleteProductById);

productRouter.put("/update/:id",  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), updateProduct);

productRouter.post("/change-stock", changeStock);

module.exports = productRouter;
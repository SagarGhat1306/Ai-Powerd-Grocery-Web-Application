const Product = require("../models/Product");
const cloudinary = require('cloudinary').v2;
const redisClient = require("../config/redis");

// Add Product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category, inStock } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description: JSON.parse(description),
            price: Number(price),
            offerPrice: Number(offerPrice),
            category,
            inStock: inStock === 'true' || inStock === true,
            image: imagesUrl
        };

        const product = new Product(productData);
        await product.save();

        // ❗ Invalidate cache
        await redisClient.del("products:all");

        res.json({ success: true, message: "Product Added with Cloudinary Images" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Get All Products
const productList = async (req, res) => {
    try {
        const cacheKey = "products:all";

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({ success: true, products: JSON.parse(cachedData), cached: true });
        }

        const products = await Product.find({});

        // TTL: 60 sec
        await redisClient.setEx(cacheKey, 60, JSON.stringify(products));

        res.json({ success: true, products });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Get Single Product
const productById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `product:${id}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({ success: true, product: JSON.parse(cachedData), cached: true });
        }

        const product = await Product.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        // TTL: 5 min
        await redisClient.setEx(cacheKey, 300, JSON.stringify(product));

        res.json({ success: true, product });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Delete Product
const deleteProductById = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        // ❗ Invalidate cache
        await redisClient.del("products:all");
        await redisClient.del(`product:${req.params.id}`);

        res.json({ success: true, message: "Product Deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.files) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            if (images.length > 0) {
                const imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url;
                    })
                );
                updateData.image = imagesUrl;
            }
        }

        if (updateData.description) updateData.description = JSON.parse(updateData.description);
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.offerPrice) updateData.offerPrice = Number(updateData.offerPrice);

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        // ❗ Invalidate cache
        await redisClient.del("products:all");
        await redisClient.del(`product:${id}`);

        res.json({ success: true, message: "Product Updated Successfully", updatedProduct });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Change Stock
const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // ❗ Invalidate cache
        await redisClient.del("products:all");
        await redisClient.del(`product:${id}`);

        res.json({ success: true, message: "Stock status updated", product });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    addProduct,
    productList,
    productById,
    deleteProductById,
    updateProduct,
    changeStock
};
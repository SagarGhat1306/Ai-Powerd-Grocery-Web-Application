const Order = require("../models/Order");
const Product = require("../models/Product");
const redisClient = require("../config/redis");

// Place Order using Cash on Delivery
const placeOrderCOD = async (req, res) => {
    try {
        const {items, address } = req.body;
        const userId = req.userId;
        
        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid order data" });
        }

        // Calculate amount accurately from DB prices
        let amount = 0;
        for (const item of items) {
            const productInfo = await Product.findById(item.product);
            amount += productInfo.offerPrice * item.quantity;
        }

        // Adding 2% handling/tax fee as per your logic
        amount += Math.floor(amount * 0.02);

        const newOrder = new Order({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: false, // COD is usually unpaid until delivery
        });

        await newOrder.save();
        
        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// User Orders (For specific user's view)
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const cacheKey = `orders:user:${userId}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                orders: JSON.parse(cachedData),
                cached: true
            });
        }

        const orders = await Order.find({ userId })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        // TTL: 30 sec (user data changes frequently)
        await redisClient.setEx(cacheKey, 30, JSON.stringify(orders));

        res.json({ success: true, orders });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin Orders (For admin to see all users' orders)
const getAllOrders = async (req, res) => {
    try {
        const cacheKey = "orders:all";

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                orders: JSON.parse(cachedData),
                cached: true
            });
        }

        const orders = await Order.find({})
            .populate("items.product")
            .populate("address")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        // TTL: 20 sec (admin dashboard needs freshness)
        await redisClient.setEx(cacheKey, 20, JSON.stringify(orders));

        res.json({ success: true, orders });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order updated", order: updatedOrder });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle Payment Status (Admin)
const togglePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID required" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Toggle logic
        order.isPaid = !order.isPaid;

        await order.save();

        res.json({
            success: true,
            message: "Payment status updated",
            isPaid: order.isPaid
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { placeOrderCOD, getUserOrders, getAllOrders ,  updateOrderStatus, togglePaymentStatus};
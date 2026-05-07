const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, enum: ["COD", "Online"], required: true },
    isPaid: { type: Boolean, required: true, default: false },
    date: { type: Number, default: Date.now }
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
module.exports = Order;
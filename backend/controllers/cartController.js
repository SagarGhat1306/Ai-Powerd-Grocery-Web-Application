const User = require("../models/User");

// Update User Cart
const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.userId; 
        // Fixed typos: uerId -> userId, cartIems -> cartItems
        const userData = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Cart Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


module.exports = { updateCart};
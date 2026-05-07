const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User Already Exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// IS AUTH (Get User Data)
const isAuth = async (req, res) => {
    try {
        const userId = req.userId; 
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// LOGOUT
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict',
        });
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const {itemId } = req.body;
        const userId = req.userId; 
        const user = await User.findById(userId);
        let cartData = user.cartItems || {};

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        await User.findByIdAndUpdate(userId, { cartItems: cartData });

        res.json({ success: true, cartItems: cartData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// UPDATE CART
const updateCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.userId; 

        const user = await User.findById(userId);
        let cartData = user.cartItems;

        cartData[itemId] = quantity;

        await User.findByIdAndUpdate(userId, { cartItems: cartData });

        res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET CART
const getCart = async (req, res) => {
    try {
        const userId = req.userId; 

        const user = await User.findById(userId);

        res.json({ success: true, cartItems: user.cartItems });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = { register, login, logout, isAuth, addToCart , updateCart , getCart};
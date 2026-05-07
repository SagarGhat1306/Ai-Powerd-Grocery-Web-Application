const Address = require("../models/Address");
const redisClient = require("../config/redis");
// POST: Add a new address
const addAddress = async (req, res) => {
    try {
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;
        const userId = req.userId; 
        // Validation Check
        if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const addressData = {
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        };

        const newAddress = new Address(addressData);
        await newAddress.save();
        await redisClient.del(`address:user:${userId}`);a

        res.json({ success: true, message: "Address added successfully", address: newAddress });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// GET: Fetch all addresses for a specific user
const getAddresses = async (req, res) => {
    try {
        const userId = req.userId;

        const cacheKey = `address:user:${userId}`;

        // 🔍 Check cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                addresses: JSON.parse(cachedData),
                cached: true
            });
        }

        // 🐢 DB call
        const addresses = await Address.find({ userId });

        // ⚡ Store in Redis (TTL: 2 minutes)
        await redisClient.setEx(cacheKey, 120, JSON.stringify(addresses));

        res.json({ success: true, addresses });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { addAddress, getAddresses };
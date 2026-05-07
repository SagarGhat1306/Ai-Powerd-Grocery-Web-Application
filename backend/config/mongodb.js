const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Listen for connection success
        mongoose.connection.on('connected', () => {
            console.log("Database Connected ✅");
        });

        // Attempt connection
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        
    } catch (error) {
        console.error("Database connection failed ❌:", error.message);
        process.exit(1); // Stop the server if DB fails
    }
};

module.exports = connectDB;
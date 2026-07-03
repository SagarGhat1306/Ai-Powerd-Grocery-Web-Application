require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 1. Import cookie-parser
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const compression = require("compression");
const helmet = require("helmet");


const app = express();
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const addressRouter = require('./routes/addressRoute');
const orderRouter = require('./routes/orderRoute');
const chatRouter = require('./routes/chatRoute');


connectDB();
connectCloudinary();
app.use(compression()); 
app.use(helmet());
// Middleware
app.use(express.json()); 
app.use(cookieParser());
// 2. Use cookie-parser middleware

app.use(cors({
    origin: [
        "http://13.126.98.63", 
        "http://13.126.98.63:8080",

        // local development
        "http://localhost:5173",
        "http://localhost:5174"
    ], // Replace with your frontend URL (e.g., http://localhost:5173)
    credentials: true                // 3. Required to allow cookies to pass through CORS
}));

// Test Route
app.get('/api/test', (req, res) => {
    res.send("Server is running smoothly");
});

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use("/api/ai", chatRouter);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import injectRoutes from './routes/index.js';
import Razorpay from 'razorpay';

// Force dotenv to load before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body-parser with high limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Razorpay Instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// Database Connection
connectDB();

// Route Injection
injectRoutes(app);

app.listen(PORT, () => {
    console.log(`[SERVER]: Running on port ${PORT}`);
    console.log(`[SMTP]: Verifying configuration...`);
});

import express from 'express';
import crypto from 'crypto';
import { razorpay } from '../index.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create Order ID
router.post('/order', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
        
        // Check if real keys are provided
        if (key_id !== 'rzp_test_placeholder') {
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };
            const order = await razorpay.orders.create(options);
            return res.status(200).json({ success: true, order, key_id });
        } else {
            // DEMO MODE: Return a mock order if keys are missing
            return res.status(200).json({ 
                success: true, 
                order: { 
                    id: `order_mock_${Date.now()}`, 
                    amount: amount * 100,
                    currency: "INR" 
                },
                key_id: 'rzp_test_placeholder',
                isDemo: true
            });
        }
    } catch (error) {
        console.error("Razorpay Order Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Verify Payment Signature
router.post('/verify', protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (razorpay_order_id.startsWith('order_mock_')) {
            return res.status(200).json({ success: true, message: "Demo Payment accepted" });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;

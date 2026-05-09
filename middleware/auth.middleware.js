import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Using hashKey to match the auth controller signing key
            const secret = process.env.hashKey || 'secret123';
            const decoded = jwt.verify(token, secret);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const isVendor = (req, res, next) => {
    if (req.user && req.user.role === 'vendor') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Requires Vendor role' });
    }
};

export const isCustomer = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Requires Customer role' });
    }
};

import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../utils/sendEmail.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const signup = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });

        // If user exists and already verified
        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User already exists and is verified. Please login.'
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {

            // Update existing unverified user
            user.name = name;
            user.password = hashedPassword;
            user.role = role;

            await user.save();

        } else {

            // Create new user
            user = new User({
                name,
                email,
                password: hashedPassword,
                role
            });

            await user.save();
        }

        // GENERATE OTP
        const otpCode = generateOTP();

        // DELETE OLD OTP
        await OTP.deleteMany({ email });

        // SAVE NEW OTP
        await OTP.create({
            email,
            otp: otpCode
        });

        // SEND EMAIL (WITHOUT AWAIT)
        sendOTPEmail(email, otpCode);

        // RETURN RESPONSE FAST
        return res.status(201).json({
            success: true,
            message: 'OTP sent to email. Please verify.'
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isVerified = true;
        await user.save();

        await OTP.deleteMany({ email });

        const token = jwt.sign({ id: user._id, role: user.role, type: user.role }, process.env.hashKey, { expiresIn: '1d' });
        res.status(200).json({ success: true, accessToken: token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
        if (!user.isVerified) return res.status(401).json({ success: false, message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role, type: user.role }, process.env.hashKey, { expiresIn: '1d' });
        res.status(200).json({ success: true, accessToken: token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export default {
    signup,
    verifyOTP,
    login
};

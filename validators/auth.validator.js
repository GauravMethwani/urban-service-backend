import Joi from 'joi';

const signup = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'vendor').required()
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const verifyOTP = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

export default {
    signup,
    login,
    verifyOTP
};

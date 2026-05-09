import authValidator from './auth.validator.js';

export const validators = {
    '/api/auth/signup': authValidator.signup,
    '/api/auth/login': authValidator.login,
    '/api/auth/verify-otp': authValidator.verifyOTP
};

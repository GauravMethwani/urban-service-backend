import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import User from './user.model.js';
import Service from './service.model.js';
import Booking from './booking.model.js';
import OTP from './otp.model.js';

const db = {};
db.mongoose = mongoose;
db.user = User;
db.service = Service;
db.booking = Booking;
db.otp = OTP;

export default db;

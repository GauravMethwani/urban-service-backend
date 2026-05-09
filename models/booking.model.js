import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'delivered', 'cancelled'], default: 'pending' },
    bookingDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

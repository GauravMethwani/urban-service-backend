import Booking from '../models/booking.model.js';
import Service from '../models/service.model.js';

const createBooking = async (req, res) => {
    try {
        const { serviceId } = req.body;
        const customerId = req.user.id;

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        const booking = new Booking({
            customer: customerId,
            vendor: service.vendor,
            service: serviceId,
            status: 'pending'
        });

        await booking.save();
        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getVendorBookings = async (req, res) => {
    try {
        // Added image and locationType to populate
        const bookings = await Booking.find({ vendor: req.user.id })
            .populate('customer', 'name email')
            .populate('service', 'name price category image locationType');
        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getCustomerBookings = async (req, res) => {
    try {
        // Added image and locationType to populate
        const bookings = await Booking.find({ customer: req.user.id })
            .populate('vendor', 'name email')
            .populate('service', 'name price category image locationType');
        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.vendor.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export default {
    createBooking,
    getVendorBookings,
    getCustomerBookings,
    updateBookingStatus
};

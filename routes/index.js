import authRoutes from './auth.routes.js';
import serviceRoutes from './service.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';

const injectRoutes = (app) => {
    // Note: authRoutes might still be a function, checking that next
    app.use('/api/auth', authRoutes);
    app.use('/api/services', serviceRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/payments', paymentRoutes);
};

export default injectRoutes;

import express from 'express';
import bookingController from "../controllers/booking.controller.js";
import { protect, isVendor, isCustomer } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isCustomer, bookingController.createBooking);
router.get("/vendor", protect, isVendor, bookingController.getVendorBookings);
router.get("/customer", protect, isCustomer, bookingController.getCustomerBookings);
router.put("/:id", protect, isVendor, bookingController.updateBookingStatus);

export default router;

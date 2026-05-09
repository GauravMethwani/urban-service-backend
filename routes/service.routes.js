import express from 'express';
import serviceController from "../controllers/service.controller.js";
import { protect, isVendor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isVendor, serviceController.createService);
router.put("/:id", protect, isVendor, serviceController.updateService);
router.delete("/:id", protect, isVendor, serviceController.deleteService);
router.get("/", serviceController.getAllServices);
router.get("/vendor", protect, isVendor, serviceController.getVendorServices);
router.get("/:id", serviceController.getServiceById);

export default router;

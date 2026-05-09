import Service from '../models/service.model.js';

const createService = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const service = new Service({
            ...req.body,
            vendor: vendorId
        });

        await service.save();
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        
        if (service.vendor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedService });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        
        if (service.vendor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getAllServices = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const services = await Service.find(query).populate('vendor', 'name');
        res.status(200).json({ success: true, data: services });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('vendor', 'name');
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getVendorServices = async (req, res) => {
    try {
        const services = await Service.find({ vendor: req.user.id });
        res.status(200).json({ success: true, data: services });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export default {
    createService,
    updateService,
    deleteService,
    getAllServices,
    getServiceById,
    getVendorServices
};

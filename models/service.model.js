import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceUnit: {
        type: String,
        default: 'Per Service'
    },
    category: {
        type: String,
        required: true,
        enum: ['Travel', 'Home Service', 'Beauty', 'Logistics']
    },
    image: {
        type: String // Main Banner
    },
    gallery: {
        type: [String], // Array of 4 extra images
        default: []
    },
    locationType: {
        type: String,
        default: 'On-site'
    },
    duration: {
        type: String,
        default: '60 mins'
    },
    metadata: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;

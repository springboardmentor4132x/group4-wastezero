const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    wasteType: {
        type: String,
        required: true,
        enum: ['plastic', 'paper', 'metal', 'e-waste', 'organic']
    },
    quantity: {
        type: Number,
        required: true
    },
    preferredDate: {
        type: Date,
        required: true
    },
    notes: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    volunteer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);

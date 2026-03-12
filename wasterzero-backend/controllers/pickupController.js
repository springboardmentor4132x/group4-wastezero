const Pickup = require('../models/Pickup');

// CREATE PICKUP
exports.createPickup = async (req, res) => {
    try {
        const { wasteType, quantity, address, preferredDate, notes } = req.body;
        const pickup = new Pickup({
            user_id: req.user.id,
            wasteType,
            quantity,
            address,
            preferredDate,
            notes
        });
        await pickup.save();
        res.status(201).json({ success: true, message: "Pickup scheduled successfully!", data: pickup });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET USER'S PICKUPS (Citizen)
exports.getMyPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: pickups });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET ALL PICKUPS (Admin)
exports.getAllPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find().populate('user_id', 'name email location').sort({ createdAt: -1 });
        res.json({ success: true, data: pickups });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET AVAILABLE (Volunteer)
exports.getAvailablePickups = async (req, res) => {
    try {
        const pickups = await Pickup.find({ status: 'pending' }).populate('user_id', 'name address').sort({ createdAt: -1 });
        res.json({ success: true, data: pickups });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE STATUS
exports.updatePickupStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const pickup = await Pickup.findByIdAndUpdate(
            req.params.id,
            { status, volunteer_id: req.user.id },
            { new: true }
        );
        res.json({ success: true, message: `Status updated to ${status}`, data: pickup });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

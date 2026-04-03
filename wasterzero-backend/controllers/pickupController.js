const Pickup = require('../models/Pickup');

// CREATE PICKUP
exports.createPickup = async (req, res) => {
    console.log("🚚 Creating pickup request:", { ...req.body, user: req.user?.id });
    try {
        const { wasteType, quantity, address, preferredDate, notes } = req.body;
        
        if (!wasteType || !quantity || !address || !preferredDate) {
            return res.status(400).json({ success: false, message: "Required fields missing (Identity, Quantity, Vector, or Date)" });
        }

        const pickup = new Pickup({
            user_id: req.user.id,
            wasteType,
            quantity: Number(quantity),
            address,
            preferredDate: new Date(preferredDate),
            notes
        });

        await pickup.save();
        console.log("✅ Pickup saved successfully:", pickup._id);
        res.status(201).json({ success: true, message: "Pickup scheduled successfully!", data: pickup });
    } catch (err) {
        console.error("🔥 PICKUP CREATION FAULT:", err);
        res.status(500).json({ success: false, message: "Vector coordinates rejected: " + err.message });
    }
};

// GET USER'S PICKUPS (Citizen or assigned Volunteer)
exports.getMyPickups = async (req, res) => {
    try {
        const query = {
            $or: [
                { user_id: req.user.id },
                { volunteer_id: req.user.id }
            ]
        };
        const pickups = await Pickup.find(query).sort({ createdAt: -1 });
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
        const updateData = { status };

        // If a volunteer accepts, set their ID
        if (status === 'accepted' || status === 'on-the-way') {
            updateData.volunteer_id = req.user.id;
        }

        const pickup = await Pickup.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

        res.json({ success: true, message: `Status updated to ${status}`, data: pickup });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

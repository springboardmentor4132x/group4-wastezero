const Pickup = require("../models/Pickup");
const Notification = require("../models/Notification");

// ── Helper to create notification ──
const createNotification = async (user_id, type, title, message, link = "") => {
  try {
    const notification = new Notification({ user_id, type, title, message, link });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

// USER: Create Pickup Request
exports.createPickup = async (req, res) => {
  try {
    const {
      wasteType,
      description,
      quantity,
      address,
      preferredDate,
      preferredTime,
      contactNumber
    } = req.body;

    const pickup = new Pickup({
      user_id: req.user.id,
      wasteType,
      description,
      quantity,
      address,
      preferredDate,
      preferredTime,
      contactNumber
    });

    await pickup.save();

    res.status(201).json({
      message: "Pickup request created successfully",
      pickup
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get My Pickups
exports.getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      user_id: req.user.id,
      isDeleted: false
    }).populate("volunteer_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOLUNTEER: Get All Open Pickups
exports.getOpenPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      status: "Open",
      isDeleted: false
    }).populate("user_id", "name email location");

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOLUNTEER: Accept Pickup
exports.acceptPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (pickup.status !== "Open") {
      return res.status(400).json({ message: "Pickup is no longer available" });
    }

    pickup.volunteer_id = req.user.id;
    pickup.status = "Accepted";
    await pickup.save();

    // Notify the user whose pickup was accepted
    await createNotification(
      pickup.user_id,
      "pickup_accepted",
      "Pickup Request Accepted! 🚛",
      `A volunteer has accepted your ${pickup.wasteType} waste pickup request at ${pickup.address}.`,
      "/schedule-pickup"
    );

    res.json({ message: "Pickup accepted successfully", pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOLUNTEER: Complete Pickup
exports.completePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    if (pickup.volunteer_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    pickup.status = "Completed";
    await pickup.save();

    // Notify the user that pickup is done
    await createNotification(
      pickup.user_id,
      "pickup_completed",
      "Pickup Completed! ♻️",
      `Your ${pickup.wasteType} waste pickup at ${pickup.address} has been completed successfully.`,
      "/schedule-pickup"
    );

    res.json({ message: "Pickup marked as completed", pickup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOLUNTEER: Get My Accepted Pickups
exports.getMyAcceptedPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      volunteer_id: req.user.id,
      isDeleted: false
    }).populate("user_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get All Pickups
exports.getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ isDeleted: false })
      .populate("user_id", "name email")
      .populate("volunteer_id", "name email");

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Delete Pickup
exports.deletePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    res.json({ message: "Pickup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Notification = require("../models/Notification");

// Get my notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.user.id
    }).sort({ createdAt: -1 }).limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all as read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark one as read
exports.markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user_id: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to CREATE a notification (used internally by other controllers)
exports.createNotification = async (user_id, type, title, message, link = "") => {
  try {
    const notification = new Notification({
      user_id, type, title, message, link
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
const Notification = require('../models/Notification');

// GET ALL NOTIFICATIONS FOR USER
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// MARK ALL AS READ
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
        res.json({ success: true, message: "All marked as read" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Utility function to create and emit notification (to be used in other controllers)
exports.createAndNotify = async (app, notificationData) => {
    try {
        const notification = new Notification(notificationData);
        await notification.save();

        const io = app.get("io");
        if (io) {
            io.to(notificationData.userId.toString()).emit("new_notification", notification);
        }
        return notification;
    } catch (err) {
        console.error("Error creating/emitting notification:", err);
    }
};

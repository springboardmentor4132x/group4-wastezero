const Message = require('../models/Message');
const User = require('../models/User');

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });
        await message.save();
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET MESSAGES
exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CHAT HISTORY USERS (Those who already have messages with current user)
exports.getChatUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find unique users in messages where current user is sender or receiver
        const sentMessages = await Message.distinct('receiver', { sender: currentUserId });
        const receivedMessages = await Message.distinct('sender', { receiver: currentUserId });

        const uniqueUserIds = [...new Set([...sentMessages, ...receivedMessages])];

        const users = await User.find({ _id: { $in: uniqueUserIds } }).select('name role email');
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// SEARCH USERS (To start new chats)
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json({ success: true, data: [] });
        }

        const users = await User.find({
            _id: { $ne: req.user.id },
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('name role email').limit(10);

        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const Message = require("../models/Message");
const User = require("../models/User");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    const message = new Message({ sender_id, receiver_id, content });
    await message.save();

    const populated = await Message.findById(message._id)
      .populate("sender_id", "name role")
      .populate("receiver_id", "name role");

    // Emit via socket if available
    const io = req.app.get("io");
    if (io) {
      io.to(receiver_id).emit("newMessage", populated);
    }

    res.status(201).json({ message: "Message sent", data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender_id: myId, receiver_id: userId },
        { sender_id: userId, receiver_id: myId }
      ]
    })
      .populate("sender_id", "name role")
      .populate("receiver_id", "name role")
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender_id: userId, receiver_id: myId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations (inbox) for current user
exports.getInbox = async (req, res) => {
  try {
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender_id: myId }, { receiver_id: myId }]
    })
      .populate("sender_id", "name role")
      .populate("receiver_id", "name role")
      .sort({ createdAt: -1 });

    // Get unique conversation partners
    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const other =
        msg.sender_id._id.toString() === myId
          ? msg.receiver_id
          : msg.sender_id;

      if (!seen.has(other._id.toString())) {
        seen.add(other._id.toString());

        const unread = await Message.countDocuments({
          sender_id: other._id,
          receiver_id: myId,
          isRead: false
        });

        conversations.push({
          user: other,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users to start a conversation with
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "name email role location"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver_id: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
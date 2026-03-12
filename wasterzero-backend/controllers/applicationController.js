const Application = require('../models/Application');

// VOLUNTEER APPLY
exports.apply = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const app = new Application({
      opportunity_id,
      volunteer_id: req.user.id
    });
    await app.save();
    res.status(201).json({ success: true, message: "Applied successfully!", data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN GET ALL
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('opportunity_id', 'title')
      .populate('volunteer_id', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, message: `Status set to ${status}`, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
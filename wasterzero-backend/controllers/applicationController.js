const Application = require('../models/Application');
const notificationController = require('./notificationController');

// VOLUNTEER APPLY
exports.apply = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const volunteer_id = req.user.id;

    const existingApp = await Application.findOne({ opportunity_id, volunteer_id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: "You already applied" });
    }

    const app = new Application({
      opportunity_id,
      volunteer_id
    });
    await app.save();
    res.status(201).json({ success: true, message: "Applied successfully!", data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET APPLICATIONS
exports.getApplications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'volunteer') {
      query = { volunteer_id: req.user.id };
    }

    const apps = await Application.find(query)
      .populate('opportunity_id', 'title location')
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
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('opportunity_id');

    if (status === 'accepted') {
      const Opportunity = require('../models/Opportunity');
      await Opportunity.findByIdAndUpdate(app.opportunity_id._id, { status: 'in-progress' });
    }

    // Notify Volunteer
    notificationController.createAndNotify(req.app, {
      userId: app.volunteer_id,
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your application for "${app.opportunity_id.title}" has been ${status}.`,
      type: "application"
    });

    res.json({ success: true, message: `Status set to ${status}`, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
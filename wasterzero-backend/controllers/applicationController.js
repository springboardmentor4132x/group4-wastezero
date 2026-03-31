const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
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

// Volunteer Apply
exports.applyOpportunity = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const volunteer_id = req.user.id;

    // Check opportunity exists and is open
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity || opportunity.isDeleted) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.status !== "open") {
      return res.status(400).json({ message: "Opportunity is not open" });
    }

    // Check duplicate
    const existing = await Application.findOne({ opportunity_id, volunteer_id });
    if (existing) {
      return res.status(400).json({ message: "You already applied" });
    }

    const application = new Application({ opportunity_id, volunteer_id });
    await application.save();

    // Notify admin who created the opportunity
    await createNotification(
      opportunity.ngo_id,
      "new_opportunity",
      "New Application Received",
      `A volunteer applied for "${opportunity.title}"`,
      "/admin/applications"
    );

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin View Applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("volunteer_id", "name email location skills")
      .populate("opportunity_id", "title location status");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Accept / Reject — sends notification to volunteer
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("volunteer_id", "name email")
      .populate("opportunity_id", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Notify volunteer about accept/reject
    const isAccepted = status === "accepted";

    await createNotification(
      application.volunteer_id._id,
      isAccepted ? "application_accepted" : "application_rejected",
      isAccepted ? "Application Accepted! 🎉" : "Application Rejected",
      isAccepted
        ? `Your application for "${application.opportunity_id.title}" was accepted!`
        : `Your application for "${application.opportunity_id.title}" was not selected.`,
      "/opportunities"
    );

    res.json({
      message: "Application status updated",
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Volunteer: Get My Applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      volunteer_id: req.user.id
    }).populate("opportunity_id", "title location status");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Opportunity = require("../models/Opportunity");
const notificationController = require("./notificationController");
const User = require("../models/User");

// CREATE
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, requiredSkills, duration, location } = req.body;
    const opp = new Opportunity({
      title,
      description,
      requiredSkills,
      duration,
      location,
      ngo_id: req.user.id
    });
    await opp.save();

    // Trigger Notifications for matching volunteers
    const matchingVolunteers = await User.find({
      role: 'volunteer',
      $or: [
        { skills: { $in: requiredSkills || [] } },
        { location: { $regex: location, $options: "i" } }
      ]
    }).limit(50); // Industrial safety limit

    matchingVolunteers.forEach(vol => {
      notificationController.createAndNotify(req.app, {
        userId: vol._id,
        title: "New Opportunity Matched",
        message: `A new opportunity "${title}" matches your skills/location.`,
        type: "opportunity"
      });
    });

    res.status(201).json({ success: true, message: "Opportunity created!", data: opp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
exports.getAllOpportunities = async (req, res) => {
  try {
    const opps = await Opportunity.find().populate("ngo_id", "name email");
    res.json({ success: true, data: opps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Updated successfully", data: opp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteOpportunity = async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET RECOMMENDED (MATCHING LOGIC)
exports.getRecommendedOpportunities = async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { skills, location } = user;

    if (!skills?.length && !location) {
        return res.json({ success: true, data: [] });
    }

    // Matching logic:
    // 1. Match by skills (if any skill in opportunity's requiredSkills is in user's skills)
    // 2. Match by location (same location)
    
    // Using $or to get opportunities that match either skills OR location
    const query = {
      isDeleted: false,
      status: "open",
      $or: [
        { requiredSkills: { $in: skills || [] } },
        { location: { $regex: location || ".*", $options: "i" } }
      ]
    };

    const recommended = await Opportunity.find(query).populate("ngo_id", "name email");
    
    res.json({ success: true, data: recommended });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
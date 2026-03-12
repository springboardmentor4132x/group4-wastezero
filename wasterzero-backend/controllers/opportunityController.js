const Opportunity = require("../models/Opportunity");

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
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
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

// CREATE OPPORTUNITY (Admin only)
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, requiredSkills, duration, location } = req.body;

    const opportunity = new Opportunity({
      title,
      description,
      requiredSkills,
      duration,
      location,
      ngo_id: req.user.id
    });

    await opportunity.save();

    // Notify ALL volunteers about new opportunity
    const volunteers = await User.find({ role: "volunteer" }, "_id location skills");

    for (const volunteer of volunteers) {
      // Check if location matches or skills match — notify relevant volunteers
      const locationMatch =
        volunteer.location &&
        location &&
        location.toLowerCase().includes(volunteer.location.toLowerCase());

      const skillsMatch =
        volunteer.skills &&
        volunteer.skills.length > 0 &&
        requiredSkills &&
        requiredSkills.some((skill) =>
          volunteer.skills.some(
            (vs) =>
              vs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(vs.toLowerCase())
          )
        );

      if (locationMatch || skillsMatch) {
        await createNotification(
          volunteer._id,
          "new_opportunity",
          "New Opportunity Matches You! 🌿",
          `A new opportunity "${title}" in ${location} matches your profile.`,
          "/opportunities"
        );
      }
    }

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL OPPORTUNITIES (Volunteer view — open only)
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      status: "open",
      isDeleted: false
    }).populate("ngo_id", "name email location");

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL OPPORTUNITIES (Admin view — includes closed, excludes deleted)
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      isDeleted: false
    }).populate("ngo_id", "name email location");

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE OPPORTUNITY (Admin only)
exports.deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json({
      message: "Opportunity deleted successfully",
      opportunity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE OPPORTUNITY (Admin only)
exports.updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent changing ngo_id
    delete req.body.ngo_id;

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json({
      message: "Opportunity updated successfully",
      opportunity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOLUNTEER: Get Matched Opportunities (based on skills + location)
exports.getMatchedOpportunities = async (req, res) => {
  try {
    const volunteer = await User.findById(req.user.id);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const volunteerSkills = volunteer.skills || [];
    const volunteerLocation = volunteer.location || "";

    const opportunities = await Opportunity.find({
      status: "open",
      isDeleted: false
    }).populate("ngo_id", "name email location");

    // Score each opportunity by relevance
    const scored = opportunities.map((opp) => {
      let score = 0;
      const reasons = [];

      // Location match
      if (
        volunteerLocation &&
        opp.location &&
        opp.location.toLowerCase().includes(volunteerLocation.toLowerCase())
      ) {
        score += 10;
        reasons.push("Location match");
      }

      // Skills match
      if (volunteerSkills.length > 0 && opp.requiredSkills) {
        const matchedSkills = opp.requiredSkills.filter((skill) =>
          volunteerSkills.some(
            (vs) =>
              vs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(vs.toLowerCase())
          )
        );
        score += matchedSkills.length * 5;
        if (matchedSkills.length > 0) {
          reasons.push(`${matchedSkills.length} skill(s) matched`);
        }
      }

      return {
        ...opp.toObject(),
        matchScore: score,
        matchReasons: reasons
      };
    });

    // Sort by score — highest first
    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
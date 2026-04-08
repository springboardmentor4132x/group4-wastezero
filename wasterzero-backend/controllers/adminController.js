const User = require("../models/User");
const Pickup = require("../models/Pickup");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const AdminLog = require("../models/AdminLog");

// Helper to create admin log
const createLog = async (admin_id, action, target_user_id = null, details = "") => {
  try {
    await new AdminLog({ admin_id, action, target_user_id, details }).save();
  } catch (err) {
    console.error("Log error:", err.message);
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUSPEND user
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    await createLog(req.user.id, "SUSPEND_USER", user._id, `Suspended user: ${user.name}`);

    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACTIVATE user
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    await createLog(req.user.id, "ACTIVATE_USER", user._id, `Activated user: ${user.name}`);

    res.json({ message: "User activated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET admin logs
exports.getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("admin_id", "name email")
      .populate("target_user_id", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET full report data
exports.getReports = async (req, res) => {
  try {
    // Users
    const totalUsers      = await User.countDocuments({ role: "user" });
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalAdmins     = await User.countDocuments({ role: "admin" });
    const activeUsers     = await User.countDocuments({ status: { $ne: "suspended" } });
    const suspendedUsers  = await User.countDocuments({ status: "suspended" });

    // Pickups
    const totalPickups     = await Pickup.countDocuments({ isDeleted: false });
    const openPickups      = await Pickup.countDocuments({ status: "Open",      isDeleted: false });
    const acceptedPickups  = await Pickup.countDocuments({ status: "Accepted",  isDeleted: false });
    const completedPickups = await Pickup.countDocuments({ status: "Completed", isDeleted: false });

    // Waste by category
    const wasteByType = await Pickup.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Opportunities
    const totalOpportunities     = await Opportunity.countDocuments({ isDeleted: false });
    const openOpportunities      = await Opportunity.countDocuments({ status: "open",        isDeleted: false });
    const inProgressOpportunities = await Opportunity.countDocuments({ status: "in-progress", isDeleted: false });
    const closedOpportunities    = await Opportunity.countDocuments({ status: "closed",      isDeleted: false });

    // Applications
    const totalApplications    = await Application.countDocuments();
    const pendingApplications  = await Application.countDocuments({ status: "pending" });
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });

    // Top volunteers
    const topVolunteers = await Pickup.aggregate([
      { $match: { status: "Completed", volunteer_id: { $ne: null } } },
      { $group: { _id: "$volunteer_id", completedPickups: { $sum: 1 } } },
      { $sort: { completedPickups: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "volunteer"
        }
      },
      { $unwind: "$volunteer" },
      {
        $project: {
          name: "$volunteer.name",
          email: "$volunteer.email",
          location: "$volunteer.location",
          completedPickups: 1
        }
      }
    ]);

    // Recent pickups
    const recentPickups = await Pickup.find({ isDeleted: false })
      .populate("user_id", "name email")
      .populate("volunteer_id", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      users: {
        total: totalUsers + totalVolunteers + totalAdmins,
        citizens: totalUsers,
        volunteers: totalVolunteers,
        admins: totalAdmins,
        active: activeUsers,
        suspended: suspendedUsers
      },
      pickups: {
        total: totalPickups,
        open: openPickups,
        accepted: acceptedPickups,
        completed: completedPickups
      },
      wasteByType,
      opportunities: {
        total: totalOpportunities,
        open: openOpportunities,
        inProgress: inProgressOpportunities,
        closed: closedOpportunities
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications
      },
      topVolunteers,
      recentPickups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
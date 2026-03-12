const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, getAllUsers, updateUserRole, deleteUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/change-password", authMiddleware, changePassword);

// Management
router.get("/users", authMiddleware, roleMiddleware('admin'), getAllUsers);
router.put("/users/role", authMiddleware, roleMiddleware('admin'), updateUserRole);
router.delete("/users/:userId", authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
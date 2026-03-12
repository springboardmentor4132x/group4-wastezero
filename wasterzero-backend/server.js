require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// =============================
// Connect DB
// =============================
connectDB();

// =============================
// Industrial Middlewares
// =============================
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("🚀 WasteZero Backend v1.0.0 Online"));

// =============================
// Global Industrial Error Handler
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 INTERNAL ERROR:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected system error occurred",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Industrial Server running on port ${PORT}`));
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
const notificationRoutes = require("./routes/notificationRoutes");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// =============================
// Socket.io Logic
// =============================
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("send_message", (data) => {
    // data: { senderId, receiverId, content, createdAt }
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("👋 User disconnected");
  });
});

// =============================
// Connect DB
// =============================
connectDB();

// =============================
// Industrial Middlewares
// =============================
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

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
server.listen(PORT, () => console.log(`🚀 Industrial Server running on port ${PORT}`));
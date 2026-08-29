import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
import locationRoutes from "./Routes/locationRoutes.js";
import sosRoutes from "./Routes/sosRoutes.js";
import pwdRoutes from "./Routes/pwdRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import chatbotRoutes from "./Routes/chatbotRoutes.js";
import lostFoundRoutes from "./Routes/lostFoundRoutes.js";
import missingPersonRoutes from "./Routes/missingPersonRoutes.js";
import serviceRoutes from "./Routes/serviceRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import activityRoutes from "./Routes/activityRoutes.js";
import statsRoutes from "./Routes/statsRoutes.js";

// Seeders
import { seedDefaultUsers } from "./controllers/userController.js";
import { seedLostFound } from "./controllers/lostFoundController.js";
import { seedMissingPersons } from "./controllers/missingPersonController.js";
import { seedWariServices } from "./controllers/serviceController.js";
import { seedFeedback } from "./controllers/feedbackController.js";
import { seedActivities } from "./controllers/activityController.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB & Seed Initial Data
connectDB().then(async () => {
  await seedDefaultUsers();
  await seedLostFound();
  await seedMissingPersons();
  await seedWariServices();
  await seedFeedback();
  await seedActivities();
}).catch((err) => {
  console.error("DB initialization notice:", err.message);
});

// Socket.io for real-time events
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});
app.set("io", io);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Wari Connect Backend is running smoothly",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/pwd-requests", pwdRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/field-services", serviceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/audit-logs", activityRoutes);
app.use("/api/stats", statsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Socket.IO Events
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

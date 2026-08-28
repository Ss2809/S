dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import locationRoutes from "./routes/locationRoutes.js";
import sosRoutes from "./Routes/sosRoutes.js";

const app = express();
const server = http.createServer(app);
connectDB();
// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/locations", locationRoutes);
app.use("/api/sos", sosRoutes);
// Test route


// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
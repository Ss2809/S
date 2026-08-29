import mongoose from "mongoose";
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn("MONGO_URI not configured in .env");
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection notice:", error.message);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

export default connectDB;
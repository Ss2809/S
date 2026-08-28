import mongoose from "mongoose";
import SOS from "../models/SOS.js";
import { emitNotification } from "./notificationController.js";

const SOS_STATUSES = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "ON_THE_WAY",
  "REACHED",
  "RESOLVED",
  "CANCELLED"
];

const isValidCoordinate = value => Number.isFinite(Number(value));

export const createSOS = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userRole,
      emergencyType,
      message,
      latitude,
      longitude
    } = req.body;

    if (
      !userId ||
      !userName ||
      !emergencyType ||
      !isValidCoordinate(latitude) ||
      !isValidCoordinate(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "userId, userName, emergencyType, latitude, and longitude are required"
      });
    }

    const sos = await SOS.create({
      userId,
      userName,
      userRole,
      emergencyType,
      message,
      latitude: Number(latitude),
      longitude: Number(longitude)
    });

    await emitNotification(req, {
      audience: "ALL",
      userId,
      type: "SOS_CREATED",
      title: "New SOS request",
      message: `${userName} raised ${emergencyType}`,
      relatedType: "SOS",
      relatedId: sos._id.toString()
    });
    req.app.get("io")?.emit("sos:created", sos);

    return res.status(201).json({
      success: true,
      data: sos
    });
  } catch (error) {
    console.error("Create SOS error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllSOS = async (req, res) => {
  try {
    const sosRequests = await SOS.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sosRequests.length,
      data: sosRequests
    });
  } catch (error) {
    console.error("Get all SOS error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSOSByUser = async (req, res) => {
  try {
    const sosRequests = await SOS.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sosRequests.length,
      data: sosRequests
    });
  } catch (error) {
    console.error("Get SOS by user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateSOSStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!SOS_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${SOS_STATUSES.join(", ")}`
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SOS id"
      });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found"
      });
    }

    await emitNotification(req, {
      audience: "ALL",
      userId: sos.userId,
      type: "SOS_STATUS_CHANGED",
      title: "SOS status updated",
      message: `${sos.emergencyType} is now ${sos.status}`,
      relatedType: "SOS",
      relatedId: sos._id.toString()
    });
    req.app.get("io")?.emit("sos:status", sos);

    return res.status(200).json({
      success: true,
      data: sos
    });
  } catch (error) {
    console.error("Update SOS status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignVolunteer = async (req, res) => {
  try {
    const { assignedVolunteerId, assignedVolunteerName } = req.body;

    if (!assignedVolunteerId || !assignedVolunteerName) {
      return res.status(400).json({
        success: false,
        message: "assignedVolunteerId and assignedVolunteerName are required"
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SOS id"
      });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      {
        assignedVolunteerId,
        assignedVolunteerName,
        status: "ASSIGNED"
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS request not found"
      });
    }

    await emitNotification(req, {
      audience: "ALL",
      userId: sos.userId,
      type: "SOS_ASSIGNED",
      title: "SOS volunteer assigned",
      message: `${assignedVolunteerName} assigned to ${sos.emergencyType}`,
      relatedType: "SOS",
      relatedId: sos._id.toString()
    });
    req.app.get("io")?.emit("sos:assigned", sos);

    return res.status(200).json({
      success: true,
      data: sos
    });
  } catch (error) {
    console.error("Assign SOS volunteer error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

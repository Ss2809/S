import mongoose from "mongoose";
import PWDRequest from "../models/PWDRequest.js";
import { emitNotification } from "./notificationController.js";

const PWD_STATUSES = ["Pending", "Accepted", "On the Way", "Reached", "Resolved", "Cancelled"];
const PWD_PRIORITIES = ["Low", "Medium", "High", "Normal", "Urgent"];
const isValidCoordinate = value => Number.isFinite(Number(value));

export const createPWDRequest = async (req, res) => {
  try {
    const {
      userId,
      userName,
      assistanceType,
      description,
      priority = "Medium",
      latitude,
      longitude,
      locationLabel = "Live GPS location",
      emergencyContact = ""
    } = req.body;

    if (!userId || !userName || !assistanceType || !isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
      return res.status(400).json({
        success: false,
        message: "userId, userName, assistanceType, latitude, and longitude are required"
      });
    }

    let normalizedPriority = priority;
    if (priority === "Normal") normalizedPriority = "Medium";
    if (priority === "Urgent") normalizedPriority = "High";

    const request = await PWDRequest.create({
      userId,
      userName,
      assistanceType,
      description: description || "",
      priority: normalizedPriority,
      latitude: Number(latitude),
      longitude: Number(longitude),
      locationLabel: locationLabel || "Live GPS location",
      emergencyContact: emergencyContact || ""
    });

    await emitNotification(req, {
      audience: "ALL",
      type: "PWD_CREATED",
      title: "New PWD assistance request",
      message: `${request.userName} requested ${request.assistanceType}`,
      relatedType: "PWD",
      relatedId: request._id.toString()
    });
    req.app.get("io")?.emit("pwd:created", request);

    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Create PWD request error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPWDRequests = async (req, res) => {
  try {
    const { userId, status, assignedVolunteerId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (status && status !== "All Status") filter.status = status;
    if (assignedVolunteerId) filter.assignedVolunteerId = assignedVolunteerId;

    const requests = await PWDRequest.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error("Get PWD requests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPWDRequestById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid PWD request id" });
    }

    const request = await PWDRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "PWD request not found" });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Get PWD request by id error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePWDStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!PWD_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${PWD_STATUSES.join(", ")}`
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid PWD request id" });
    }

    const request = await PWDRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "PWD request not found" });
    }

    await emitNotification(req, {
      audience: "ALL",
      userId: request.userId,
      type: "PWD_STATUS_CHANGED",
      title: "PWD assistance status updated",
      message: `${request.assistanceType} is now ${request.status}`,
      relatedType: "PWD",
      relatedId: request._id.toString()
    });
    req.app.get("io")?.emit("pwd:status", request);

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Update PWD status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const assignPWDVolunteer = async (req, res) => {
  try {
    const { assignedVolunteerId, assignedVolunteerName, status } = req.body;

    if (!assignedVolunteerId || !assignedVolunteerName) {
      return res.status(400).json({
        success: false,
        message: "assignedVolunteerId and assignedVolunteerName are required"
      });
    }

    if (status && !PWD_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${PWD_STATUSES.join(", ")}`
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid PWD request id" });
    }

    const request = await PWDRequest.findByIdAndUpdate(
      req.params.id,
      {
        assignedVolunteerId,
        assignedVolunteerName,
        status: status || "Accepted"
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "PWD request not found" });
    }

    await emitNotification(req, {
      audience: "ALL",
      userId: request.userId,
      type: "PWD_ASSIGNED",
      title: "PWD assistance volunteer assigned",
      message: `${request.assignedVolunteerName} assigned to ${request.assistanceType}`,
      relatedType: "PWD",
      relatedId: request._id.toString()
    });
    req.app.get("io")?.emit("pwd:assigned", request);

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Assign PWD volunteer error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

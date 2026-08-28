import Location from "../models/Location.js";

export const updateLocation = async (req, res) => {
  try {
    const {
      userId,
      name,
      role,
      latitude,
      longitude
    } = req.body;

    // Validation
    if (
      !userId ||
      !name ||
      !role ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required location data is missing"
      });
    }

    // Find user location and update it.
    // If location doesn't exist, create a new one.
    const location = await Location.findOneAndUpdate(
      { userId },
      {
        name,
        role,
        latitude,
        longitude,
        isActive: true
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location
    });

  } catch (error) {
    console.error("Location update error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLocations = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = {
      isActive: true
    };

    if (role) {
      filter.role = role;
    }

    const locations = await Location.find(filter).sort({
      updatedAt: -1
    });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });

  } catch (error) {
    console.error("Get locations error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};  
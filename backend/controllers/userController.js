import User from "../models/User.js";

const DEFAULT_USERS = [
  {
    userId: "ADMIN-001",
    name: "System Administrator",
    email: "admin@smartwariconnect.in",
    phone: "9800000000",
    password: "admin",
    role: "ADMIN",
    district: "Pune",
    status: "Active"
  },
  {
    userId: "SWCV-2026-1042",
    name: "Anita Kulkarni",
    email: "anita.k@smartwariconnect.in",
    phone: "+91 90xxxxx341",
    password: "password123",
    role: "VOLUNTEER",
    district: "Pune",
    assignedArea: "Saswad Sector",
    vanNumber: "AMB-004",
    availability: "Available",
    requestsCompleted: 312,
    rating: 4.8,
    status: "Active"
  },
  {
    userId: "VOL-001",
    name: "Ramesh Kadam",
    email: "ramesh.kadam@smartwariconnect.in",
    phone: "98220 11987",
    password: "password123",
    role: "VOLUNTEER",
    district: "Solapur",
    assignedArea: "Wakhri Halt",
    vanNumber: "AMB-001",
    availability: "On Emergency",
    requestsCompleted: 142,
    rating: 4.9,
    status: "Active"
  },
  {
    userId: "VOL-002",
    name: "Anita Jagtap",
    email: "anita.jagtap@smartwariconnect.in",
    phone: "90112 55621",
    password: "password123",
    role: "VOLUNTEER",
    district: "Satara",
    assignedArea: "Phaltan Medical Camp",
    vanNumber: "AMB-003",
    availability: "On Emergency",
    requestsCompleted: 98,
    rating: 4.7,
    status: "Active"
  },
  {
    userId: "VOL-003",
    name: "Vikram Salunkhe",
    email: "vikram.s@smartwariconnect.in",
    phone: "99001 34521",
    password: "password123",
    role: "VOLUNTEER",
    district: "Pune",
    assignedArea: "Alandi Start Point",
    vanNumber: "AMB-002",
    availability: "Off Duty",
    requestsCompleted: 210,
    rating: 4.6,
    status: "Disabled"
  },
  {
    userId: "VOL-004",
    name: "Pooja Deshmukh",
    email: "pooja.d@smartwariconnect.in",
    phone: "96552 87012",
    password: "password123",
    role: "VOLUNTEER",
    district: "Solapur",
    assignedArea: "Pandharpur Darshan Queue",
    vanNumber: "AMB-004",
    availability: "Available",
    requestsCompleted: 176,
    rating: 4.8,
    status: "Active"
  },
  {
    userId: "SWC-2026-08412",
    name: "Sunil Bhosale",
    email: "sunil.bhosale@wari.in",
    phone: "+91 98xxxxx210",
    password: "password123",
    role: "WARKARI",
    district: "Pune",
    bloodGroup: "B+",
    dindiName: "Sant Tukaram Dindi",
    digitalId: "Issued",
    emergencyContactName: "Rekha Bhosale",
    emergencyContactPhone: "+91 9876543210",
    status: "Active"
  },
  {
    userId: "VKW-88210",
    name: "Sunita Pawar",
    email: "sunita.p@wari.in",
    phone: "98230 11234",
    password: "password123",
    role: "WARKARI",
    district: "Pune",
    bloodGroup: "B+",
    dindiName: "Dnyaneshwar Maharaj Palkhi",
    digitalId: "Issued",
    status: "Active"
  },
  {
    userId: "VKW-77104",
    name: "Dattatray Shinde",
    email: "dattatray.s@wari.in",
    phone: "90210 44567",
    password: "password123",
    role: "WARKARI",
    district: "Solapur",
    bloodGroup: "O+",
    dindiName: "Tukaram Maharaj Palkhi",
    digitalId: "Pending",
    status: "Active"
  },
  {
    userId: "VKW-65590",
    name: "Baban Kale",
    email: "baban.k@wari.in",
    phone: "88880 23145",
    password: "password123",
    role: "WARKARI",
    district: "Satara",
    bloodGroup: "A-",
    dindiName: "Dnyaneshwar Maharaj Palkhi",
    digitalId: "Issued",
    status: "Blocked"
  },
  {
    userId: "VKW-51287",
    name: "Ashatai More",
    email: "ashatai.m@wari.in",
    phone: "99870 78123",
    password: "password123",
    role: "WARKARI",
    district: "Pune",
    bloodGroup: "AB+",
    dindiName: "Sant Nivas Palkhi",
    digitalId: "Issued",
    status: "Active"
  },
  {
    userId: "VKW-40033",
    name: "Ganesh Jadhav",
    email: "ganesh.j@wari.in",
    phone: "97663 33221",
    password: "password123",
    role: "WARKARI",
    district: "Solapur",
    bloodGroup: "B-",
    dindiName: "Tukaram Maharaj Palkhi",
    digitalId: "Pending",
    status: "Active"
  }
];

export const seedDefaultUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Seeding default users into MongoDB...");
      await User.insertMany(DEFAULT_USERS);
      console.log(`Seeded ${DEFAULT_USERS.length} default users.`);
    }
  } catch (error) {
    console.error("Error seeding default users:", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required"
      });
    }

    const query = {};
    if (email) query.email = email.trim().toLowerCase();
    else if (phone) query.phone = phone.trim();

    let user = await User.findOne(query);

    // If admin default login attempt when db had no specific password or for demo flexibility
    if (!user && email && email.toLowerCase() === "admin@smartwariconnect.in") {
      user = await User.create({
        userId: "ADMIN-001",
        name: "Admin User",
        email: "admin@smartwariconnect.in",
        phone: "9800000000",
        password: password || "admin",
        role: "ADMIN",
        status: "Active"
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with provided credentials"
      });
    }

    if (password && user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = "WARKARI",
      district = "Pune",
      bloodGroup = "O+",
      dindiName,
      emergencyContactName,
      emergencyContactPhone,
      assignedArea,
      vanNumber
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const prefix = role === "ADMIN" ? "ADM" : role === "VOLUNTEER" ? "VOL" : "VKW";
    const generatedId = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const user = await User.create({
      userId: req.body.userId || generatedId,
      name,
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined,
      password: password || "123456",
      role,
      district,
      bloodGroup,
      dindiName: dindiName || "Sant Tukaram Dindi",
      emergencyContactName: emergencyContactName || "",
      emergencyContactPhone: emergencyContactPhone || "",
      assignedArea: assignedArea || "",
      vanNumber: vanNumber || "—",
      status: "Active"
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role, district, status, search } = req.query;
    const filter = {};

    if (role) filter.role = role.toUpperCase();
    if (district && district !== "All Districts") filter.district = new RegExp(district, "i");
    if (status && status !== "All Status") filter.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { district: searchRegex },
        { userId: searchRegex },
        { assignedArea: searchRegex }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    let query = { userId: id };
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      query = { $or: [{ _id: id }, { userId: id }] };
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { userId: req.params.id }] },
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      $or: [{ _id: req.params.id }, { userId: req.params.id }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

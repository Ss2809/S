export const authenticateUser = (req, res, next) => {
  const role = req.headers["x-user-role"] || req.headers["role"] || "WARKARI";
  const userId = req.headers["x-user-id"] || req.headers["userid"] || null;

  req.user = {
    userId,
    role: String(role).toUpperCase()
  };

  next();
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || req.headers["x-user-role"] || "WARKARI";
    const normalizedRole = String(role).toUpperCase();

    if (!allowedRoles.includes(normalizedRole) && normalizedRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${allowedRoles.join(", ")} roles`
      });
    }

    next();
  };
};

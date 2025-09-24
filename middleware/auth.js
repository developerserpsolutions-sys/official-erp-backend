import jwt from "jsonwebtoken";
import SuperAdmin from "../models/SuperAdmin.js";

// -------------------------
// AUTH MIDDLEWARE
// -------------------------
export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from DB (ensures fresh role/status check)
      req.user = await SuperAdmin.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found or no longer exists",
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is deactivated",
        });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed, please try again",
    });
  }
};

// -------------------------
// ROLE GUARDS
// -------------------------
export const isSuperAdmin = (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "superadmin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for SuperAdmins only",
      });
    }

    // Optional: also enforce static SUPERADMIN_ID from .env for extra protection
    if (process.env.SUPERADMIN_ID && req.user._id.toString() !== process.env.SUPERADMIN_ID) {
      return res.status(401).json({
        success: false,
        message: "Not authorized as configured SuperAdmin",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

export const isUser = (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "user") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Users only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

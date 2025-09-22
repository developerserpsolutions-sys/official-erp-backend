import SuperAdmin from "../models/SuperAdmin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer"; // For sending emails

// ----------------------------
// Helper: Create JWT Token
// ----------------------------
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


//CREATE SUPERADMIN

export const createSuperAdmin = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check if email already exists
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "SuperAdmin with this email already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    // Create SuperAdmin
    const newAdmin = await SuperAdmin.create({
      username,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: "superadmin",
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "SuperAdmin created successfully",
      superAdmin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while creating SuperAdmin",
      error: error.message,
    });
  }
};
// ----------------------------
// LOGIN CONTROLLER
// ----------------------------
export const superAdminLogin = async (req, res) => {
  try {
    const { email, password, superAdminPassKey } = req.body;
   
    if (!email || !password || !superAdminPassKey)
      return res.status(400).json({ message: "Email, passkey, password required" });

    let admin = null;
    // Explicitly select password
    if(superAdminPassKey === process.env.SUPER_ADMIN_PASS_KEY){
       admin = await SuperAdmin.findOne({ email }).select("+password");
    }
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!admin.isActive)
      return res.status(403).json({ message: "Account is deactivated" });

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ----------------------------
// FORGOT PASSWORD
// ----------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await SuperAdmin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "No SuperAdmin with this email" });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save({ validateBeforeSave: false });

    // Email setup (use real SMTP in production)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Click the link below to reset:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await transporter.sendMail({
      to: admin.email,
      subject: "SuperAdmin Password Reset",
      html: message,
    });

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ----------------------------
// RESET PASSWORD
// ----------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await SuperAdmin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const salt = await bcrypt.genSalt(12);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ----------------------------
// CHANGE PASSWORD (while logged in)
// ----------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await SuperAdmin.findById(req.user.id).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(12);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

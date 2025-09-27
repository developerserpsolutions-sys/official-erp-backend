import SuperAdmin from "../models/SuperAdmin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer"; // For sending emails




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
      role: "SuperAdmin",
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

    let superadmin = null;

    if(superAdminPassKey === process.env.SUPER_ADMIN_PASS_KEY){
       superadmin = await SuperAdmin.findOne({ email }).select("+password");
    }
    if (!superadmin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!superadmin.isActive)
      return res.status(403).json({ message: "Account is deactivated" });

 
			const token = jwt.sign(
				{ email: superadmin.email, id: superadmin._id, role: superadmin.role },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

      
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				superadmin,
				message: `Super Admin Login Successfully`,
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
    const superadmin = await SuperAdmin.findOne({ email });

    if (!superadmin) {
      return res.status(404).json({ message: "No SuperAdmin with this email" });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    superadmin.resetPasswordToken = hashedToken;
    superadmin.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await superadmin.save({ validateBeforeSave: false });

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
      to: superadmin.email,
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

    const superadmin = await SuperAdmin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!superadmin) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const salt = await bcrypt.genSalt(12);
    superadmin.password = await bcrypt.hash(newPassword, salt);
    superadmin.resetPasswordToken = undefined;
    superadmin.resetPasswordExpire = undefined;

    await superadmin.save();

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

    const superadmin = await SuperAdmin.findById(req.user.id).select("+password");
    if (!superadmin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await superadmin.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(12);
    superadmin.password = await bcrypt.hash(newPassword, salt);

    await superadmin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

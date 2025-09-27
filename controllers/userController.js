import bcrypt from "bcrypt";
// import OTP from "../models/OTP";
import jwt from "jsonwebtoken";
// import otpGenerator from "otp-generator";
import mailSender from "../utils/mailSender.js";
// import { passwordUpdated } from "../mail/template/passwordUpdateTemplate.js";
import User from "../models/User.js";
import License from "../models/License.js";
import { isSuperAdmin, isAdmin } from "../utils/userRoleValidation.js";



// User Signup
export const signup = async (req, res) => {
  try {
    const {
      companyCode,
      entity,
      username,
      name,
      mobileNo,
      email,
      department,
      password,
      profileImage,
      userGeoData,
    } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // 2. Validate license/companyCode
    const license = await License.findOne({ companyCode });
    if (!license) {
      return res.status(400).json({ success: false, message: "Invalid company code" });
    }
    const clientID = license.clientID;

    // 3. Validate required fields (based on schema)
    if (!companyCode || !username || !entity || !name || !mobileNo || !email || !password || !department) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Determine role
    let role = "Operator";
    if (isSuperAdmin(req)) {
      role = "Admin";
    }

    // 6. Profile image
    let finalProfileImageBase64 = "";
    if (profileImage) {
      finalProfileImageBase64 = profileImage;
    } else {
      const dicebearUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;
      const response = await fetch(dicebearUrl);
      const buffer = await response.arrayBuffer();
      finalProfileImageBase64 = `data:image/svg+xml;base64,${Buffer.from(buffer).toString("base64")}`;
    }

    // 7. Geo-location defaults
    const geoData = {
      countryCode: userGeoData?.countryCode || "",
      country: userGeoData?.country || "",
      state: userGeoData?.state || "",
      city: userGeoData?.city || "",
      pincode: userGeoData?.pincode || "",
    };

    // 8. Create new user
    const newUser = new User({
      clientID,
      entity,
      companyCode,
      username,
      name,
      mobileNo,
      email,
      department,
      password: hashedPassword,
      role,
      profileImage: finalProfileImageBase64,
      userGeoData: geoData,
    });

    await newUser.save();

    // 9. Return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        clientID: newUser.clientID,
        companyCode: newUser.companyCode,
        entity: newUser.entity,
        userGeoData: newUser.userGeoData, // include geo-data in response
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { companyCode, entity, identifier, password } = req.body;

    // 1. Check required fields
    if (!companyCode || !entity || !identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "companyCode, entity, identifier and password are required"
      });
    }

    // 2. Find user within company + entity by email / username / mobileNo
    const user = await User.findOne({
      companyCode,
      entity,
      $or: [
        { email: identifier },
        { username: identifier },
        { mobileNo: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in this company/entity"
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, companyCode: user.companyCode, entity: user.entity },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1d" }
    );

    // 5. Respond with user data
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
        companyCode: user.companyCode,
        entity: user.entity,
        department: user.department
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
// 	try {
// 		const { email } = req.body;

// 		// Check if user is already present
// 		// Find user with provided email
// 		const checkUserPresent = await User.findOne({ email });
// 		// to be used in case of signup

// 		// If user found with provided email
// 		if (checkUserPresent) {
// 			// Return 401 Unauthorized status code with error message
// 			return res.status(401).json({
// 				success: false,
// 				message: `User is Already Registered`,
// 			});
// 		}

// 		var otp = otpGenerator.generate(6, {
// 			upperCaseAlphabets: false,
// 			lowerCaseAlphabets: false,
// 			specialChars: false,
// 		});
// 		const result = await OTP.findOne({ otp: otp });
// 		console.log("Result is Generate OTP Func");
// 		console.log("OTP", otp);
// 		console.log("Result", result);
// 		while (result) {
// 			otp = otpGenerator.generate(6, {
// 				upperCaseAlphabets: false,
// 			});
// 		}
// 		const otpPayload = { email, otp };
// 		const otpBody = await OTP.create(otpPayload);
// 		console.log("OTP Body", otpBody);
// 		res.status(200).json({
// 			success: true,
// 			message: `OTP Sent Successfully`,
// 			otp,
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		return res.status(500).json({ success: false, error: error.message });
// 	}
// };


// Controller for Changing Password
// exports.changePassword = async (req, res) => {
// 	try {
// 		// Get user data from req.user
// 		const userDetails = await User.findById(req.user.id);

// 		// Get old password, new password, and confirm new password from req.body
// 		const { oldPassword, newPassword, confirmNewPassword } = req.body;

// 		// Validate old password
// 		const isPasswordMatch = await bcrypt.compare(
// 			oldPassword,
// 			userDetails.password
// 		);
// 		if (!isPasswordMatch) {
// 			// If old password does not match, return a 401 (Unauthorized) error
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "The password is incorrect" });
// 		}

// 		// Match new password and confirm new password
// 		if (newPassword !== confirmNewPassword) {
// 			// If new password and confirm new password do not match, return a 400 (Bad Request) error
// 			return res.status(400).json({
// 				success: false,
// 				message: "The password and confirm password does not match",
// 			});
// 		}

// 		// Update password
// 		const encryptedPassword = await bcrypt.hash(newPassword, 10);
// 		const updatedUserDetails = await User.findByIdAndUpdate(
// 			req.user.id,
// 			{ password: encryptedPassword },
// 			{ new: true }
// 		);

// 		// Send notification email
// 		try {
// 			const emailResponse = await mailSender(
// 				updatedUserDetails.email,
// 				passwordUpdated(
// 					updatedUserDetails.email,
// 					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
// 				)
// 			);
// 			console.log("Email sent successfully:", emailResponse.response);
// 		} catch (error) {
// 			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
// 			console.error("Error occurred while sending email:", error);
// 			return res.status(500).json({
// 				success: false,
// 				message: "Error occurred while sending email",
// 				error: error.message,
// 			});
// 		}

// 		// Return success response
// 		return res
// 			.status(200)
// 			.json({ success: true, message: "Password updated successfully" });
// 	} catch (error) {
// 		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
// 		console.error("Error occurred while updating password:", error);
// 		return res.status(500).json({
// 			success: false,
// 			message: "Error occurred while updating password",
// 			error: error.message,
// 		});
// 	}
// };
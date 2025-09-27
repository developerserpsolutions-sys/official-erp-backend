// models/SuperAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SuperAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required"],
      minlength: 8, // security best practice
    },
    role: {
      type: String,
      enum: ["SuperAdmin"],
      default: "SuperAdmin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdmin", SuperAdminSchema);

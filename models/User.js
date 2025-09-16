import mongoose from "mongoose";
import { trim } from "validator";

const UserSchema = new mongoose.Schema({
  clientID: {
    type: String,
  },
  companyCode: {
    type: String,
  },
  entity: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  userGeoData: {
    countryCode: { type: String, default: null},
    country: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: Number, default: null },
  },
  mobileNo: { type: String, required: true},
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  department: {
    enum: ["HR", "Finance", "IT", "Sales", "Marketing", "Operations", "Support"],
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

export default mongoose.model("User", UserSchema);

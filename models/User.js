import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      countryCode: { type: String, default: null },
      country: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: Number, default: null },
    },
    mobileNo: { type: String, required: true },
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
      type: String,
      enum: [
        "Accounts",
        "Controlling",
        "Sales & Distribution",
        "Materials Management",
        "Production Planning",
        "Warehouse Management",
        "Plant Maintenance",
        "Quality Management",
        "Human Resources",
        "Project System",
        "Customer Service",
        "Supply Chain Management",
        "Product Lifecycle Management",
        "Governance Risk Compliance",
        "Research & Development",
        "Administration",
        "IT",
        "Marketing",
        "Procurement RM",
        "Logistics Execution",
        "Hospitality",
        "Security",
        "Weighment",
        "Stores",
        "Front Office",
        "Dispatch",
        "Lab",
        "Mechanical",
        "Electrical",
        "Automobile",
      ],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Operator", "Executive"],
      default: "Operator",
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
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", UserSchema);
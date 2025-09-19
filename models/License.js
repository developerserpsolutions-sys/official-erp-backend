import mongoose from "mongoose";

const LicenseSchema = new mongoose.Schema({
  licenseID: {
    type: String,
    required: true,
    unique: true,
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clientID: {
    type: String,
    unique: true,
    required: true,
  },
  subscriptionType: {
    type: String,
    enum: ["trial", "enterprise"],
    default: "trial",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: function () {
        if(this.subscriptionType === "trial") {
            return new Date(this.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
        return new Date(this.startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    },
  },
  status: {
    type: String,
    enum: ["active", "expired", "revoked"],
    default: "active",
  },
 modules: [
  {
    moduleId: { type: String, required: true },
    moduleName: { type: String, required: true },
    subModules: [
      {
        subModuleId: { type: String, required: true },
        subModuleName: { type: String, required: true },
      }
    ]
  }
],
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  businessType: {
    type: String,
    trim: true,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    enum: ["Owner", "Director", "Manager", "Executive"],
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  emailId: { type: String, required: true, trim: true, lowercase: true },
  gstinRegistration: { type: Boolean, required: true },
  gstin: { type: String, required: true },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  entity: [
    {
      type: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("License", LicenseSchema);

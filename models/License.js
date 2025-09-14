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
  features: [
    {
      module: { type: String, required: true },
      submodules: [
        {
          name: { type: String, required: true },
          selected: { type: Boolean, default: false }
        }
      ]
    }
  ],
  companyName: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  businessType: {
    type: String,
    enum: [
      "Manufacturing",
      "Retail",
      "Service",
      "Wholesale",
      "Construction",
      "Agriculture",
      "Finance",
      "Transportation",
      "Healthcare",
      "Education",
      "Hospitality",
      "Other"
    ],
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
  },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  mobile: { type: String, required: true },
  emailId: { type: String, required: true },
  gstinRegistration: { type: String, required: true },
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

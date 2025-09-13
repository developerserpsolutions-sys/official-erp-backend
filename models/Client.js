import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    clientID: {
        type: String,
        required: true,
        unique: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    licensedTo: {
        type: String,
        required: true,
    },
    businessType: {
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
    clientCode: {
        type: String,
        required: true,
        unique: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    gstinRegistration: {
        type: String,
        required: true,
    },
    gstin: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userType: {
        type: String,
        enum: ["admin", "user", "superadmin"],
        default: "user",
    },
    otp: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        enum: [
            "Owner",
            "Director",
            "Manager",
            "Executive",
        ],
        required: true,
    },

}, { timestamps: true });

export default mongoose.model("Client", ClientSchema);
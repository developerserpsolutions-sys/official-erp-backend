import mongoose from "mongoose";

const LicenseSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    licenseKey: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
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
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "expired", "revoked"],
        default: "active",
    },
    features: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

export default mongoose.model("License", LicenseSchema);
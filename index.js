import express from "express";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import startLicenseExpiryJob from "./jobs/licenseExpiryJob.js";
import cron from "node-cron";
import cors from "cors";
import cookieParser from "cookie-parser";
import licenseRoutes from "./routes/licenseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dropDownDataRoutes from "./routes/dropDownDataRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import License from "./models/License.js";

const app = express();

connectDB();
connectCloudinary();
startLicenseExpiryJob();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.0.103:3000",
    "http://192.168.29.198:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// v1 routes
app.use("/api/v1/license", licenseRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/get-dropdown-data", dropDownDataRoutes);
app.use("/api/v1/super-admin", superAdminRoutes);

app.get("/", (req, res) => {
  res.send("ERP Server Live!");
});

// Cron-job for licenses (now works because License is imported)
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await License.updateMany(
    { endDate: { $lt: now }, status: { $ne: "revoked" } },
    { $set: { status: "expired" } }
  );
  console.log("✅ Expired licenses updated");
});

const port = process.env.PORT || 7000;

export default app;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

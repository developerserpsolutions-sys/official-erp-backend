import express from "express";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import startLicenseExpiryJob from "./jobs/licenseExpiryJob.js";
import cron from "node-cron";
const app = express();

connectDB();
connectCloudinary();
startLicenseExpiryJob();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
import licenseRoutes from "./routes/licenseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dropDownDataRoutes from "./routes/dropDownDataRoutes.js";

//v1
app.use("/api/v1/license", licenseRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/get-dropdown-data", dropDownDataRoutes);



app.get("/", (req, res) => {
  res.send("ERP Server Live!");
});


//Cron-job for licenses
cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    await License.updateMany(
      { endDate: { $lt: now }, status: { $ne: "revoked" } },
      { $set: { status: "expired" } }
    );
    console.log("✅ Expired licenses updated");
  });


const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
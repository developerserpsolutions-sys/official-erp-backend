import cron from "node-cron";
import License from "../models/License.js"

function startLicenseExpiryJob() {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    await License.updateMany(
      { endDate: { $lt: now }, status: { $ne: "revoked" } },
      { $set: { status: "expired" } }
    );
    console.log("✅ Expired licenses updated");
  });

  console.log("⏰ License expiry cron job scheduled");
}


export default startLicenseExpiryJob;   
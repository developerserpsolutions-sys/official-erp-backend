import express from "express";
import { createLicense, updateLicense } from "../controllers/licenseController.js";
// import { auth, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-license", createLicense);
router.put("/update-license/:licenseId", updateLicense);

export default router;
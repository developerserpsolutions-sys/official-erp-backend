import express from "express";
import { createLicense, updateLicense, getCompanyByCode } from "../controllers/licenseController.js";
// import { auth, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-license", createLicense);
router.put("/update-license/:licenseID", updateLicense);
router.get("/get-company/:companyCode", getCompanyByCode);

export default router;
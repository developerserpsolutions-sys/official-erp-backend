import express from "express";
import { createSuperAdmin,superAdminLogin,forgotPassword,resetPassword,changePassword} from "../controllers/superAdminControllers.js";
import {auth, isSuperAdmin } from "../middleware/auth.js"


const router = express.Router();

router.post("/super-admin-login", superAdminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", isSuperAdmin, changePassword);
router.post("/create-superadmin", createSuperAdmin);

export default router;
import express from "express";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

router.post("/create-user", signup);
router.post("/login", login);

export default router;

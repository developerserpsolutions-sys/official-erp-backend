import express from "express";
import { getDropDownData } from "../controllers/getDropDownData.js";

const router = express.Router();

router.get("/:businessObject", getDropDownData);

export default router;
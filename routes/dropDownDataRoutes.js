import express from "express";
import { getDropDownData } from "../controllers/getDropdownData.js";

const router = express.Router();

router.get("/:businessObject", getDropDownData);

export default router;
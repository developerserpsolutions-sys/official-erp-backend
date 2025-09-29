import express from "express";
import { getDropDownData, getSideBarMenuItems} from "../controllers/erpController.js";

const router = express.Router();

router.get("/get-dropdown-data/:businessObject", getDropDownData);
router.get("/sidebar-menu-items", getSideBarMenuItems);

export default router;
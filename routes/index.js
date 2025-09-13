import express from "express";
const router = express.Router();


router.get("/", console.log("Hello from the index route!"));
export default router;
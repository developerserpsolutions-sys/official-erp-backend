import express from "express";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
const app = express();


connectDB();
connectCloudinary();

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
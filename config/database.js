import mongoose from "mongoose";
import "dotenv/config"


const connectDB = async() => {
    await mongoose.connect(`${process.env.DBURL}`)
}

export default connectDB
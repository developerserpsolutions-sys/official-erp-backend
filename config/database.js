import mongoose from "mongoose";
import "dotenv/config";

let superAdminDB;
let clientDB;

const connectDB = async () => {
  try {
    superAdminDB = mongoose.createConnection(process.env.SUPERADMIN_DB_URL, {});
    await superAdminDB.asPromise();
    console.log("SuperAdmin DB connected");


    clientDB = mongoose.createConnection(process.env.CLIENT_DB_URL, {});
    await clientDB.asPromise();
    console.log("Client DB connected");

    return { superAdminDB, clientDB };
  } catch (err) {
    console.error("Error connecting to databases:", err);
    throw err;
  }
};

export default connectDB;
export { superAdminDB, clientDB };

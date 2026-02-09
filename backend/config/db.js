import mongoose from "mongoose";
import 'dotenv/config';


export const connectDB = async () => {
  // Use the environment variable if available, otherwise use a local string for testing
  const url = process.env.MONGODB_URL;

  try {
    await mongoose.connect(url);
    console.log("DB_CONNECTED");
  } catch (error) {
    console.error("DB_CONNECTION_ERROR:", error.message);
    process.exit(1); // Stop the server if the DB doesn't connect
  }
};
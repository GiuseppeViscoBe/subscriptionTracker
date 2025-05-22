
import mongoose from "mongoose";
import { ENV } from "../config/env";

if (!ENV.DB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const connectionString = ENV.DB_URI;

const connectToDb = async () => {
  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    console.error("Error connecting to database: ", error);

    process.exit(1);
  }
};

export default connectToDb;

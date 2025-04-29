import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI not set in .env");

export default async function connectDB() {
  await mongoose.connect(uri, {});
  console.log("MongoDB connected");
}

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { runSeed } from "../utils/seed.js";

connectDB()
  .then(() => runSeed())
  .then(() => mongoose.disconnect())
  .then(() => {
    console.log("Database reset complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Reset failed:", err.message);
    process.exit(1);
  });

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "organizer"],
      required: true,
    },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);

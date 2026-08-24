import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    regId: { type: String, required: true, unique: true },
    eventId: { type: Number, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Registered", "Checked-in"],
      default: "Registered",
    },
    registeredAt: { type: Date, default: Date.now },
    checkedInAt: { type: Date, default: null },
  },
  { versionKey: false }
);

registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    category: { type: String, default: "Other" },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    endTime: { type: String, default: "" },
    venue: { type: String, default: "" },
    department: { type: String, default: "" },
    image: { type: String, default: "" },
    registered: { type: Number, default: 0 },
    capacity: { type: Number, default: 0 },
    attended: { type: Number, default: 0 },
    registrationDeadline: { type: String, default: null },
    status: {
      type: String,
      enum: ["Upcoming", "Draft", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    tags: { type: [String], default: [] },
    createdAt: { type: String },
    organizerId: { type: String, default: "" },
  },
  { versionKey: false }
);

export default mongoose.model("Event", eventSchema);

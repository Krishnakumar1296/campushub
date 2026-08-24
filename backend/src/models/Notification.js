import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, default: null, index: true },
    type: { type: String, default: "info" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

notificationSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.model("Notification", notificationSchema);

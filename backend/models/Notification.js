const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["task_request_sent", "task_request_received", "general"],
      default: "general"
    },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);


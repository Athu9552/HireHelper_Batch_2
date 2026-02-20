const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    type: {
      type: String,
      enum: ["requester_to_owner", "owner_to_requester"],
      required: true
    }
  },
  { timestamps: true }
);

reviewSchema.index(
  { reviewer: 1, reviewee: 1, task: 1, type: 1 },
  { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);


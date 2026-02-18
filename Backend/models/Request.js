const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const requestSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  task_id: String,
  sender_id: String,
  receiver_id: String,
  status: {
    type: String,
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);

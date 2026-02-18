const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  title: String,
  description: String,
  category: String,
  created_by: String,   // user id
  status: {
    type: String,
    default: "open"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);

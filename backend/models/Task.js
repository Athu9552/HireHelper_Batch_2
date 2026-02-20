const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  mapsLink: { type: String },
  startDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endDate: { type: Date },
  endTime: { type: String },
  category: { type: String, required: true },
  status: { type: String, default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Number },
  image: { type: String } // Path to uploaded file
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

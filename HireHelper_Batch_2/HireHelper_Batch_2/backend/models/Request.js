const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  msg: { type: String },
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

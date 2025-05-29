const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: String,
  patientEmail: String,
  doctorId: Number,
  scheduleId: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);

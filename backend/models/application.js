const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  assistantship: { type: mongoose.Schema.Types.ObjectId, ref: 'Assistantship' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  motivation: String,
  resumePath: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Application', applicationSchema);

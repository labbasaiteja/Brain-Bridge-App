const mongoose = require('mongoose');

const assistantshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  domain: String, // NEW: e.g., "Computer Vision", "Databases"
  endTime: Date,  // NEW: e.g., deadline to apply
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assistantship', assistantshipSchema);

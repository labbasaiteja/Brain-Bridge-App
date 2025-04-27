const mongoose = require('mongoose');

const assistantshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assistantship', assistantshipSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['To Do', 'Doing', 'Done'], default: 'Done' },
});

module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String, required: true },
});
const assignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = assignmentModel

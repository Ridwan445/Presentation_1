const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  createdBy: { type: String },
  subject: { type: String, required: true },
  dateOfSubmission: { type: String, required: true },
});

const submitAssignmentSchema = new mongoose.Schema({
  submittedBy: {type: String},
  assignmentId: {type: String},
  answer: {type: Boolean, default: false},
  graded: {type: Boolean, default: false},
  passed:{type: Boolean, default: false}
})

const submit = mongoose.model("submit", submitAssignmentSchema)
 
const assignmentModel = mongoose.model('Assignment', assignmentSchema);

module.exports = assignmentModel
module.exports = submit

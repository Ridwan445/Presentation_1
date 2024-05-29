const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
 submittedBy: {type: String, required: true},
 graded: {type: Boolean, default: false},
 passed: {type: Boolean, default: false},
 content: {type: String, required: true},
  submittedAt: { type: Date, default: Date.now },
});
const submissionModel = mongoose.model('Submission', submissionSchema);

module.exports = submissionModel

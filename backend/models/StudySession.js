const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  focus: {
    type: Number,
    min: [1, 'Focus rating must be at least 1'],
    max: [5, 'Focus rating cannot exceed 5'],
    default: 5
  }
}, {
  timestamps: true
});

studySessionSchema.index({ user: 1, date: -1 });
studySessionSchema.index({ user: 1, subject: 1 });

const StudySession = mongoose.model('StudySession', studySessionSchema);

module.exports = StudySession;
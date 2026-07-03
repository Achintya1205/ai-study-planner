const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
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
    default: null
  },
  name: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
    maxlength: [150, 'Test name cannot exceed 150 characters']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  maxScore: {
    type: Number,
    required: [true, 'Max score is required'],
    min: [1, 'Max score must be at least 1']
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
testSchema.pre('save', function(next) {
  if (this.score !== undefined && this.maxScore !== undefined && this.maxScore > 0) {
    this.percentage = Math.round((this.score / this.maxScore) * 100);
  }
  next();
});

testSchema.index({ user: 1, date: -1 });
testSchema.index({ user: 1, subject: 1 });
testSchema.index({ user: 1, topic: 1 });

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
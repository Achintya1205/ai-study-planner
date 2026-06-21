const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topics: [{
    name: { type: String, required: true },
    score: { type: Number, default: 0 },
    weight: { 
      type: Number, 
      enum: [1, 2, 3], 
      default: 2 
    }
  }],
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [100, 'Subject name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: 'emerald',
    enum: ['emerald', 'purple', 'cyan', 'orange', 'indigo', 'pink']
  },
  targetScore: {
    type: Number,
    default: 80,
    min: [0, 'Target score cannot be negative'],
    max: [100, 'Target score cannot exceed 100']
  },
  currentScore: {
    type: Number,
    default: 0,
    min: [0, 'Current score cannot be negative'],
    max: [100, 'Current score cannot exceed 100']
  }
}, {
  timestamps: true
});

subjectSchema.index({ user: 1, name: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
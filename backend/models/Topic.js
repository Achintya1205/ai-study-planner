const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true,
    maxlength: [150, 'Topic name cannot exceed 150 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  isWeak: {
    type: Boolean,
    default: false
  },
  lastStudied: {
    type: Date
  }
}, {
  timestamps: true
});

// Automatically mark as weak if score < 60
topicSchema.pre('save', function(next) {
  this.isWeak = this.score < 60;
  next();
});

// Index for faster queries
topicSchema.index({ user: 1, subject: 1 });
topicSchema.index({ user: 1, isWeak: 1 });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
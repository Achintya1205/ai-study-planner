const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

// Helper function to keep logic consistent
const calculateTopicStats = (score) => {
  let difficulty = 'medium';
  if (score >= 70) difficulty = 'hard';
  else if (score < 50) difficulty = 'easy';
  
  return {
    difficulty,
    isWeak: score < 60
  };
};

// @route   GET /api/topics
router.get('/', protect, async (req, res) => {
  try {
    const { subject } = req.query;
    const query = { user: req.user._id };
    if (subject) query.subject = subject;

    const topics = await Topic.find(query)
      .populate('subject', 'name color')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/topics
router.post('/', protect, async (req, res) => {
  try {
    const { subject, name, description, score, lastStudied } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // NEW LOGIC: Calculate difficulty and weakness based on score
    const { difficulty, isWeak } = calculateTopicStats(score || 0);

    const topic = await Topic.create({
      user: req.user._id,
      subject,
      name,
      description,
      difficulty, // Auto-assigned
      score: score || 0,
      isWeak,      // Auto-assigned
      lastStudied
    });

    await topic.populate('subject', 'name color');
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/topics/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    // Extracting score from body; if not provided, keep current score
    const newScore = req.body.score !== undefined ? req.body.score : topic.score;
    
    // NEW LOGIC: Sync difficulty and weakness whenever a topic is updated
    const { difficulty, isWeak } = calculateTopicStats(newScore);

    const updateData = {
      ...req.body,
      difficulty,
      isWeak
    };

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subject', 'name color');

    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/topics/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
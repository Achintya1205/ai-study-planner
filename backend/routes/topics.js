const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');
const Test = require('../models/Test');
const StudySession = require('../models/StudySession');
const updateSubjectProgress = require('../utils/updateSubjectProgress');

const calculateTopicStats = (score) => {
  let difficulty = 'hard'; 
  if (score >= 80) difficulty = 'easy';
  else if (score >= 50) difficulty = 'medium';
  
  return {
    difficulty,
    isWeak: score < 60
  };
};

// GET /api/topics
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

// POST /api/topics
router.post('/', protect, async (req, res) => {
  try {
    const { subject, name, description, score, lastStudied } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const { difficulty, isWeak } = calculateTopicStats(score || 0);

    const topic = await Topic.create({
      user: req.user._id,
      subject,
      name,
      description,
      difficulty,
      score: score || 0,
      initialScore: score || 0,
      scoreSource: 'manual',
      isWeak,
      lastStudied
    });

    // TRIGGER: Sync progress to Subject
    await updateSubjectProgress(subject, req.user._id);

    await topic.populate('subject', 'name color');
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/topics/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const newScore = req.body.score !== undefined ? req.body.score : topic.score;
    const { difficulty, isWeak } = calculateTopicStats(newScore);

    const updateData = { ...req.body, difficulty, isWeak };

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subject', 'name color');
    if (topic.scoreSource !== "tests") {
      topic.trend = 0;
      await topic.save();
    }
    // TRIGGER: Sync progress to Subject
    await updateSubjectProgress(topic.subject, req.user._id);

    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/topics/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.user._id });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });

    const subjectId = topic.subject;
    await Promise.all([
      Test.deleteMany({ topic: req.params.id }),
      StudySession.deleteMany({ topic: req.params.id })
    ]);

    await topic.deleteOne();

    // Sync the subject's score
    await updateSubjectProgress(subjectId, req.user._id);
    // TRIGGER: Sync progress to Subject after deletion
    await updateSubjectProgress(subjectId, req.user._id);

    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
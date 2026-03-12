const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)

// @route   GET /api/topics
// @desc    Get all topics for logged in user (optional subject filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { subject } = req.query;
    
    const query = { user: req.user._id };
    if (subject) {
      query.subject = subject;
    }

    const topics = await Topic.find(query)
      .populate('subject', 'name color')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/topics/weak
// @desc    Get all weak topics for logged in user
// @access  Private
router.get('/weak', protect, async (req, res) => {
  try {
    const topics = await Topic.find({
      user: req.user._id,
      isWeak: true
    })
      .populate('subject', 'name color')
      .sort({ score: 1 }); // Sort by score ascending (weakest first)
    
    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Get weak topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/topics/:id
// @desc    Get single topic
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('subject', 'name color');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/topics
// @desc    Create new topic
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subject, name, description, difficulty, score, lastStudied } = req.body;

    if (!name || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Topic name and subject are required'
      });
    }

    // Verify subject exists and belongs to user
    const subjectExists = await Subject.findOne({
      _id: subject,
      user: req.user._id
    });

    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const topic = await Topic.create({
      user: req.user._id,
      subject,
      name,
      description,
      difficulty,
      score,
      lastStudied
    });

    // Populate subject before sending response
    await topic.populate('subject', 'name color');

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: topic
    });
  } catch (error) {
    console.error('Create topic error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/topics/:id
// @desc    Update topic
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const { name, description, difficulty, score, lastStudied } = req.body;

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, description, difficulty, score, lastStudied },
      { new: true, runValidators: true }
    ).populate('subject', 'name color');

    res.json({
      success: true,
      message: 'Topic updated successfully',
      data: topic
    });
  } catch (error) {
    console.error('Update topic error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/topics/:id
// @desc    Delete topic
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await Topic.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
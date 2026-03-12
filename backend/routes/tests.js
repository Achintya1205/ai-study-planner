const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { protect } = require('../middleware/auth');

// All routes are protected

// @route   GET /api/tests
// @desc    Get all tests for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { subject, topic } = req.query;
    
    const query = { user: req.user._id };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;

    const tests = await Test.find(query)
      .populate('subject', 'name color')
      .populate('topic', 'name')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tests/:id
// @desc    Get single test
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('subject', 'name color')
      .populate('topic', 'name');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tests
// @desc    Create new test
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subject, topic, name, score, maxScore, date, notes } = req.body;

    // Validate required fields
    if (!name || !subject || !topic || score === undefined || !maxScore) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify subject and topic belong to user
    const subjectExists = await Subject.findOne({
      _id: subject,
      user: req.user._id
    });

    const topicExists = await Topic.findOne({
      _id: topic,
      user: req.user._id
    });

    if (!subjectExists || !topicExists) {
      return res.status(404).json({
        success: false,
        message: 'Subject or topic not found'
      });
    }

    const test = await Test.create({
      user: req.user._id,
      subject,
      topic,
      name,
      score,
      maxScore,
      date,
      notes
    });

    await test.populate('subject', 'name color');
    await test.populate('topic', 'name');

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    console.error('Create test error:', error);

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

// @route   PUT /api/tests/:id
// @desc    Update test
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let test = await Test.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    const { name, score, maxScore, date, notes } = req.body;

    test = await Test.findByIdAndUpdate(
      req.params.id,
      { name, score, maxScore, date, notes },
      { new: true, runValidators: true }
    )
      .populate('subject', 'name color')
      .populate('topic', 'name');

    res.json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Update test error:', error);

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

// @route   DELETE /api/tests/:id
// @desc    Delete test
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    await Test.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
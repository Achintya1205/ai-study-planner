const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { protect } = require('../middleware/auth');

// All routes are protected

// @route   GET /api/sessions
// @desc    Get all study sessions for logged in user (optional filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { subject, date } = req.query;
    
    const query = { user: req.user._id };
    if (subject) query.subject = subject;
    if (date) {
      // Get sessions for specific date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const sessions = await StudySession.find(query)
      .populate('subject', 'name color')
      .populate('topic', 'name')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sessions/stats
// @desc    Get study session statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.user._id });
    
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgFocus = sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + s.focus, 0) / sessions.length).toFixed(1)
      : 0;

    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(s => s.date >= today);
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    res.json({
      success: true,
      data: {
        totalSessions,
        totalHours: Math.floor(totalMinutes / 60),
        totalMinutes: totalMinutes % 60,
        averageFocus: parseFloat(avgFocus),
        todaySessions: todaySessions.length,
        todayMinutes
      }
    });
  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('subject', 'name color')
      .populate('topic', 'name');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/sessions
// @desc    Create new study session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subject, topic, duration, date, notes, focus } = req.body;

    // Validate required fields
    if (!subject || !topic || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, topic, and duration'
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

    const session = await StudySession.create({
      user: req.user._id,
      subject,
      topic,
      duration,
      date,
      notes,
      focus
    });

    await session.populate('subject', 'name color');
    await session.populate('topic', 'name');

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Create session error:', error);

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

// @route   PUT /api/sessions/:id
// @desc    Update study session
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const { duration, date, notes, focus } = req.body;

    session = await StudySession.findByIdAndUpdate(
      req.params.id,
      { duration, date, notes, focus },
      { new: true, runValidators: true }
    )
      .populate('subject', 'name color')
      .populate('topic', 'name');

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);

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

// @route   DELETE /api/sessions/:id
// @desc    Delete study session
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await StudySession.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
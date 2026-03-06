const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)

// @route   GET /api/subjects
// @desc    Get all subjects for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, color, targetScore } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    const subject = await Subject.create({
      user: req.user._id,
      name,
      description,
      color,
      targetScore
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Create subject error:', error);

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

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const { name, description, color, targetScore, currentScore } = req.body;

    subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, description, color, targetScore, currentScore },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Update subject error:', error);

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

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
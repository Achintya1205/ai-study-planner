const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// All routes require authentication

const calculateWeightedScore = (topics) => {
  if (!topics || topics.length === 0) return 0;

  let totalWeight = 0;
  let weightedElementsSum = 0;

  topics.forEach(topic => {
    const score = topic.score || 0;
    const weight = topic.weight || 2; // Defaults to medium (2) if missing

    weightedElementsSum += (score * weight);
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round(weightedElementsSum / totalWeight) : 0;
};

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
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, color, targetScore, topics } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }
    const computedScore = calculateWeightedScore(topics);

    const subject = await Subject.create({
      user: req.user._id,
      name,
      description,
      color,
      targetScore,
      topics: topics || [],
      currentScore: computedScore
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Create subject error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a subject with this name'
      });
    }

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

// AI COACH SYSTEM ADDITION

// @route   POST /api/subjects/:id/analyze
// @desc    Generate an AI Study Plan tailored to weak topics and weights
// @access  Private
router.post('/:id/analyze', protect, async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Map out the topic weights cleanly for the prompt context
    const difficultyMap = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    const topicsContext = subject.topics && subject.topics.length > 0
      ? subject.topics.map(t => `- ${t.name}: Score ${t.score}%, Weight/Difficulty: ${difficultyMap[t.weight] || 'Medium'}`).join('\n')
      : 'No specific sub-topics added yet.';

    const aiPrompt = `
      You are an elite academic performance coach and tutor. A student is tracking their progress in the subject "${subject.name}".
      Their current overall weighted proficiency score is ${subject.currentScore || 0}%, and their target goal is ${subject.targetScore || 80}%.
      
      Here are the specific topics they are tracking, along with their scores and concept difficulties:
      ${topicsContext}

      Task: Identify the student's primary bottlenecks (prioritizing low scores on high-weight/hard topics). 
      Generate a practical, highly actionable 3-day emergency recovery study roadmap.
      Format your response using structured, clean Markdown with bullet points, bold key definitions, and actionable milestones so it renders beautifully on an application dashboard.
    `;

    // Request content generation using standard flagship model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: aiPrompt,
    });

    res.json({
      success: true,
      message: 'AI Analysis compiled successfully',
      studyPlan: response.text
    });

  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI analysis' });
  }
});

module.exports = router;
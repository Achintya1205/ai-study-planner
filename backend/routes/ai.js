const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Test = require('../models/Test');
const StudySession = require('../models/StudySession');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// @route   POST /api/ai/study-plan
// @desc    Generate personalized AI study plan using Google Gemini
// @access  Private
router.post('/study-plan', protect, async (req, res) => {
  try {
    const { goal, studyHoursPerDay, targetDate } = req.body;

    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured'
      });
    }

    // Fetch user's data
    const [subjects, topics, tests, sessions] = await Promise.all([
      Subject.find({ user: req.user._id }),
      Topic.find({ user: req.user._id }),
      Test.find({ user: req.user._id }).sort({ date: -1 }).limit(20),
      StudySession.find({ user: req.user._id }).sort({ date: -1 }).limit(20)
    ]);

    // Identify weak topics (score < 60%)
    const weakTopics = topics.filter(t => t.isWeak);
    
    // Calculate average scores per subject
    const subjectPerformance = subjects.map(subject => {
      const subjectTopics = topics.filter(t => 
        t.subject.toString() === subject._id.toString()
      );
      const avgScore = subjectTopics.length > 0
        ? subjectTopics.reduce((sum, t) => sum + (t.score || 0), 0) / subjectTopics.length
        : 0;
      
      return {
        name: subject.name,
        avgScore: Math.round(avgScore),
        topicCount: subjectTopics.length,
        weakTopics: subjectTopics.filter(t => t.isWeak).map(t => t.name)
      };
    });

    // Recent test performance
    const recentTests = tests.slice(0, 5).map(t => ({
      name: t.name,
      score: t.percentage,
      date: t.date
    }));

    // Total study time
    const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgFocus = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.focus, 0) / sessions.length
      : 0;

    // Prepare context for AI
    const userContext = {
      subjects: subjects.map(s => s.name),
      totalTopics: topics.length,
      weakTopics: weakTopics.map(t => ({ name: t.name, score: t.score, difficulty: t.difficulty })),
      subjectPerformance,
      recentTests,
      totalStudyHours: Math.round(totalStudyMinutes / 60),
      averageFocus: avgFocus.toFixed(1),
      goal: goal || 'Improve overall performance',
      studyHoursPerDay: studyHoursPerDay || 3,
      targetDate: targetDate || 'Next 30 days'
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
  const prompt = `You are the 'OmniStudy' Strategy Engine. Your goal is to maximize the ROI (Return on Investment) of a student's study time by identifying efficiency gaps.

- Subjects & Topics: ${userContext.subjects.join(', ')} (${userContext.totalTopics} total topics)
- Performance & Weak Areas: ${userContext.weakTopics.map(t => `${t.name} (${t.score}%, ${t.difficulty})`).join(', ')}
- Historical Effort: ${userContext.totalStudyHours}h spent with ${userContext.averageFocus}/5 focus.
- Constraints: ${userContext.studyHoursPerDay} hrs/day until ${userContext.targetDate}. Goal: ${userContext.goal}.

1. THE 80/20 RULE: Prioritize topics where (Difficulty = High) AND (Score < 50%). 
2. EFFICIENCY CHECK: If a subject has high study hours but low scores, suggest a "Method Pivot" in the focus field.
3. COGNITIVE LOAD: Never schedule more than 2 difficult topics in a single day.
4. VARIETY: Alternate between two different subjects per day to prevent burnout.

Generate a plan in this EXACT JSON format (NO markdown, NO code blocks, NO prose):
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "tasks": [
        {
          "subject": "Name",
          "topic": "Name",
          "duration": "Duration in mins",
          "priority": "High | Medium | Low",
          "focus": "The specific cognitive approach (e.g., Active Recall, Pomodoro, Feynman Technique, etc)"
        }
      ]
    }
  ],
  "gapAnalysis": {
    "identifiedGap": "Explain one specific discrepancy between study time and performance.",
    "pivotAction": "Specific change in study habit to fix this gap."
  },
  "recommendations": ["Actionable advice 1", "Actionable advice 2", "Actionable advice 3", "Actionable advice 4"],
  "milestones": [{"week": 1, "goal": "Measurable outcome", "target": "Success metric"}],
  "priorityTopics": [{"topic": "Name", "subject": "Name", "reason": "Logic based on performance delta", "estimatedHours": 5}]
}

IMPORTANT:
- Return ONLY valid JSON.
- If no data exists for a field, provide a logical suggestion based on the Goal.
- Plan for all 7 days.`;
    // Call Gemini API with proper error handling
    const result = await model.generateContent(prompt);
    const response = result.response;
    let aiResponse = response.text();

    // Clean up response
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse AI response
    let studyPlan;
    
    try {
      studyPlan = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate study plan - invalid format'
      });
    }

    res.json({
      success: true,
      data: {
        ...studyPlan,
        generatedAt: new Date(),
        userContext: {
          goal: userContext.goal,
          studyHoursPerDay: userContext.studyHoursPerDay,
          targetDate: userContext.targetDate
        }
      }
    });

  } catch (error) {
    console.error('AI study plan error:', error);
    
    // Handle specific Gemini errors
    if (error.message?.includes('API_KEY_INVALID')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Gemini API key'
      });
    }

    if (error.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'API quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate study plan'
    });
  }
});

module.exports = router;
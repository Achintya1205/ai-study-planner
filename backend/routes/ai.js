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
      model: 'gemini-3-flash-preview',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const prompt = `You are an expert study planner AI. Generate a personalized study plan based on the following student data:

**Student Context:**
- Subjects: ${userContext.subjects.join(', ')}
- Total Topics: ${userContext.totalTopics}
- Weak Topics (score < 60%): ${userContext.weakTopics.map(t => `${t.name} (${t.score}%, ${t.difficulty})`).join(', ') || 'None'}
- Goal: ${userContext.goal}
- Available Study Time: ${userContext.studyHoursPerDay} hours/day
- Target Timeline: ${userContext.targetDate}
- Current Study Stats: ${userContext.totalStudyHours}h total, ${userContext.averageFocus}/5 avg focus

**Subject Performance:**
${subjectPerformance.map(s => `- ${s.name}: ${s.avgScore}% avg, ${s.topicCount} topics, weak: ${s.weakTopics.join(', ') || 'none'}`).join('\n')}

**Recent Test Scores:**
${recentTests.map(t => `- ${t.name}: ${t.score}%`).join('\n') || 'No recent tests'}

Generate a comprehensive study plan in this EXACT JSON format (RETURN ONLY VALID JSON, NO MARKDOWN, NO CODE BLOCKS):
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "tasks": [
        {
          "subject": "Subject name",
          "topic": "Topic name",
          "duration": "2 hours",
          "priority": "High",
          "focus": "What to focus on"
        }
      ]
    }
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4"
  ],
  "milestones": [
    {
      "week": 1,
      "goal": "Specific measurable goal",
      "target": "Success criteria"
    },
    {
      "week": 2,
      "goal": "Next goal",
      "target": "Success criteria"
    }
  ],
  "priorityTopics": [
    {
      "topic": "Topic name",
      "subject": "Subject name",
      "reason": "Why this is priority",
      "estimatedHours": 5
    }
  ]
}

IMPORTANT:
1. Prioritize weak topics first
2. Distribute study time across all subjects
3. Include rest days (recommend lighter study on weekends)
4. Make recommendations specific and actionable
5. Set realistic milestones based on available time
6. Cover all 7 days of the week
7. Return ONLY valid JSON without markdown formatting or code blocks`;

    // Call Gemini API with proper error handling
    const result = await model.generateContent(prompt);
    const response = result.response;
    let aiResponse = response.text();

    // Clean up response (remove markdown code blocks if present)
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
const Test = require('../models/Test');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

async function updateSubjectProgress(subjectId, userId) {
  try {
    const topics = await Topic.find({
      subject: subjectId,
      user: userId
    });

    const topicAverage =
      topics.length > 0
        ? topics.reduce((sum, t) => sum + (t.score || 0), 0) / topics.length
        : null;

    const subjectTests = await Test.find({
      subject: subjectId,
      user: userId,
      topic: null
    })
      .sort({ date: -1 })
      .limit(3);

    const subjectTestAverage =
      subjectTests.length > 0
        ? subjectTests.reduce((sum, t) => sum + t.percentage, 0) /
          subjectTests.length
        : null;

    let currentScore;

    if (topicAverage !== null && subjectTestAverage !== null) {
      currentScore = Math.round(topicAverage * 0.7 + subjectTestAverage * 0.3);
    } else if (topicAverage !== null) {
      currentScore = Math.round(topicAverage);
    } else if (subjectTestAverage !== null) {
      currentScore = Math.round(subjectTestAverage);
    } else {
      currentScore = 0;
    }

    await Subject.findByIdAndUpdate(subjectId, {
      currentScore
    });

  } catch (error) {
    console.error("Progress sync failed:", error);
  }
}

module.exports = updateSubjectProgress;
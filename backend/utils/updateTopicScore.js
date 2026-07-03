const Test = require('../models/Test');
const Topic = require('../models/Topic');
const updateSubjectProgress = require('./updateSubjectProgress');

async function updateTopicScore(topicId) {

    const tests = await Test.find({ topic: topicId })
        .sort({ date: -1 })
        .limit(3);
    let trend = 0;

    if (tests.length >= 2) {
        trend = tests[0].percentage - tests[1].percentage;
    }

    const topic = await Topic.findById(topicId);

    if (tests.length === 0) {

        topic.score = topic.initialScore;
        topic.scoreSource = "manual";

    } else {

        const avg =
            tests.reduce((s, t) => s + t.percentage, 0) / tests.length;

        topic.score = Math.round(avg);
        topic.scoreSource = "tests";
    }

    await topic.save();

    await updateSubjectProgress(topic.subject, topic.user);
}
module.exports = updateTopicScore;
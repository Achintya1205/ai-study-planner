import { useState } from 'react';
import { Brain, Calendar, Target, TrendingUp, Sparkles, Download, RefreshCw, Loader } from 'lucide-react';
import { generateStudyPlan } from '../api/study.api';

function StudyPlan() {
  const [showConfig, setShowConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({
    goal: 'exam',
    studyHoursPerDay: 3,
    targetDate: ''
  });

  const goalOptions = [
    { value: 'exam', label: '🎯 Prepare for Exams', desc: 'Intensive preparation for upcoming tests' },
    { value: 'improve', label: '📈 Improve Weak Topics', desc: 'Focus on topics below 60%' },
    { value: 'maintain', label: '✅ Maintain Current Performance', desc: 'Consistent study routine' },
    { value: 'master', label: '🏆 Master All Subjects', desc: 'Achieve excellence across all subjects' }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await generateStudyPlan(config);
      setPlan(response.data);
      setShowConfig(false);
    } catch (err) {
      setError(err.message || 'Failed to generate study plan. Please try again.');
      console.error('Error generating study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setPlan(null);
    setShowConfig(true);
  };

  const handleExport = () => {
    if (!plan) return;

    const content = `
AI STUDY PLAN
Generated: ${new Date(plan.generatedAt).toLocaleDateString()}
Goal: ${plan.userContext?.goal}
Study Hours: ${plan.userContext?.studyHoursPerDay} hours/day

WEEKLY SCHEDULE
${plan.weeklySchedule?.map(day => `
${day.day}:
${day.tasks?.map(task => `  • ${task.subject} - ${task.topic} (${task.duration}) - ${task.priority} Priority
    Focus: ${task.focus}`).join('\n')}
`).join('\n')}

RECOMMENDATIONS
${plan.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

MILESTONES
${plan.milestones?.map(m => `Week ${m.week}: ${m.goal}
   Target: ${m.target}`).join('\n\n')}

PRIORITY TOPICS
${plan.priorityTopics?.map(p => `• ${p.topic} (${p.subject}) - ${p.estimatedHours}h
   Reason: ${p.reason}`).join('\n\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Study-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showConfig) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-10 w-10" />
            <h1 className="text-3xl font-bold">AI Study Plan Generator</h1>
          </div>
          <p className="text-purple-50">Personalized study plans powered by AI</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Configure Your Study Plan
              </h2>
              <p className="text-gray-600">
                Answer a few questions to get your personalized AI-generated study plan
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Goal Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What's your primary goal?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setConfig({ ...config, goal: option.value })}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        config.goal === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Hours Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How many hours can you study per day?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={config.studyHoursPerDay}
                    onChange={(e) => setConfig({ ...config, studyHoursPerDay: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold min-w-[80px] text-center">
                    {config.studyHoursPerDay}h
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>8 hours</span>
                </div>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={config.targetDate}
                  onChange={(e) => setConfig({ ...config, targetDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank for a 30-day plan
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-6 w-6 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    Generate AI Study Plan
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                ✨ Powered by OpenAI GPT-4 • Analyzing your subjects, topics, and test scores
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display Generated Plan
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Your AI Study Plan</h1>
            </div>
            <p className="text-purple-50">Generated on {new Date(plan?.generatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export
            </button>
            <button
              onClick={handleRegenerate}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-bold">AI Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan?.recommendations?.map((rec, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="text-2xl font-bold opacity-50">{index + 1}</span>
                  <p className="text-sm">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {plan?.weeklySchedule?.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-bold text-lg text-purple-600 mb-3">{day.day}</h3>
                  <div className="space-y-3">
                    {day.tasks?.map((task, taskIndex) => (
                      <div key={taskIndex} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-gray-800">{task.subject}</div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{task.topic}</div>
                        <div className="text-xs text-gray-500 mb-2">⏱️ {task.duration}</div>
                        <div className="text-sm text-gray-700 bg-white rounded p-2">
                          <span className="font-medium">Focus:</span> {task.focus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Milestones</h2>
            </div>
            <div className="p-6 space-y-4">
              {plan?.milestones?.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-emerald-600">W{milestone.week}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{milestone.goal}</h3>
                    <p className="text-sm text-gray-600">Target: {milestone.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Topics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">Priority Topics</h2>
            </div>
            <div className="p-6 space-y-4">
              {plan?.priorityTopics?.map((topic, index) => (
                <div key={index} className="border-l-4 border-orange-500 bg-orange-50 rounded-r-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{topic.topic}</h3>
                    <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                      {topic.estimatedHours}h
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{topic.subject}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Why:</span> {topic.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlan;
import { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles,
  Target,
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Download,
  Play
} from 'lucide-react';

function StudyPlan() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('improve_weak');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(2);
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    loadData();
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setTargetDate(date.toISOString().split('T')[0]);
  }, []);

  const loadData = () => {

    const dummySubjects = [
      { id: 1, name: 'Mathematics', color: 'emerald' },
      { id: 2, name: 'Physics', color: 'purple' },
      { id: 3, name: 'Chemistry', color: 'cyan' },
      { id: 4, name: 'Computer Science', color: 'orange' }
    ];
    setSubjects(dummySubjects);

    const dummyTopics = [
      { id: 1, name: 'Calculus - Integration', subjectId: '1', subjectName: 'Mathematics', score: 45, isWeak: true },
      { id: 2, name: 'Calculus - Differentiation', subjectId: '1', subjectName: 'Mathematics', score: 78, isWeak: false },
      { id: 3, name: 'Linear Algebra', subjectId: '1', subjectName: 'Mathematics', score: 52, isWeak: true },
      { id: 4, name: 'Electromagnetism', subjectId: '2', subjectName: 'Physics', score: 48, isWeak: true },
      { id: 5, name: 'Mechanics - Kinematics', subjectId: '2', subjectName: 'Physics', score: 85, isWeak: false },
      { id: 6, name: 'Organic Chemistry - Reactions', subjectId: '3', subjectName: 'Chemistry', score: 50, isWeak: true },
      { id: 7, name: 'Data Structures - Trees', subjectId: '4', subjectName: 'Computer Science', score: 72, isWeak: false },
      { id: 8, name: 'Algorithms - Sorting', subjectId: '4', subjectName: 'Computer Science', score: 80, isWeak: false }
    ];
    setTopics(dummyTopics);

    // test data
    const dummyTests = [
      { id: 1, subjectName: 'Mathematics', topicName: 'Calculus - Integration', percentage: 45 },
      { id: 2, subjectName: 'Physics', topicName: 'Electromagnetism', percentage: 48 },
      { id: 3, subjectName: 'Chemistry', topicName: 'Organic Chemistry - Reactions', percentage: 50 }
    ];
    setTests(dummyTests);
  };

  const generateStudyPlan = () => {
    setGenerating(true);

    // AI processing
    setTimeout(() => {
      const weakTopics = topics.filter(t => t.isWeak).sort((a, b) => a.score - b.score);
      
      const plan = {
        goal: selectedGoal,
        duration: calculateDuration(),
        hoursPerDay: studyHoursPerDay,
        weeklyPlan: generateWeeklyPlan(weakTopics),
        priorityTopics: weakTopics.slice(0, 5),
        recommendations: generateRecommendations(weakTopics),
        milestones: generateMilestones(weakTopics)
      };

      setStudyPlan(plan);
      setGenerating(false);
    }, 2000);
  };

  const calculateDuration = () => {
    const today = new Date();
    const target = new Date(targetDate);
    const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  const generateWeeklyPlan = (weakTopics) => {
    const weeks = Math.ceil(calculateDuration() / 7);
    const topicsPerWeek = Math.ceil(weakTopics.length / weeks);
    
    const weeklyPlan = [];
    for (let i = 0; i < Math.min(weeks, 4); i++) {
      const weekTopics = weakTopics.slice(i * topicsPerWeek, (i + 1) * topicsPerWeek);
      weeklyPlan.push({
        week: i + 1,
        topics: weekTopics,
        focus: i === 0 ? 'Foundation Building' : i === 1 ? 'Practice & Application' : i === 2 ? 'Problem Solving' : 'Review & Testing',
        dailyHours: studyHoursPerDay
      });
    }
    return weeklyPlan;
  };

  const generateRecommendations = (weakTopics) => {
    return [
      {
        type: 'Priority',
        icon: AlertCircle,
        color: 'red',
        title: 'Focus on Critical Topics First',
        description: `Start with ${weakTopics[0]?.name} (${weakTopics[0]?.score}%) - your lowest scoring topic. Dedicate 40% of study time here.`
      },
      {
        type: 'Strategy',
        icon: Target,
        color: 'purple',
        title: 'Use Active Recall',
        description: 'Practice problems without looking at solutions. This improves retention by 50% compared to passive reading.'
      },
      {
        type: 'Schedule',
        icon: Clock,
        color: 'cyan',
        title: 'Study in 25-Minute Sessions',
        description: 'Use Pomodoro technique: 25 min study, 5 min break. Take a longer 15-min break after 4 sessions.'
      },
      {
        type: 'Progress',
        icon: TrendingUp,
        color: 'green',
        title: 'Weekly Progress Tests',
        description: 'Take a practice test every weekend to track improvement and adjust your study plan accordingly.'
      }
    ];
  };

  const generateMilestones = (weakTopics) => {
    const duration = calculateDuration();
    return [
      {
        week: Math.ceil(duration / 4),
        goal: `Master ${weakTopics[0]?.name}`,
        target: 'Achieve 70%+ on practice tests',
        status: 'pending'
      },
      {
        week: Math.ceil(duration / 2),
        goal: `Complete all weak topics review`,
        target: 'Finish studying all priority topics',
        status: 'pending'
      },
      {
        week: Math.ceil(duration * 3 / 4),
        goal: `Practice advanced problems`,
        target: 'Solve 50+ mixed problems',
        status: 'pending'
      },
      {
        week: duration,
        goal: `Final assessment`,
        target: 'Score 80%+ on comprehensive test',
        status: 'pending'
      }
    ];
  };

  const goalOptions = [
    { value: 'improve_weak', label: 'Improve Weak Topics', icon: Target },
    { value: 'maintain_strong', label: 'Maintain Strong Topics', icon: CheckCircle },
    { value: 'exam_prep', label: 'Exam Preparation', icon: BookOpen },
    { value: 'comprehensive', label: 'Comprehensive Review', icon: Brain }
  ];

  const getColorClass = (color) => {
    const colors = {
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">AI Study Planner</h1>
            </div>
            <p className="text-indigo-100 text-lg">
              Personalized study plans powered by artificial intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!studyPlan ? (
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Generate Your Personalized Study Plan
                </h2>
                <p className="text-gray-600">
                  AI will analyze your performance and create an optimized learning path
                </p>
              </div>

              <div className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What's your primary goal?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedGoal(option.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedGoal === option.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mb-2 ${selectedGoal === option.value ? 'text-purple-600' : 'text-gray-400'}`} />
                          <p className={`text-sm font-semibold ${selectedGoal === option.value ? 'text-purple-900' : 'text-gray-700'}`}>
                            {option.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Study Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many hours can you study per day?
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={studyHoursPerDay}
                      onChange={(e) => setStudyHoursPerDay(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-purple-600 min-w-[80px] text-center">
                      {studyHoursPerDay} {studyHoursPerDay === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Light (1h)</span>
                    <span>Moderate (4h)</span>
                    <span>Intensive (8h)</span>
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target completion date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {calculateDuration()} days available for study
                  </p>
                </div>

                {/* Current Analysis */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Current Status</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">{topics.filter(t => t.isWeak).length}</p>
                      <p className="text-sm text-gray-600">Weak Topics</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-600">
                        {topics.filter(t => t.isWeak).length > 0 
                          ? Math.round(topics.filter(t => t.isWeak).reduce((sum, t) => sum + t.score, 0) / topics.filter(t => t.isWeak).length)
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-600">Avg Weak Score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">{tests.length}</p>
                      <p className="text-sm text-gray-600">Tests Taken</p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateStudyPlan}
                  disabled={generating}
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Generating Your Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate AI Study Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) :(
          /* Study Plan Display */
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Personalized Study Plan</h2>
                <p className="text-gray-600">
                  {studyPlan.duration} days • {studyPlan.hoursPerDay} hours/day • {studyPlan.priorityTopics.length} priority topics
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStudyPlan(null)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/*Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI-Powered Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  const colorClass = getColorClass(rec.color);
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${colorClass.border} ${colorClass.bg}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-white`}>
                          <Icon className={`h-5 w-5 ${colorClass.text}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${colorClass.text} mb-1`}>{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Weekly Study Schedule
              </h3>
              <div className="space-y-4">
                {studyPlan.weeklyPlan.map((week, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Week {week.week}</h4>
                        <p className="text-sm text-purple-600 font-medium">{week.focus}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Daily commitment</p>
                        <p className="font-bold text-gray-900">{week.dailyHours} hours/day</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {week.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${topic.score < 50 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{topic.name}</p>
                              <p className="text-xs text-gray-500">{topic.subjectName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-red-600">{topic.score}%</span>
                            <button className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors">
                              <Play className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Key Milestones
              </h3>
              <div className="space-y-3">
                {studyPlan.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="font-bold text-purple-600">{milestone.week}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{milestone.goal}</h4>
                      <p className="text-sm text-gray-600 mt-1">{milestone.target}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Priority Focus Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.priorityTopics.map((topic, index) => (
                  <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{topic.subjectName}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                        {topic.score}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${topic.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPlan;
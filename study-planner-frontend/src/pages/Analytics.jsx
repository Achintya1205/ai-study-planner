import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  AlertCircle,
  BookOpen,
  Clock,
  Filter,
  Download
} from 'lucide-react';

function Analytics() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [timeRange, setTimeRange] = useState('7'); // days

  useEffect(() => {
    loadData();
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
      { id: 1, name: 'Calculus - Integration', subjectId: '1', score: 45, isWeak: true },
      { id: 2, name: 'Calculus - Differentiation', subjectId: '1', score: 78, isWeak: false },
      { id: 3, name: 'Linear Algebra', subjectId: '1', score: 52, isWeak: true },
      { id: 4, name: 'Electromagnetism', subjectId: '2', score: 48, isWeak: true },
      { id: 5, name: 'Mechanics - Kinematics', subjectId: '2', score: 85, isWeak: false },
      { id: 6, name: 'Organic Chemistry - Reactions', subjectId: '3', score: 50, isWeak: true },
      { id: 7, name: 'Data Structures - Trees', subjectId: '4', score: 72, isWeak: false },
      { id: 8, name: 'Algorithms - Sorting', subjectId: '4', score: 80, isWeak: false }
    ];
    setTopics(dummyTopics);

    // test results
    const dummyTests = [
      { id: 1, subjectId: '1', subjectName: 'Mathematics', percentage: 45, date: '2024-02-01' },
      { id: 2, subjectId: '1', subjectName: 'Mathematics', percentage: 78, date: '2024-02-03' },
      { id: 3, subjectId: '2', subjectName: 'Physics', percentage: 48, date: '2024-02-02' },
      { id: 4, subjectId: '2', subjectName: 'Physics', percentage: 85, date: '2024-02-04' },
      { id: 5, subjectId: '3', subjectName: 'Chemistry', percentage: 50, date: '2024-02-01' },
      { id: 6, subjectId: '4', subjectName: 'Computer Science', percentage: 72, date: '2024-02-03' },
      { id: 7, subjectId: '4', subjectName: 'Computer Science', percentage: 92, date: '2024-02-05' },
      { id: 8, subjectId: '1', subjectName: 'Mathematics', percentage: 58, date: '2024-02-06' }
    ];
    setTests(dummyTests);

    // study sessions
    const dummySessions = [
      { id: 1, subjectId: '1', subjectName: 'Mathematics', duration: 45, date: '2024-02-05' },
      { id: 2, subjectId: '2', subjectName: 'Physics', duration: 60, date: '2024-02-05' },
      { id: 3, subjectId: '1', subjectName: 'Mathematics', duration: 30, date: '2024-02-04' },
      { id: 4, subjectId: '4', subjectName: 'Computer Science', duration: 90, date: '2024-02-04' },
      { id: 5, subjectId: '3', subjectName: 'Chemistry', duration: 50, date: '2024-02-03' },
      { id: 6, subjectId: '2', subjectName: 'Physics', duration: 40, date: '2024-02-03' },
      { id: 7, subjectId: '4', subjectName: 'Computer Science', duration: 75, date: '2024-02-02' },
      { id: 8, subjectId: '1', subjectName: 'Mathematics', duration: 55, date: '2024-02-02' }
    ];
    setSessions(dummySessions);
  };

  // data by subject
  const filteredTopics = selectedSubject === 'all' 
    ? topics 
    : topics.filter(t => t.subjectId === selectedSubject);

  const filteredTests = selectedSubject === 'all'
    ? tests
    : tests.filter(t => t.subjectId === selectedSubject);

  const filteredSessions = selectedSubject === 'all'
    ? sessions
    : sessions.filter(s => s.subjectId === selectedSubject);

  const stats = {
    totalTopics: filteredTopics.length,
    weakTopics: filteredTopics.filter(t => t.isWeak).length,
    avgScore: filteredTopics.length > 0 
      ? Math.round(filteredTopics.reduce((sum, t) => sum + t.score, 0) / filteredTopics.length) 
      : 0,
    totalTests: filteredTests.length,
    avgTestScore: filteredTests.length > 0
      ? Math.round(filteredTests.reduce((sum, t) => sum + t.percentage, 0) / filteredTests.length)
      : 0,
    totalStudyHours: Math.floor(filteredSessions.reduce((sum, s) => sum + s.duration, 0) / 60),
    totalStudyMinutes: filteredSessions.reduce((sum, s) => sum + s.duration, 0) % 60,
    improvement: 12 // Dummy improvement percentage
  };

  // Subject-wise breakdown
  const subjectBreakdown = subjects.map(subject => {
    const subjectTopics = topics.filter(t => t.subjectId === subject.id.toString());
    const subjectTests = tests.filter(t => t.subjectId === subject.id.toString());
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id.toString());
    
    return {
      name: subject.name,
      color: subject.color,
      topics: subjectTopics.length,
      weakTopics: subjectTopics.filter(t => t.isWeak).length,
      avgScore: subjectTopics.length > 0
        ? Math.round(subjectTopics.reduce((sum, t) => sum + t.score, 0) / subjectTopics.length)
        : 0,
      tests: subjectTests.length,
      studyTime: subjectSessions.reduce((sum, s) => sum + s.duration, 0)
    };
  });

  const weakTopicsList = topics.filter(t => t.isWeak).sort((a, b) => a.score - b.score);

  const recentTests = tests.slice(-7).reverse();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getColorClass = (colorName) => {
    const colors = {
      emerald: { from: 'from-emerald-500', to: 'to-cyan-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      purple: { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-50', text: 'text-purple-600' },
      cyan: { from: 'from-cyan-500', to: 'to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
      orange: { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-50', text: 'text-orange-600' }
    };
    return colors[colorName] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard 📊</h1>
              <p className="text-purple-50">Comprehensive insights into your learning progress</p>
            </div>
            <button className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg">
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <span className={`text-sm font-semibold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                +{stats.improvement}%
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Average Score</p>
            <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.avgScore)}`}>
              {stats.avgScore}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Weak Topics</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{stats.weakTopics}</p>
            <p className="text-xs text-gray-500 mt-1">out of {stats.totalTopics} topics</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-50 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Tests Completed</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTests}</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {stats.avgTestScore}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Study Time</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalStudyHours}h {stats.totalStudyMinutes}m
            </p>
          </div>
        </div>

        {/* Charts*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Subject Performance
            </h2>
            <div className="space-y-4">
              {subjectBreakdown.map((subject, index) => {
                const colorClass = getColorClass(subject.color);
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                      <span className={`text-sm font-bold ${getScoreColor(subject.avgScore)}`}>
                        {subject.avgScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${colorClass.from} ${colorClass.to} h-3 rounded-full transition-all`}
                        style={{ width: `${subject.avgScore}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>{subject.topics} topics</span>
                      <span>{Math.floor(subject.studyTime / 60)}h {subject.studyTime % 60}m studied</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Score Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Recent Test Scores
            </h2>
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{test.subjectName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(test.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBg(test.percentage)} ${getScoreColor(test.percentage)}`}>
                    {test.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak Topics Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
            Topics Needing Attention
          </h2>
          {weakTopicsList.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-900">Great job!</p>
              <p className="text-gray-500">No weak topics found. Keep up the excellent work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weakTopicsList.map((topic, index) => {
                const subject = subjects.find(s => s.id.toString() === topic.subjectId);
                const colorClass = getColorClass(subject?.color || 'emerald');
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                        <p className={`text-sm ${colorClass.text} mt-1`}>
                          {subject?.name}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-600`}>
                        {topic.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${topic.score}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {topic.score < 40 ? 'Critical' : topic.score < 60 ? 'Needs Work' : 'Review'}
                      </span>
                      <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
                        Study Now →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Study Time Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Study Time by Subject
          </h2>
          <div className="space-y-4">
            {subjectBreakdown.map((subject, index) => {
              const colorClass = getColorClass(subject.color);
              const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
              const percentage = totalMinutes > 0 ? Math.round((subject.studyTime / totalMinutes) * 100) : 0;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {Math.floor(subject.studyTime / 60)}h {subject.studyTime % 60}m
                      </span>
                      <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${colorClass.from} ${colorClass.to} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
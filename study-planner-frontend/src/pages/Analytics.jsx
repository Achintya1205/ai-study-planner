import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Download, Filter } from 'lucide-react';
import { getSubjects, getTopics, getTests, getSessions } from '../api/study.api';

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState({
    subjectPerformance: [],
    recentTests: [],
    weakTopics: [],
    studyTimeBreakdown: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [filterSubject, filterTime]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [subjectsRes, topicsRes, testsRes, sessionsRes] = await Promise.all([
        getSubjects(),
        getTopics(),
        getTests(),
        getSessions()
      ]);

      const allSubjects = subjectsRes.data || [];
      const allTopics = topicsRes.data || [];
      let allTests = testsRes.data || [];
      let allSessions = sessionsRes.data || [];

      setSubjects(allSubjects);

      // Apply time filter
      const now = new Date();
      let cutoffDate = new Date(0); // Beginning of time
      
      if (filterTime === '7d') {
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filterTime === '30d') {
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filterTime === '3mo') {
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      if (filterTime !== 'all') {
        allTests = allTests.filter(t => new Date(t.date) >= cutoffDate);
        allSessions = allSessions.filter(s => new Date(s.date) >= cutoffDate);
      }

      // Apply subject filter
      if (filterSubject !== 'all') {
        allTests = allTests.filter(t => t.subject?._id === filterSubject);
        allSessions = allSessions.filter(s => s.subject?._id === filterSubject);
      }

      // Calculate subject performance
      const subjectPerformance = allSubjects.map(subject => {
        const subjectTopics = allTopics.filter(t => 
          t.subject?._id === subject._id || t.subject === subject._id
        );
        const avgScore = subjectTopics.length > 0
          ? subjectTopics.reduce((sum, t) => sum + (t.score || 0), 0) / subjectTopics.length
          : 0;
        
        return {
          name: subject.name,
          score: Math.round(avgScore),
          color: subject.color,
          topics: subjectTopics.length
        };
      }).filter(s => filterSubject === 'all' || s.name === allSubjects.find(sub => sub._id === filterSubject)?.name);

      // Recent tests
      const recentTests = allTests
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .map(t => ({
          name: t.name,
          subject: t.subject?.name,
          score: t.percentage,
          date: new Date(t.date).toLocaleDateString(),
          passed: t.percentage >= 60
        }));

      // Weak topics analysis
      const weakTopics = allTopics
        .filter(t => t.isWeak)
        .filter(t => filterSubject === 'all' || t.subject?._id === filterSubject)
        .map(t => ({
          name: t.name,
          subject: t.subject?.name,
          score: t.score,
          severity: t.score < 40 ? 'Critical' : t.score < 50 ? 'Needs Work' : 'Review',
          difficulty: t.difficulty
        }))
        .sort((a, b) => a.score - b.score);

      // Study time breakdown
      const studyTimeBreakdown = allSubjects.map(subject => {
        const subjectSessions = allSessions.filter(s => 
          s.subject?._id === subject._id || s.subject === subject._id
        );
        const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
        
        return {
          name: subject.name,
          minutes: totalMinutes,
          hours: Math.floor(totalMinutes / 60),
          color: subject.color
        };
      }).filter(s => s.minutes > 0 && (filterSubject === 'all' || s.name === allSubjects.find(sub => sub._id === filterSubject)?.name));

      setAnalytics({
        subjectPerformance,
        recentTests,
        weakTopics,
        studyTimeBreakdown
      });

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
      cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700' },
      indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700' },
      pink: { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' }
    };
    return colors[color] || colors.emerald;
  };

  const getSeverityColor = (severity) => {
    return severity === 'Critical' ? 'text-red-700 bg-red-100' :
           severity === 'Needs Work' ? 'text-orange-700 bg-orange-100' :
           'text-yellow-700 bg-yellow-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
            <p className="text-purple-100">Insights into your study performance</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3mo">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Subject Performance */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Subject Performance</h2>
          </div>
          <div className="p-6">
            {analytics.subjectPerformance.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No performance data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.subjectPerformance.map((subject, index) => {
                  const colors = getColorClasses(subject.color);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800">{subject.name}</span>
                          <span className="text-sm text-gray-500">({subject.topics} topics)</span>
                        </div>
                        <span className="font-bold text-gray-800">{subject.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${colors.bg}`}
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Scores */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Recent Test Scores</h2>
            </div>
            <div className="p-6">
              {analytics.recentTests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No test data available</p>
              ) : (
                <div className="space-y-3">
                  {analytics.recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{test.name}</p>
                        <p className="text-sm text-gray-500">{test.subject} • {test.date}</p>
                      </div>
                      <div className={`text-lg font-bold ${
                        test.passed ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {test.score}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weak Topics Analysis */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">Weak Topics Analysis</h2>
            </div>
            <div className="p-6">
              {analytics.weakTopics.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-emerald-600 font-semibold mb-2">🎉 Great job!</p>
                  <p className="text-gray-500">No weak topics found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.weakTopics.map((topic, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{topic.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(topic.severity)}`}>
                          {topic.severity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{topic.subject} • {topic.difficulty}</span>
                        <span className="font-bold text-orange-600">{topic.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Study Time Breakdown */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Study Time Breakdown</h2>
          </div>
          <div className="p-6">
            {analytics.studyTimeBreakdown.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No study session data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.studyTimeBreakdown.map((item, index) => {
                  const colors = getColorClasses(item.color);
                  const totalMinutes = analytics.studyTimeBreakdown.reduce((sum, s) => sum + s.minutes, 0);
                  const percentage = totalMinutes > 0 ? (item.minutes / totalMinutes) * 100 : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-gray-600">{item.hours}h {item.minutes % 60}m</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${colors.bg}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
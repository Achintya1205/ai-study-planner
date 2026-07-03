import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookMarked, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Calendar,
  BarChart3,
  Brain,
  Flame
} from 'lucide-react';
import { getSubjects, getTopics, getTests, getSessions, getSessionStats } from '../api/study.api';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalTopics: 0,
    studyHours: 0,
    avgProgress: 0,
    weakTopics: 0,
    studyStreak: 0, 
    recentTests: []
  });
  const [weakTopics, setWeakTopics] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState('');

  const calculateStreak = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;

    const uniqueDates = [...new Set(sessions.map(s => 
      new Date(s.date).toISOString().split('T')[0]
    ))].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) {
      return 0;
    }

    let checkDate = new Date(uniqueDates[0]);
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDateInLoop = uniqueDates[i];
      const expectedDateStr = checkDate.toISOString().split('T')[0];

      if (currentDateInLoop === expectedDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); // Move to the previous day
      } else {
        break; 
      }
    }
    return streak;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [subjectsRes, topicsRes, testsRes, sessionsRes, sessionStatsRes] = await Promise.all([
        getSubjects(),
        getTopics(),
        getTests(),
        getSessions(),
        getSessionStats()
      ]);

      const subjects = subjectsRes.data || [];
      const topics = topicsRes.data || [];
      const tests = testsRes.data || [];
      const sessions = sessionsRes.data || [];
      const sessionStats = sessionStatsRes.data || {};

      // Calculate stats
      const weak = topics.filter(t => t.isWeak);
      const avgProgress = subjects.length > 0
        ? Math.round(subjects.reduce((sum, s) => sum + (s.currentScore || 0), 0) / subjects.length)
        : 0;
      const currentStreak = calculateStreak(sessions);

      setStats({
        totalSubjects: subjects.length,
        totalTopics: topics.length,
        studyHours: sessionStats.totalHours || 0,
        avgProgress,
        weakTopics: weak.length,
        studyStreak: currentStreak, // Dynamic value
        recentTests: tests.slice(0, 5)
      });
      const sortedWeak = weak.sort((a, b) => (a.score || 0) - (b.score || 0));
      setWeakTopics(sortedWeak.slice(0, 5));

      // Recent activity mapping
      const activity = [
        ...sessions.slice(0, 3).map(s => ({
          type: 'session',
          text: `Studied ${s.subject?.name} for ${s.duration} min`,
          time: new Date(s.date).toLocaleDateString()
        })),
        ...tests.slice(0, 2).map(t => ({
          type: 'test',
          text: `${t.name}: ${t.percentage}%`,
          time: new Date(t.date).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivity(activity);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { username: 'Student' };
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username || user.name || 'Student'}! 👋</h1>
        <p className="text-emerald-50">{today}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSubjects}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <BookMarked className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Study Hours</p>
                <p className="text-3xl font-bold text-gray-800">{stats.studyHours}h</p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-800">{stats.avgProgress}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weak Topics</p>
                <p className="text-3xl font-bold text-gray-800">{stats.weakTopics}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => navigate('/study-session')}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition flex items-center justify-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  Study Session
                </button>
                <button
                  onClick={() => navigate('/analytics')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center gap-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </button>
                <button
                  onClick={() => navigate('/study-plan')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Brain className="h-5 w-5" />
                  AI Study Plan
                </button>
              </div>
            </div>

            {weakTopics.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Topics Needing Attention</h2>
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div className="space-y-3">
                  {weakTopics.map((topic) => (
                    <div key={topic._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{topic.name}</h3>
                        <p className="text-sm text-gray-600">{topic.subject?.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{topic.score}%</p>
                          <p className="text-xs text-gray-500">{topic.difficulty}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/topics?subject=${topic.subject?._id}`)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'session' ? 'bg-emerald-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'session' ? (
                          <Clock className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Target className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{activity.text}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Study Streak</h3>
                <Flame className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold mb-2">{stats.studyStreak} days</p>
            </div>

            {stats.recentTests.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Tests</h3>
                <div className="space-y-3">
                  {stats.recentTests.map((test) => (
                    <div key={test._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{test.name}</p>
                        <p className="text-xs text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
                      </div>
                      <div className={`text-lg font-bold ${
                        test.percentage >= 33 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {test.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Topics Covered</span>
                  <span className="font-bold text-gray-800">{stats.totalTopics}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weak Topics</span>
                  <span className="font-bold text-orange-600">{stats.weakTopics}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Progress</span>
                  <span className="font-bold text-emerald-600">{stats.avgProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
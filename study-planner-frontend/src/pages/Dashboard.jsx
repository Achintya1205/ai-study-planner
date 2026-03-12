import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target,
  BarChart3,
  Brain,
  Calendar,
  Award
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Dummy stats data (will be replaced with real API data later)
  const stats = [
    {
      title: 'Total Subjects',
      value: '6',
      icon: BookOpen,
      color: 'from-emerald-500 to-cyan-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Study Hours',
      value: '24h',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Overall Progress',
      value: '68%',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Weak Topics',
      value: '3',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  // Quick action cards
  const quickActions = [
    {
      title: 'Study Session',
      description: 'Start a new study session',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-emerald-500 to-cyan-500',
      action: () => navigate('/study-session')
    },
    {
      title: 'View Analytics',
      description: 'Check your performance',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => navigate('/analytics')
    },
    {
      title: 'AI Study Plan',
      description: 'Get personalized plan',
      icon: Brain,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      action: () => navigate('/study-plan')
    }
  ];

  // Recent weak topics (dummy data)
  const weakTopics = [
    { subject: 'Mathematics', topic: 'Calculus - Integration', score: 45 },
    { subject: 'Physics', topic: 'Electromagnetism', score: 52 },
    { subject: 'Chemistry', topic: 'Organic Reactions', score: 48 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username || 'Student'}! 👋
              </h1>
              <p className="text-emerald-50 text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions and Weak Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm text-white/90">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Study Streak</h2>
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">7</div>
              <p className="text-gray-600 font-medium">Days in a row! 🔥</p>
              <p className="text-sm text-gray-500 mt-2">
                Keep it up! You're on fire!
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Week</span>
                <span className="font-semibold text-gray-900">5 / 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Topics Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Topics Needing Attention</h2>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
            >
              View All
              <TrendingUp className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {weakTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{topic.topic}</p>
                  <p className="text-sm text-gray-500">{topic.subject}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className={`font-bold ${
                      topic.score < 50 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {topic.score}%
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Chart will be added here</p>
              <p className="text-sm text-gray-400 mt-1">
                Connected to analytics API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
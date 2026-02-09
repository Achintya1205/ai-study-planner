import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, BarChart3, Brain, Home, BookMarked, Library, ClipboardCheck, Timer } from 'lucide-react';

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              AI Study Planner
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/subjects')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <BookMarked className="h-5 w-5" />
              <span className="font-medium">Subjects</span>
            </button>

            <button
              onClick={() => navigate('/topics')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Library className="h-5 w-5" />
              <span className="font-medium">Topics</span>
            </button>

            <button
              onClick={() => navigate('/tests')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ClipboardCheck className="h-5 w-5" />
              <span className="font-medium">Tests</span>
            </button>
            <button
              onClick={() => navigate('/study-session')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Timer className="h-5 w-5" />
              <span className="font-medium">Study</span>
            </button>

            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => navigate('/study-plan')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI Planner</span>
            </button>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.username || 'Guest'}
              </p>
              <p className="text-xs text-gray-500">
                {user.email || 'student@example.com'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
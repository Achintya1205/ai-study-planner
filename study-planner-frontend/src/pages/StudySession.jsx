import { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Plus, 
  Play,
  Pause,
  StopCircle,
  Save,
  X,
  Search,
  Calendar,
  Timer,
  TrendingUp,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

function StudySession() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerSubject, setTimerSubject] = useState('');
  const [timerTopic, setTimerTopic] = useState('');
  const [timerNotes, setTimerNotes] = useState('');
  const intervalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    duration: 30,
    date: '',
    notes: '',
    focus: 5
  });

  useEffect(() => {
    loadSubjects();
    loadTopics();
    loadSessions();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const loadSubjects = () => {
    const dummySubjects = [
      { id: 1, name: 'Mathematics', color: 'emerald' },
      { id: 2, name: 'Physics', color: 'purple' },
      { id: 3, name: 'Chemistry', color: 'cyan' },
      { id: 4, name: 'Computer Science', color: 'orange' }
    ];
    setSubjects(dummySubjects);
  };

  const loadTopics = () => {
    const dummyTopics = [
      { id: 1, name: 'Calculus - Integration', subjectId: '1' },
      { id: 2, name: 'Calculus - Differentiation', subjectId: '1' },
      { id: 3, name: 'Linear Algebra', subjectId: '1' },
      { id: 4, name: 'Electromagnetism', subjectId: '2' },
      { id: 5, name: 'Mechanics - Kinematics', subjectId: '2' },
      { id: 6, name: 'Organic Chemistry - Reactions', subjectId: '3' },
      { id: 7, name: 'Data Structures - Trees', subjectId: '4' },
      { id: 8, name: 'Algorithms - Sorting', subjectId: '4' }
    ];
    setTopics(dummyTopics);
  };

  const loadSessions = () => {
    const dummySessions = [
      {
        id: 1,
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '1',
        topicName: 'Calculus - Integration',
        duration: 45,
        date: '2024-02-05',
        notes: 'Practiced integration by parts',
        focus: 4
      },
      {
        id: 2,
        subjectId: '2',
        subjectName: 'Physics',
        topicId: '4',
        topicName: 'Electromagnetism',
        duration: 60,
        date: '2024-02-05',
        notes: 'Reviewed Maxwell equations',
        focus: 5
      },
      {
        id: 3,
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '2',
        topicName: 'Calculus - Differentiation',
        duration: 30,
        date: '2024-02-04',
        notes: 'Chain rule practice',
        focus: 5
      },
      {
        id: 4,
        subjectId: '4',
        subjectName: 'Computer Science',
        topicId: '7',
        topicName: 'Data Structures - Trees',
        duration: 90,
        date: '2024-02-04',
        notes: 'Implemented AVL tree',
        focus: 4
      },
      {
        id: 5,
        subjectId: '3',
        subjectName: 'Chemistry',
        topicId: '6',
        topicName: 'Organic Chemistry - Reactions',
        duration: 50,
        date: '2024-02-03',
        notes: 'SN1 vs SN2 mechanisms',
        focus: 3
      },
      {
        id: 6,
        subjectId: '2',
        subjectName: 'Physics',
        topicId: '5',
        topicName: 'Mechanics - Kinematics',
        duration: 40,
        date: '2024-02-03',
        notes: 'Projectile motion problems',
        focus: 5
      },
      {
        id: 7,
        subjectId: '4',
        subjectName: 'Computer Science',
        topicId: '8',
        topicName: 'Algorithms - Sorting',
        duration: 75,
        date: '2024-02-02',
        notes: 'Quick sort optimization',
        focus: 4
      },
      {
        id: 8,
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '3',
        topicName: 'Linear Algebra',
        duration: 55,
        date: '2024-02-02',
        notes: 'Eigenvalue calculations',
        focus: 3
      }
    ];
    setSessions(dummySessions);
  };

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = session.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || session.subjectId === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleStartTimer = () => {
    if (!timerSubject || !timerTopic) {
      alert('Please select subject and topic first');
      return;
    }
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleStopTimer = () => {
    if (elapsedTime === 0) {
      setShowTimerModal(false);
      resetTimer();
      return;
    }

    const subject = subjects.find(s => s.id.toString() === timerSubject);
    const topic = topics.find(t => t.id.toString() === timerTopic);
    const duration = Math.floor(elapsedTime / 60);

    if (duration < 1) {
      alert('Session too short! Study for at least 1 minute.');
      return;
    }

    const newSession = {
      id: Date.now(),
      subjectId: timerSubject,
      subjectName: subject?.name || '',
      topicId: timerTopic,
      topicName: topic?.name || '',
      duration: duration,
      date: new Date().toISOString().split('T')[0],
      notes: timerNotes,
      focus: 5
    };

    setSessions([newSession, ...sessions]);
    setShowTimerModal(false);
    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setTimerSubject('');
    setTimerTopic('');
    setTimerNotes('');
  };

  const handleAddSession = () => {
    if (!formData.subjectId || !formData.topicId) {
      alert('Please select subject and topic');
      return;
    }

    const subject = subjects.find(s => s.id.toString() === formData.subjectId);
    const topic = topics.find(t => t.id.toString() === formData.topicId);

    const newSession = {
      id: Date.now(),
      subjectId: formData.subjectId,
      subjectName: subject?.name || '',
      topicId: formData.topicId,
      topicName: topic?.name || '',
      duration: formData.duration,
      date: formData.date || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      focus: formData.focus
    };

    setSessions([newSession, ...sessions]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      subjectId: '',
      topicId: '',
      duration: 30,
      date: '',
      notes: '',
      focus: 5
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTopicsForSubject = topics.filter(topic => 
    formData.subjectId ? topic.subjectId === formData.subjectId : true
  );

  const filteredTopicsForTimer = topics.filter(topic => 
    timerSubject ? topic.subjectId === timerSubject : true
  );

  const stats = {
    totalSessions: sessions.length,
    totalHours: Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / 60),
    totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0) % 60,
    avgSession: sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length) : 0,
    todaySessions: sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    todayMinutes: sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).reduce((sum, s) => sum + s.duration, 0)
  };

  const getFocusColor = (focus) => {
    if (focus >= 4) return 'text-green-600';
    if (focus >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Study Sessions ⏱️</h1>
              <p className="text-indigo-50">Track your study time and build consistent habits</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTimerModal(true)}
                className="flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                <Timer className="h-5 w-5" />
                <span>Start Timer</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg border-2 border-white"
              >
                <Plus className="h-5 w-5" />
                <span>Add Manual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSessions}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalHours}h {stats.totalMinutes}m
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Session</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgSession}m</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <Target className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Today Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todaySessions}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Today Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todayMinutes}m</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Sessions
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, topic, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedSubject !== 'all'
                ? 'No sessions found'
                : 'No study sessions yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedSubject !== 'all'
                ? 'Try adjusting your filters'
                : 'Start your first study session and build the habit!'}
            </p>
            {!searchQuery && selectedSubject === 'all' && (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowTimerModal(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors"
                >
                  <Timer className="h-5 w-5" />
                  <span>Start Timer</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Manual Entry</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{session.topicName}</h3>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                        {session.duration} min
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm mb-3">
                      <span className="font-medium text-indigo-600">{session.subjectName}</span>
                      <span className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center text-gray-500">
                        Focus: <span className={`ml-1 font-semibold ${getFocusColor(session.focus)}`}>{session.focus}/5</span>
                      </span>
                    </div>

                    {session.notes && (
                      <p className="text-gray-600 text-sm italic">"{session.notes}"</p>
                    )}
                  </div>

                  <div className="text-center ml-6">
                    <div className="text-4xl font-bold text-indigo-600">
                      {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">hours:minutes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Study Timer</h2>
                <button
                  onClick={() => {
                    if (isRunning && !window.confirm('Stop the timer? Your progress will be lost.')) {
                      return;
                    }
                    setShowTimerModal(false);
                    resetTimer();
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-center py-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="text-6xl font-bold text-indigo-600 mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <p className="text-gray-600 text-sm">
                  {isRunning ? 'Timer running...' : 'Ready to start'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={timerSubject}
                    onChange={(e) => {
                      setTimerSubject(e.target.value);
                      setTimerTopic('');
                    }}
                    disabled={isRunning}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic *
                  </label>
                  <select
                    value={timerTopic}
                    onChange={(e) => setTimerTopic(e.target.value)}
                    disabled={!timerSubject || isRunning}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select topic</option>
                    {filteredTopicsForTimer.map(topic => (
                      <option key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={timerNotes}
                  onChange={(e) => setTimerNotes(e.target.value)}
                  placeholder="What are you studying?"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Timer Controls */}
              <div className="flex space-x-3">
                {!isRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>Start</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePauseTimer}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors"
                    >
                      <Pause className="h-5 w-5" />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={handleStopTimer}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-colors"
                    >
                      <StopCircle className="h-5 w-5" />
                      <span>Stop & Save</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Study Session</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic *
                  </label>
                  <select
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                    disabled={!formData.subjectId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select topic</option>
                    {filteredTopicsForSubject.map(topic => (
                      <option key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Focus Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Level (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFormData({ ...formData, focus: rating })}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                        formData.focus === rating
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What did you study? Any key takeaways?"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSession}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudySession;
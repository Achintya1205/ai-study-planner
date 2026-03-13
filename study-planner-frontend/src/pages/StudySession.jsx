import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Plus, Trash2, Timer as TimerIcon } from 'lucide-react';
import { getSessions, createSession, deleteSession, getSessionStats, getSubjects, getTopics } from '../api/study.api';

function StudySession() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    duration: 0,
    notes: '',
    focus: 5,
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, statsRes, subjectsRes, topicsRes] = await Promise.all([
        getSessions(),
        getSessionStats(),
        getSubjects(),
        getTopics()
      ]);
      setSessions(sessionsRes.data || []);
      setStats(statsRes.data || {});
      setSubjects(subjectsRes.data || []);
      setTopics(topicsRes.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!currentSubject || !currentTopic) {
      setError('Please select subject and topic before starting');
      return;
    }
    setIsRunning(true);
    setError('');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStopAndSave = async () => {
    if (time === 0) {
      setError('No time to save');
      return;
    }

    if (!currentSubject || !currentTopic) {
      setError('Please select subject and topic');
      return;
    }

    try {
      const durationMinutes = Math.floor(time / 60);
      if (durationMinutes < 1) {
        setError('Session must be at least 1 minute');
        return;
      }

      await createSession({
        subject: currentSubject,
        topic: currentTopic,
        duration: durationMinutes,
        notes: '',
        focus: 5,
        date: new Date()
      });

      setIsRunning(false);
      setTime(0);
      setCurrentSubject('');
      setCurrentTopic('');
      await fetchData();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save session');
      console.error('Error saving session:', err);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.topic || formData.duration < 1) {
      setError('Subject, topic, and duration (min 1 min) are required');
      return;
    }

    try {
      await createSession(formData);
      await fetchData();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save session');
      console.error('Error saving session:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await deleteSession(id);
      await fetchData();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete session');
      console.error('Error deleting session:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      subject: '',
      topic: '',
      duration: 0,
      notes: '',
      focus: 5,
      date: new Date().toISOString().split('T')[0]
    });
    setError('');
  };

  const getFilteredTopics = (subjectId) => {
    return topics.filter(t => t.subject === subjectId || t.subject._id === subjectId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">⏱️ Study Session Tracker</h1>
        <p className="text-orange-50">Track your study time and focus</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.totalSessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats?.totalHours || 0}h {stats?.totalMinutes || 0}m
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Today's Sessions</p>
            <p className="text-2xl font-bold text-pink-600">{stats?.todaySessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Today's Time</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.todayMinutes || 0} min</p>
          </div>
        </div>

        {/* Timer Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-800 mb-4 font-mono">
              {formatTime(time)}
            </div>
            <p className="text-gray-500">
              {isRunning ? '🔴 Recording...' : time > 0 ? '⏸️ Paused' : '⏹️ Ready to Start'}
            </p>
          </div>

          {/* Subject and Topic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={currentSubject}
                onChange={(e) => {
                  setCurrentSubject(e.target.value);
                  setCurrentTopic('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isRunning}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={!currentSubject || isRunning}
              >
                <option value="">Select Topic</option>
                {getFilteredTopics(currentSubject).map(topic => (
                  <option key={topic._id} value={topic._id}>{topic.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition flex items-center gap-2"
              >
                <Pause className="h-5 w-5" />
                Pause
              </button>
            )}

            <button
              onClick={handleStopAndSave}
              disabled={time === 0}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square className="h-5 w-5" />
              Stop & Save
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Manual Entry
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Sessions</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center">
              <TimerIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No sessions yet</h3>
              <p className="text-gray-500">Start tracking your study time!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.slice(0, 10).map((session) => (
                <div key={session._id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-gray-800">{session.duration} minutes</span>
                      <span className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.subject?.name} • {session.topic?.name}
                    </div>
                    {session.notes && (
                      <div className="text-sm text-gray-500 mt-1">{session.notes}</div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < session.focus ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2">Focus: {session.focus}/5</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(session._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Manual Session Entry</h2>

            <form onSubmit={handleManualEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value, topic: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={!formData.subject}
                >
                  <option value="">Select Topic</option>
                  {getFilteredTopics(formData.subject).map(topic => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focus Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, focus: rating })}
                      className={`flex-1 py-2 rounded-lg font-semibold transition ${
                        formData.focus === rating
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="2"
                  placeholder="Optional notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudySession;
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getTopics, createTopic, updateTopic, deleteTopic, getSubjects } from '../api/study.api';

function Topics() {
  const [searchParams] = useSearchParams();
  const subjectIdFromUrl = searchParams.get('subject');

  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [filterSubject, setFilterSubject] = useState(subjectIdFromUrl || 'all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    description: '',
    difficulty: 'medium',
    score: 0
  });
  const [error, setError] = useState('');

  const difficultyColors = {
    easy: { bg: 'bg-green-100', text: 'text-green-700', badge: 'Easy' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'Medium' },
    hard: { bg: 'bg-red-100', text: 'text-red-700', badge: 'Hard' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (subjectIdFromUrl) {
      setFilterSubject(subjectIdFromUrl);
    }
  }, [subjectIdFromUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, subjectsRes] = await Promise.all([
        getTopics(),
        getSubjects()
      ]);
      setTopics(topicsRes.data || []);
      setSubjects(subjectsRes.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.subject) {
      setError('Topic name and subject are required');
      return;
    }

    try {
      if (editingTopic) {
        await updateTopic(editingTopic._id, {
          name: formData.name,
          description: formData.description,
          difficulty: formData.difficulty,
          score: formData.score
        });
      } else {
        await createTopic(formData);
      }

      await fetchData();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save topic');
      console.error('Error saving topic:', err);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      subject: topic.subject._id || topic.subject,
      name: topic.name,
      description: topic.description || '',
      difficulty: topic.difficulty,
      score: topic.score || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) {
      return;
    }

    try {
      await deleteTopic(id);
      await fetchData();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete topic');
      console.error('Error deleting topic:', err);
    }
  };

  const handleToggleWeak = async (topic) => {
    try {
      const newScore = topic.isWeak ? 70 : 50; // Toggle between weak/strong
      await updateTopic(topic._id, { score: newScore });
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update topic');
      console.error('Error updating topic:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTopic(null);
    setFormData({ subject: '', name: '', description: '', difficulty: 'medium', score: 0 });
    setError('');
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSubject = filterSubject === 'all' || (topic.subject?._id === filterSubject);
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'weak' && topic.isWeak) ||
      (filterStatus === 'strong' && !topic.isWeak);
    return matchesSubject && matchesStatus;
  });

  const weakTopicsCount = topics.filter(t => t.isWeak).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">📖 Study Topics</h1>
        <p className="text-purple-50">Track your progress across all topics</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Topics</p>
            <p className="text-2xl font-bold text-gray-800">{topics.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Weak Topics</p>
            <p className="text-2xl font-bold text-orange-600">{weakTopicsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Strong Topics</p>
            <p className="text-2xl font-bold text-emerald-600">{topics.length - weakTopicsCount}</p>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Subject
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="weak">Weak (&lt;60%)</option>
                  <option value="strong">Strong (≥60%)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition flex items-center gap-2 whitespace-nowrap w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Add Topic
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Topics List */}
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No topics found</h3>
            <p className="text-gray-500 mb-4">
              {topics.length === 0 
                ? 'Start by adding your first topic'
                : 'Try adjusting your filters'}
            </p>
            {topics.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
              >
                Add Your First Topic
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const diffColor = difficultyColors[topic.difficulty] || difficultyColors.medium;
              const subjectColor = topic.subject?.color || 'emerald';

              return (
                <div
                  key={topic._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{topic.name}</h3>
                      <p className="text-sm text-gray-500">
                        {topic.subject?.name || 'Unknown Subject'}
                      </p>
                    </div>
                    <span className={`${diffColor.bg} ${diffColor.text} text-xs px-2 py-1 rounded-full font-medium`}>
                      {diffColor.badge}
                    </span>
                  </div>

                  {topic.description && (
                    <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                  )}

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Score</span>
                      <span className={`font-semibold ${topic.isWeak ? 'text-orange-600' : 'text-emerald-600'}`}>
                        {topic.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${topic.isWeak ? 'bg-orange-500' : 'bg-emerald-500'} h-2 rounded-full`}
                        style={{ width: `${topic.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleWeak(topic)}
                      className={`flex-1 ${topic.isWeak ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition flex items-center justify-center gap-1`}
                      title={topic.isWeak ? 'Mark as Strong' : 'Mark as Weak'}
                    >
                      {topic.isWeak ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                      {topic.isWeak ? 'Weak' : 'Strong'}
                    </button>
                    <button
                      onClick={() => handleEdit(topic)}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingTopic ? 'Edit Topic' : 'Add New Topic'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  disabled={editingTopic !== null}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Quadratic Equations"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="2"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score (%)
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max="100"
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition"
                >
                  {editingTopic ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;
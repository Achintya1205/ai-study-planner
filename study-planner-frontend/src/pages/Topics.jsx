import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Filter } from 'lucide-react';
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
        await updateTopic(editingTopic._id, formData);
      } else {
        await createTopic(formData);
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save topic');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      subject: topic.subject?._id || topic.subject,
      name: topic.name,
      description: topic.description || '',
      difficulty: topic.difficulty,
      score: topic.score || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteTopic(id);
      await fetchData();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTopic(null);
    setFormData({ subject: '', name: '', description: '', difficulty: 'medium', score: 0 });
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSubject = filterSubject === 'all' || (topic.subject?._id === filterSubject);
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'weak' && topic.isWeak) || 
      (filterStatus === 'strong' && !topic.isWeak);
    return matchesSubject && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8 w-full">
      {/* Header - Full Width */}
      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">📖 Study Topics</h1>
        <p className="text-purple-50">Track your progress logically</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Total Topics</p>
            <p className="text-2xl font-bold">{topics.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Weak</p>
            <p className="text-2xl font-bold text-orange-600">{topics.filter(t => t.isWeak).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Strong</p>
            <p className="text-2xl font-bold text-emerald-600">{topics.filter(t => !t.isWeak).length}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-end">
          <div className="flex flex-1 gap-4 w-full">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full border p-2 rounded-lg">
                <option value="all">All Subjects</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border p-2 rounded-lg">
                <option value="all">All Status</option>
                <option value="weak">Weak</option>
                <option value="strong">Strong</option>
              </select>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <Plus size={20}/> Add Topic
          </button>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const diff = difficultyColors[topic.difficulty] || difficultyColors.medium;
            return (
              <div key={topic._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{topic.name}</h3>
                    <p className="text-xs text-purple-600 font-semibold">{topic.subject?.name}</p>
                  </div>
                  <span className={`${diff.bg} ${diff.text} text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold`}>
                    {diff.badge}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Mastery</span>
                    <span className="font-bold">{topic.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    topic.difficulty === 'hard' ? 'bg-red-500' : 
                    topic.difficulty === 'medium' ? 'bg-orange-500' : 
                    'bg-emerald-500'
                  }`} 
                   style={{ width: `${topic.score}%` }}
                ></div>
              </div>
            </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(topic)} className="flex-1 flex justify-center items-center gap-2 bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition">
                    <Edit2 size={16}/> Edit
                  </button>
                  <button onClick={() => handleDelete(topic._id)} className="p-2 text-red-400 hover:text-red-600 transition">
                    <Trash2 size={18}/>
                  </button>
                  </div>
                </div>
             );
          })}
        </div>
      </div>

      {/* Modal - Same as your original */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingTopic ? 'Edit Topic' : 'New Topic'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <select 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Topic Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="e.g. Calculus"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Score (%)</label>
                <input 
                  type="number" 
                  value={formData.score} 
                  onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-purple-500 outline-none"
                  min="0" max="100"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;
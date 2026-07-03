import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getTopics, createTopic, updateTopic, deleteTopic, getSubjects } from '../api/study.api';
import { APP_THEMES, DIFFICULTY_COLORS } from '../constants/colors';

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
    score: 0
  });
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, subjectsRes] = await Promise.all([getTopics(), getSubjects()]);
      setTopics(topicsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await updateTopic(editingTopic._id, formData);
      } else {
        await createTopic(formData);
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save topic');
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      subject: topic.subject?._id || topic.subject,
      name: topic.name,
      description: topic.description || '',
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
    setFormData({ subject: '', name: '', description: '', score: 0 });
  };

  // Updated Filtering and Sorting
  const filteredTopics = topics
    .filter(topic => {
      const matchesSubject = filterSubject === 'all' || (topic.subject?._id === filterSubject);
      // Strong = Easy (>= 80)
      // Weak = Medium or Hard (< 80)    
      const isEasy = topic.difficulty === 'easy';
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'strong' && isEasy) || 
        (filterStatus === 'weak' && !isEasy);
        
      return matchesSubject && matchesStatus;
    })
    // Sort by Score (Highest to Lowest)
    .sort((a, b) => b.score - a.score);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">📖 Study Topics</h1>
        <p className="text-purple-50">Track your progress across all topics</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 font-medium">Total Topics</p>
            <p className="text-2xl font-bold text-gray-800">{topics.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 font-medium">Weak (Med/Hard)</p>
            <p className="text-2xl font-bold text-orange-600">{topics.filter(t => t.difficulty !== 'easy').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 font-medium">Strong (Easy)</p>
            <p className="text-2xl font-bold text-emerald-600">{topics.filter(t => t.difficulty === 'easy').length}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-end">
          <div className="flex flex-1 gap-4 w-full">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full border p-2 rounded-lg mt-1 outline-none">
                <option value="all">All Subjects</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border p-2 rounded-lg mt-1 outline-none">
                <option value="all">All Status</option>
                <option value="strong">Strong (Easy)</option>
                <option value="weak">Weak (Medium/Hard)</option>
              </select>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 transition">
            <Plus size={20}/> Add Topic
          </button>
        </div>

        {/* Topics List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const diff = DIFFICULTY_COLORS[topic.difficulty] || DIFFICULTY_COLORS.medium;
            const theme = APP_THEMES[topic.subject?.color] || APP_THEMES.gray;

            return (
              <div 
                key={topic._id} 
                className={`bg-white rounded-xl shadow-md border-t-4 ${theme.border} py-8 px-5 flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{topic.name}</h3>
                    <p className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>
                      {topic.subject?.name}
                    </p>
                  </div>
                  <span className={`${diff.bg} ${diff.text} text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold`}>
                    {diff.badge}
                  </span>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">
                      Mastery
                    </span>

                <div className="flex items-center gap-2">
                  <span className="font-bold">{topic.score}%</span>

                    {topic.scoreSource === "tests" && topic.trend !== 0 && (
                      <span
                        className={`text-xs font-bold ${
                          topic.trend > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {topic.trend > 0 ? `▲ ${topic.trend}%` : `▼ ${Math.abs(topic.trend)}%`}
                      </span>
                    )}
                </div>
              </div>
                <p className="text-xs text-gray-400 mb-2">
                  Source: {topic.scoreSource === "manual"
                  ? "Self Assessment"
                  : "Last 3 Tests"}
                </p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${
                        topic.difficulty === 'easy' ? 'bg-emerald-500' : 
                        topic.difficulty === 'medium' ? 'bg-orange-500' : 
                        'bg-red-500'
                      }`} 
                      style={{ width: `${topic.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-50">
                  <button onClick={() => handleEdit(topic)} className="flex-1 flex justify-center items-center gap-2 bg-gray-50 text-gray-600 py-2.5 rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
                    <Edit2 size={14}/> Edit
                  </button>
                  <button onClick={() => handleDelete(topic._id)} className="p-2.5 text-red-400 hover:text-red-600 transition bg-red-50/50 rounded-lg">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingTopic ? 'Edit Topic' : 'New Topic'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <select 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none"
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
                  className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Initial Self Assessment (%)</label>
                <input 
                  type="number" 
                  
                  // parse the value as an integer. If the input is empty, set it to 0.
                  value={formData.score === 0 ? "" : formData.score} 
                  placeholder="0"
                  disabled={editingTopic && formData.scoreSource === "tests"}
                  onChange={(e) => setFormData({...formData, score: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none"
                  min="0" max="100"
                />
                {editingTopic && formData.scoreSource === "tests" && (
                  <p className="text-xs text-gray-500 mt-2">
                    This score is automatically calculated from your latest 3 tests.
                  </p>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookMarked, TrendingUp, AlertCircle, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getSubjects, createSubject, updateSubject, deleteSubject, analyzeSubject } from '../api/study.api';

function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'emerald',
    targetScore: '' 
  });
  const [error, setError] = useState('');

  // AI-specific state tracking
  const [aiPlans, setAiPlans] = useState({}); // Stores plans keyed by subject ID: { [subjectId]: "plan text" }
  const [loadingAi, setLoadingAi] = useState({}); // Stores loading states keyed by subject ID: { [subjectId]: true/false }

  const colors = [
    { name: 'emerald', class: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
    { name: 'purple', class: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' },
    { name: 'cyan', class: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600' },
    { name: 'orange', class: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
    { name: 'indigo', class: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600' },
    { name: 'pink', class: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600' }
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      setSubjects(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  // Triggers backend Gemini Engine
  const handleAnalyzeSubject = async (subjectId) => {
  const selectedSubject = subjects.find(s => s._id === subjectId);
  const progress = selectedSubject?.currentScore || 0;
  const target = selectedSubject?.targetScore || 80;

  if (progress >= target) {
    alert(`🎉 Celebration! You have already achieved or surpassed your goal of ${target}% for this subject. No emergency roadmap needed!`);
    return; 
  }
  
  setLoadingAi(prev => ({ ...prev, [subjectId]: true }));
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/subjects/${subjectId}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      setAiPlans(prev => ({ ...prev, [subjectId]: result.studyPlan }));
    } else {
      alert(result.message || 'Failed to generate study roadmap.');
    }
  } catch (err) {
    console.error('AI Request Error:', err);
    alert('Server communication error loading AI coach.');
  } finally {
    setLoadingAi(prev => ({ ...prev, [subjectId]: false }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Subject name is required');
      return;
    }

    const score = parseInt(formData.targetScore);
    if (formData.targetScore === '' || isNaN(score) || score < 1 || score > 100) {
      setError('Please set a target score between 1 and 100%');
      return;
    }

    try {
      if (editingSubject) {
        await updateSubject(editingSubject._id, formData);
      } else {
        await createSubject(formData);
      }
      
      await fetchSubjects();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || '',
      color: subject.color,
      targetScore: subject.targetScore
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      await fetchSubjects();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete subject');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '', color: 'emerald', targetScore: '' });
    setError('');
  };

  const getColorClasses = (colorName) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTopics = subjects.reduce((sum, s) => sum + (s.topics?.length || 0), 0);
  const avgProgress = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.currentScore || 0), 0) / subjects.length)
    : 0;
  const weakSubjects = subjects.filter(s => (s.currentScore || 0) < 60).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">📚 My Subjects</h1>
        <p className="text-emerald-50">Manage your learning subjects</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center md:text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
              </div>
              <BookMarked className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center md:text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Topics</p>
                <p className="text-2xl font-bold text-gray-800">{totalTopics}</p>
              </div>
              <BookMarked className="h-8 w-8 text-cyan-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center md:text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-800">{avgProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center md:text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weak Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{weakSubjects}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Add Subject
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const colorClasses = getColorClasses(subject.color);
            const progress = subject.currentScore || 0;
            const target = subject.targetScore || '';
            
            const isGoalHit = progress >= target;
            const barFillColor = isGoalHit ? 'bg-emerald-500' : 'bg-orange-500';
            
            const isSubjectAiLoading = loadingAi[subject._id] || false;
            const contextPlan = aiPlans[subject._id] || '';

            return (
              <div key={subject._id} className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between">
                <div>
                  <div className={`${colorClasses.class} p-4 rounded-t-lg flex justify-between items-start`}>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{subject.name}</h3>
                      <p className="text-white text-opacity-90 text-sm">{subject.description || 'No description'}</p>
                    </div>
                    {/* Floating Action AI trigger */}
                    <button
                      onClick={() => handleAnalyzeSubject(subject._id)}
                      disabled={isSubjectAiLoading}
                      title="Analyze with AI Coach"
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition disabled:opacity-50"
                    >
                      <Sparkles className={`h-5 w-5 ${isSubjectAiLoading ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Mastery: {progress}%</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isGoalHit ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          Goal: {target}%
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`${barFillColor} h-2.5 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {/* Embedded Dynamic AI Display Container */}
                  {contextPlan && (
                    <div className="mb-4 p-4 bg-slate-900 rounded-lg text-slate-200 text-xs border border-purple-500/30 max-h-48 overflow-y-auto shadow-inner">
                      <div className="flex items-center gap-1.5 border-b border-slate-700 pb-1.5 mb-2 font-semibold text-purple-400">
                        <span>🧠</span>
                        <span>3-Day AI Recovery Roadmap</span>
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-300 space-y-1 leading-relaxed">
                        <ReactMarkdown>{contextPlan}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/topics?subject=${subject._id}`)}
                      className={`flex-1 ${colorClasses.light} ${colorClasses.text} px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition`}
                    >
                      View Topics
                    </button>
                    <button onClick={() => handleEdit(subject)} className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(subject._id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`${color.class} h-10 rounded-lg transition ${
                        formData.color === color.name ? 'ring-4 ring-offset-2 ring-gray-400' : 'hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal (%)</label>
                <input
                  type="number"
                  value={formData.targetScore || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, targetScore: val === '' ? '' : parseInt(val) });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 85"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition">
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
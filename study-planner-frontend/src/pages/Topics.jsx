import { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Filter,
  TrendingDown,
  Target
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Topics() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectIdFromUrl = searchParams.get('subject');
  
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subjectIdFromUrl || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, weak, strong
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjectId: '',
    difficulty: 'medium',
    isWeak: false,
    lastStudied: '',
    score: 0
  });

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'hard', label: 'Hard', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  // Load dummy data on mount
  useEffect(() => {
    loadSubjects();
    loadTopics();
  }, []);

  const loadSubjects = () => {
    // Dummy subjects (should match Subjects.jsx data)
    const dummySubjects = [
      { id: 1, name: 'Mathematics', color: 'emerald' },
      { id: 2, name: 'Physics', color: 'purple' },
      { id: 3, name: 'Chemistry', color: 'cyan' },
      { id: 4, name: 'Computer Science', color: 'orange' }
    ];
    setSubjects(dummySubjects);
    
    // Set initial subject if from URL
    if (subjectIdFromUrl && !formData.subjectId) {
      setFormData(prev => ({ ...prev, subjectId: subjectIdFromUrl }));
    }
  };

  const loadTopics = () => {
    // Dummy topics data
    const dummyTopics = [
      {
        id: 1,
        name: 'Calculus - Integration',
        description: 'Integration techniques, definite and indefinite integrals',
        subjectId: '1',
        subjectName: 'Mathematics',
        difficulty: 'hard',
        isWeak: true,
        score: 45,
        lastStudied: '2024-01-15'
      },
      {
        id: 2,
        name: 'Calculus - Differentiation',
        description: 'Basic differentiation rules and applications',
        subjectId: '1',
        subjectName: 'Mathematics',
        difficulty: 'medium',
        isWeak: false,
        score: 78,
        lastStudied: '2024-01-20'
      },
      {
        id: 3,
        name: 'Linear Algebra',
        description: 'Matrices, vectors, eigenvalues',
        subjectId: '1',
        subjectName: 'Mathematics',
        difficulty: 'hard',
        isWeak: true,
        score: 52,
        lastStudied: '2024-01-18'
      },
      {
        id: 4,
        name: 'Electromagnetism',
        description: 'Electric and magnetic fields, Maxwell equations',
        subjectId: '2',
        subjectName: 'Physics',
        difficulty: 'hard',
        isWeak: true,
        score: 48,
        lastStudied: '2024-01-16'
      },
      {
        id: 5,
        name: 'Mechanics - Kinematics',
        description: 'Motion, velocity, acceleration',
        subjectId: '2',
        subjectName: 'Physics',
        difficulty: 'easy',
        isWeak: false,
        score: 85,
        lastStudied: '2024-01-22'
      },
      {
        id: 6,
        name: 'Organic Chemistry - Reactions',
        description: 'SN1, SN2, E1, E2 mechanisms',
        subjectId: '3',
        subjectName: 'Chemistry',
        difficulty: 'hard',
        isWeak: true,
        score: 50,
        lastStudied: '2024-01-14'
      },
      {
        id: 7,
        name: 'Data Structures - Trees',
        description: 'Binary trees, BST, AVL, heaps',
        subjectId: '4',
        subjectName: 'Computer Science',
        difficulty: 'medium',
        isWeak: false,
        score: 72,
        lastStudied: '2024-01-19'
      },
      {
        id: 8,
        name: 'Algorithms - Sorting',
        description: 'Quick sort, merge sort, heap sort',
        subjectId: '4',
        subjectName: 'Computer Science',
        difficulty: 'medium',
        isWeak: false,
        score: 80,
        lastStudied: '2024-01-21'
      }
    ];
    setTopics(dummyTopics);
  };

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || topic.subjectId === selectedSubject;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'weak' && topic.isWeak) ||
                         (filterStatus === 'strong' && !topic.isWeak);
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const handleAddTopic = () => {
    if (!formData.name.trim() || !formData.subjectId) {
      alert('Please enter topic name and select a subject');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const subject = subjects.find(s => s.id.toString() === formData.subjectId);
      const newTopic = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        subjectId: formData.subjectId,
        subjectName: subject?.name || '',
        difficulty: formData.difficulty,
        isWeak: formData.score < 60,
        score: formData.score,
        lastStudied: formData.lastStudied || new Date().toISOString().split('T')[0]
      };

      setTopics([...topics, newTopic]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleUpdateTopic = () => {
    if (!formData.name.trim() || !formData.subjectId) {
      alert('Please enter topic name and select a subject');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const subject = subjects.find(s => s.id.toString() === formData.subjectId);
      setTopics(topics.map(topic =>
        topic.id === editingTopic.id
          ? { 
              ...topic, 
              ...formData,
              subjectName: subject?.name || topic.subjectName,
              isWeak: formData.score < 60
            }
          : topic
      ));
      setEditingTopic(null);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleDeleteTopic = (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      setTopics(topics.filter(topic => topic.id !== id));
    }
  };

  const toggleWeakStatus = (id) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, isWeak: !topic.isWeak } : topic
    ));
  };

  const openEditModal = (topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      subjectId: topic.subjectId,
      difficulty: topic.difficulty,
      isWeak: topic.isWeak,
      score: topic.score,
      lastStudied: topic.lastStudied
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subjectId: selectedSubject !== 'all' ? selectedSubject : '',
      difficulty: 'medium',
      isWeak: false,
      score: 0,
      lastStudied: ''
    });
  };

  const getDifficultyStyle = (difficulty) => {
    return difficultyOptions.find(d => d.value === difficulty) || difficultyOptions[1];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: topics.length,
    weak: topics.filter(t => t.isWeak).length,
    bySubject: selectedSubject === 'all' ? topics.length : topics.filter(t => t.subjectId === selectedSubject).length,
    avgScore: topics.length > 0 ? Math.round(topics.reduce((sum, t) => sum + t.score, 0) / topics.length) : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/subjects')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Subjects</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Topic</span>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Topics Management 📖</h1>
            <p className="text-purple-50">Master individual topics across all subjects</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Topics</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <BookMarked className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Weak Topics</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.weak}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Score</p>
                <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.avgScore)}`}>
                  {stats.avgScore}%
                </p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <Target className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Filtered View</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{filteredTopics.length}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Filter className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Topics
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Topics</option>
                <option value="weak">Weak Topics Only</option>
                <option value="strong">Strong Topics Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Topics List */}
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookMarked className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedSubject !== 'all' || filterStatus !== 'all' 
                ? 'No topics found' 
                : 'No topics yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedSubject !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first topic'}
            </p>
            {!searchQuery && selectedSubject === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Topic</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const difficultyStyle = getDifficultyStyle(topic.difficulty);
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex items-start justify-between">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{topic.name}</h3>
                        {topic.isWeak && (
                          <span className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold">
                            <AlertCircle className="h-3 w-3" />
                            <span>Weak</span>
                          </span>
                        )}
                        <span className={`px-3 py-1 ${difficultyStyle.bg} ${difficultyStyle.color} rounded-full text-xs font-semibold`}>
                          {difficultyStyle.label}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{topic.description || 'No description'}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="font-medium text-purple-600">{topic.subjectName}</span>
                        <span>Last studied: {new Date(topic.lastStudied).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Right Section - Score & Actions */}
                    <div className="flex items-start space-x-4 ml-6">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(topic.score)}`}>
                          {topic.score}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Score</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => toggleWeakStatus(topic.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            topic.isWeak 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          }`}
                          title={topic.isWeak ? 'Mark as strong' : 'Mark as weak'}
                        >
                          {topic.isWeak ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => openEditModal(topic)}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTopic) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTopic(null);
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
              {/* Topic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Calculus - Integration"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the topic..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {difficultyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Studied Date
                </label>
                <input
                  type="date"
                  value={formData.lastStudied}
                  onChange={(e) => setFormData({ ...formData, lastStudied: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Topics with score below 60% are automatically marked as weak topics.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTopic(null);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingTopic ? 'Update' : 'Add'} Topic</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;
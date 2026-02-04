import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Search,
  BookMarked,
  TrendingUp
} from 'lucide-react';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'emerald',
    targetScore: 80
  });

  // Color options matching your theme
  const colorOptions = [
    { name: 'emerald', class: 'from-emerald-500 to-cyan-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { name: 'purple', class: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    { name: 'cyan', class: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
    { name: 'orange', class: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    { name: 'indigo', class: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { name: 'pink', class: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', text: 'text-pink-600' }
  ];

  // Load dummy data on mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    // Dummy data (replace with API call later)
    const dummySubjects = [
      {
        id: 1,
        name: 'Mathematics',
        description: 'Calculus, Algebra, Trigonometry',
        color: 'emerald',
        targetScore: 85,
        currentScore: 78,
        topicsCount: 12,
        weakTopicsCount: 3
      },
      {
        id: 2,
        name: 'Physics',
        description: 'Mechanics, Electromagnetism, Thermodynamics',
        color: 'purple',
        targetScore: 80,
        currentScore: 72,
        topicsCount: 10,
        weakTopicsCount: 2
      },
      {
        id: 3,
        name: 'Chemistry',
        description: 'Organic, Inorganic, Physical Chemistry',
        color: 'cyan',
        targetScore: 90,
        currentScore: 85,
        topicsCount: 15,
        weakTopicsCount: 1
      },
      {
        id: 4,
        name: 'Computer Science',
        description: 'Data Structures, Algorithms, OOP',
        color: 'orange',
        targetScore: 88,
        currentScore: 82,
        topicsCount: 8,
        weakTopicsCount: 2
      }
    ];
    setSubjects(dummySubjects);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = () => {
    if (!formData.name.trim()) {
      alert('Please enter a subject name');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newSubject = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        targetScore: formData.targetScore,
        currentScore: 0,
        topicsCount: 0,
        weakTopicsCount: 0
      };

      setSubjects([...subjects, newSubject]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleUpdateSubject = () => {
    if (!formData.name.trim()) {
      alert('Please enter a subject name');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubjects(subjects.map(subject =>
        subject.id === editingSubject.id
          ? { ...subject, ...formData }
          : subject
      ));
      setEditingSubject(null);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all related topics and data.')) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      color: subject.color,
      targetScore: subject.targetScore
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: 'emerald',
      targetScore: 80
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingSubject(null);
    resetForm();
  };

  const getColorClass = (colorName) => {
    return colorOptions.find(c => c.name === colorName) || colorOptions[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Subjects 📚</h1>
              <p className="text-emerald-50">Manage your learning subjects and track progress</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Subject</span>
            </button>
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
                <p className="text-gray-500 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{subjects.length}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Topics</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {subjects.reduce((sum, s) => sum + s.topicsCount, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <BookMarked className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {subjects.length > 0
                    ? Math.round(subjects.reduce((sum, s) => sum + s.currentScore, 0) / subjects.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Weak Topics</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {subjects.reduce((sum, s) => sum + s.weakTopicsCount, 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No subjects found' : 'No subjects yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first subject'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Subject</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const colorClass = getColorClass(subject.color);
              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${colorClass.class} p-6 text-white`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{subject.name}</h3>
                        <p className="text-sm text-white/80 line-clamp-2">
                          {subject.description || 'No description'}
                        </p>
                      </div>
                      <BookOpen className="h-6 w-6 text-white/80" />
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/90">Progress</span>
                        <span className="font-semibold">{subject.currentScore}% / {subject.targetScore}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${(subject.currentScore / subject.targetScore) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{subject.topicsCount}</p>
                        <p className="text-sm text-gray-500">Topics</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${subject.weakTopicsCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {subject.weakTopicsCount}
                        </p>
                        <p className="text-sm text-gray-500">Weak Topics</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(subject)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSubject) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics, Physics, History"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of topics covered..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.color === color.name
                          ? 'border-gray-900 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-8 w-full bg-gradient-to-r ${color.class} rounded-md`}></div>
                      <p className="text-xs text-gray-600 mt-2 capitalize">{color.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.targetScore}
                  onChange={(e) => setFormData({ ...formData, targetScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSubject ? handleUpdateSubject : handleAddSubject}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingSubject ? 'Update' : 'Add'} Subject</span>
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

export default Subjects;
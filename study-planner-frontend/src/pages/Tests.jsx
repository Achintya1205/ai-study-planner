import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

function Tests() {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date'); 
  
  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    topicId: '',
    score: 0,
    maxScore: 100,
    date: '',
    notes: ''
  });

  useEffect(() => {
    loadSubjects();
    loadTopics();
    loadTests();
  }, []);

  const filteredTopicsForSubject = topics.filter(topic => 
    formData.subjectId ? topic.subjectId === formData.subjectId : true
  );

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

  const loadTests = () => {
    const dummyTests = [
      {
        id: 1,
        name: 'Integration Quiz 1',
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '1',
        topicName: 'Calculus - Integration',
        score: 45,
        maxScore: 100,
        percentage: 45,
        date: '2024-01-15',
        notes: 'Struggled with substitution method'
      },
      {
        id: 2,
        name: 'Differentiation Test',
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '2',
        topicName: 'Calculus - Differentiation',
        score: 78,
        maxScore: 100,
        percentage: 78,
        date: '2024-01-20',
        notes: 'Good understanding of chain rule'
      },
      {
        id: 3,
        name: 'Linear Algebra Midterm',
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '3',
        topicName: 'Linear Algebra',
        score: 52,
        maxScore: 100,
        percentage: 52,
        date: '2024-01-18',
        notes: 'Need to review eigenvalues'
      },
      {
        id: 4,
        name: 'EM Quiz',
        subjectId: '2',
        subjectName: 'Physics',
        topicId: '4',
        topicName: 'Electromagnetism',
        score: 48,
        maxScore: 100,
        percentage: 48,
        date: '2024-01-16',
        notes: 'Maxwell equations confusing'
      },
      {
        id: 5,
        name: 'Kinematics Practice Test',
        subjectId: '2',
        subjectName: 'Physics',
        topicId: '5',
        topicName: 'Mechanics - Kinematics',
        score: 85,
        maxScore: 100,
        percentage: 85,
        date: '2024-01-22',
        notes: 'Strong performance'
      },
      {
        id: 6,
        name: 'Organic Reactions Quiz',
        subjectId: '3',
        subjectName: 'Chemistry',
        topicId: '6',
        topicName: 'Organic Chemistry - Reactions',
        score: 50,
        maxScore: 100,
        percentage: 50,
        date: '2024-01-14',
        notes: 'SN1/SN2 mechanisms unclear'
      },
      {
        id: 7,
        name: 'Trees Implementation Test',
        subjectId: '4',
        subjectName: 'Computer Science',
        topicId: '7',
        topicName: 'Data Structures - Trees',
        score: 72,
        maxScore: 100,
        percentage: 72,
        date: '2024-01-19',
        notes: 'AVL rotations need practice'
      },
      {
        id: 8,
        name: 'Sorting Algorithms Quiz',
        subjectId: '4',
        subjectName: 'Computer Science',
        topicId: '8',
        topicName: 'Algorithms - Sorting',
        score: 92,
        maxScore: 100,
        percentage: 92,
        date: '2024-01-21',
        notes: 'Excellent understanding'
      },
      {
        id: 9,
        name: 'Integration Quiz 2',
        subjectId: '1',
        subjectName: 'Mathematics',
        topicId: '1',
        topicName: 'Calculus - Integration',
        score: 58,
        maxScore: 100,
        percentage: 58,
        date: '2024-01-25',
        notes: 'Improving but still weak'
      },
      {
        id: 10,
        name: 'Comprehensive Physics Test',
        subjectId: '2',
        subjectName: 'Physics',
        topicId: '4',
        topicName: 'Electromagnetism',
        score: 55,
        maxScore: 100,
        percentage: 55,
        date: '2024-01-23',
        notes: 'Better than last time'
      }
    ];
    setTests(dummyTests);
  };

  const filteredTests = tests
    .filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || test.subjectId === selectedSubject;
      const matchesTopic = selectedTopic === 'all' || test.topicId === selectedTopic;
      return matchesSearch && matchesSubject && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'score') {
        return b.percentage - a.percentage;
      }
      return 0;
    });

  const handleAddTest = () => {
    if (!formData.name.trim() || !formData.subjectId || !formData.topicId) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const subject = subjects.find(s => s.id.toString() === formData.subjectId);
      const topic = topics.find(t => t.id.toString() === formData.topicId);
      const percentage = Math.round((formData.score / formData.maxScore) * 100);

      const newTest = {
        id: Date.now(),
        name: formData.name,
        subjectId: formData.subjectId,
        subjectName: subject?.name || '',
        topicId: formData.topicId,
        topicName: topic?.name || '',
        score: formData.score,
        maxScore: formData.maxScore,
        percentage: percentage,
        date: formData.date || new Date().toISOString().split('T')[0],
        notes: formData.notes
      };

      setTests([newTest, ...tests]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleUpdateTest = () => {
    if (!formData.name.trim() || !formData.subjectId || !formData.topicId) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const subject = subjects.find(s => s.id.toString() === formData.subjectId);
      const topic = topics.find(t => t.id.toString() === formData.topicId);
      const percentage = Math.round((formData.score / formData.maxScore) * 100);

      setTests(tests.map(test =>
        test.id === editingTest.id
          ? {
              ...test,
              name: formData.name,
              subjectId: formData.subjectId,
              subjectName: subject?.name || test.subjectName,
              topicId: formData.topicId,
              topicName: topic?.name || test.topicName,
              score: formData.score,
              maxScore: formData.maxScore,
              percentage: percentage,
              date: formData.date,
              notes: formData.notes
            }
          : test
      ));
      setEditingTest(null);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleDeleteTest = (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      setTests(tests.filter(test => test.id !== id));
    }
  };

  const openEditModal = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      subjectId: test.subjectId,
      topicId: test.topicId,
      score: test.score,
      maxScore: test.maxScore,
      date: test.date,
      notes: test.notes
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subjectId: '',
      topicId: '',
      score: 0,
      maxScore: 100,
      date: '',
      notes: ''
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50';
    if (percentage >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const stats = {
    total: tests.length,
    avgScore: tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + t.percentage, 0) / tests.length) : 0,
    passed: tests.filter(t => t.percentage >= 60).length,
    failed: tests.filter(t => t.percentage < 60).length,
    filtered: filteredTests.length
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Test & Quiz Tracker 📝</h1>
              <p className="text-cyan-50">Track your test scores and identify weak areas</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Test Result</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Score</p>
                <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.avgScore)}`}>
                  {stats.avgScore}%
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Passed (≥60%)</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.passed}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Failed (&lt;60%)</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.failed}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Filtered View</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.filtered}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Filter className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tests
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
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
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic('all');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                disabled={selectedSubject === 'all'}
              >
                <option value="all">All Topics</option>
                {topics
                  .filter(topic => selectedSubject === 'all' || topic.subjectId === selectedSubject)
                  .map(topic => (
                    <option key={topic.id} value={topic.id.toString()}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="date">Date (Newest First)</option>
                <option value="score">Score (Highest First)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedSubject !== 'all' || selectedTopic !== 'all'
                ? 'No tests found'
                : 'No tests recorded yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedSubject !== 'all' || selectedTopic !== 'all'
                ? 'Try adjusting your filters'
                : 'Start tracking your test scores and performance'}
            </p>
            {!searchQuery && selectedSubject === 'all' && selectedTopic === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Test</span>
              </button>
            )}
          </div>
        ):(
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{test.name}</h3>
                      <span className={`px-3 py-1 ${getScoreBgColor(test.percentage)} ${getScoreColor(test.percentage)} rounded-full text-xs font-semibold`}>
                        {test.percentage >= 60 ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm mb-3">
                      <span className="font-medium text-cyan-600">{test.subjectName}</span>
                      <span className="text-gray-500">{test.topicName}</span>
                      <span className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(test.date).toLocaleDateString()}
                      </span>
                    </div>

                    {test.notes && (
                      <p className="text-gray-600 text-sm italic">"{test.notes}"</p>
                    )}
                  </div>

                  {/* Right Section*/}
                  <div className="flex items-start space-x-4 ml-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(test.percentage)}`}>
                        {test.percentage}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {test.score}/{test.maxScore}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => openEditModal(test)}
                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Edit test"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete test"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTest) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingTest ? 'Edit Test Result' : 'Add Test Result'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTest(null);
                    resetForm();
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test/Quiz Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Midterm Exam, Chapter 5 Quiz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
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
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    disabled={!formData.subjectId}
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Score *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Score *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percentage
                  </label>
                  <div className={`w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-center font-bold text-xl ${getScoreColor(Math.round((formData.score / formData.maxScore) * 100))}`}>
                    {formData.maxScore > 0 ? Math.round((formData.score / formData.maxScore) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What did you learn? What needs improvement?"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none" />
              </div>
              <div className={`p-4 rounded-lg ${getScoreBgColor(Math.round((formData.score / formData.maxScore) * 100))}`}>
                <p className={`text-sm font-medium ${getScoreColor(Math.round((formData.score / formData.maxScore) * 100))}`}>
                  {formData.maxScore > 0 && Math.round((formData.score / formData.maxScore) * 100) >= 60 
                    ? '✓ Passing grade - Good job!' 
                    : formData.maxScore > 0 
                    ? '⚠ Below 60% - This topic needs more attention'
                    : 'Enter your scores to see performance'}
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTest(null);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50" >
                    Cancel
                </button>
                <button
                  onClick={editingTest ? handleUpdateTest : handleAddTest}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ):( <> <Save className="h-5 w-5" />
                      <span>{editingTest ? 'Update' : 'Add'} Test</span>
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

export default Tests;
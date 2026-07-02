import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, BarChart2 } from 'lucide-react';
import { getTests, createTest, updateTest, deleteTest, getSubjects, getTopics } from '../api/study.api';

function Tests() {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formData, setFormData] = useState({
    subject: '', topic: '', name: '', score: 0, maxScore: 100,
    date: new Date().toISOString().split('T')[0], notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [testsRes, subjectsRes, topicsRes] = await Promise.all([
        getTests(), getSubjects(), getTopics()
      ]);
      setTests(testsRes.data || []);
      setSubjects(subjectsRes.data || []);
      setTopics(topicsRes.data || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Logic for the Sidebar Proficiency
  const subjectStats = subjects.map(sub => {
    const subTests = tests.filter(t => (t.subject?._id || t.subject) === sub._id);
    const avg = subTests.length > 0 
      ? Math.round(subTests.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / subTests.length)
      : 0;
    return { name: sub.name, avg, count: subTests.length };
  }).filter(s => s.count > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingTest) await updateTest(editingTest._id, formData);
      else await createTest(formData);
      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save test');
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      subject: test.subject?._id || test.subject,
      topic: test.topic?._id || test.topic,
      name: test.name,
      score: test.score,
      maxScore: test.maxScore,
      date: test.date ? new Date(test.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: test.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await deleteTest(id);
      await fetchData();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTest(null);
    setFormData({
      subject: '', topic: '', name: '', score: 0, maxScore: 100,
      date: new Date().toISOString().split('T')[0], notes: ''
    });
    setError('');
  };

  const getFilteredTopicsForForm = () => {
    if (formData.subject) {
      return topics.filter(t => (t.subject?._id || t.subject) === formData.subject);
    }
    return [];
  };

  const filteredTests = tests.filter(test => {
    const matchesSubject = filterSubject === 'all' || (test.subject?._id === filterSubject);
    const matchesTopic = filterTopic === 'all' || (test.topic?._id === filterTopic);
    return matchesSubject && matchesTopic;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    return (b.percentage || 0) - (a.percentage || 0);
  });

  const totalTests = tests.length;
  const avgProficiencyTotal = totalTests > 0 
    ? Math.round(tests.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalTests) 
    : 0;
  const passedCount = tests.filter(t => (t.percentage || 0) >= 60).length;
  const failedCount = totalTests - passedCount;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">📝 Test History</h1>
        <p className="text-indigo-100">Review your past academic performance</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        
        {/* Stats Row Restored */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-indigo-500">
            <p className="text-xs text-gray-400 font-bold uppercase">Total Taken</p>
            <p className="text-2xl font-bold text-gray-800">{totalTests}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-indigo-400">
            <p className="text-xs text-indigo-400 font-bold uppercase">Avg. Proficiency</p>
            <p className="text-2xl font-bold text-indigo-600">{avgProficiencyTotal}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-emerald-500">
            <p className="text-xs text-emerald-400 font-bold uppercase">Passed (≥60%)</p>
            <p className="text-2xl font-bold text-emerald-600">{passedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-red-500">
            <p className="text-xs text-red-400 font-bold uppercase">Failed (&lt;60%)</p>
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-3">
            {/* Filters Bar Restored */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
                  <select 
                    value={filterSubject} 
                    onChange={(e) => { setFilterSubject(e.target.value); setFilterTopic('all'); }} 
                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Topic</label>
                  <select 
                    value={filterTopic} 
                    onChange={(e) => setFilterTopic(e.target.value)} 
                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="all">All Topics</option>
                    {topics
                      .filter(t => filterSubject === 'all' || (t.subject?._id || t.subject) === filterSubject)
                      .map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Sort</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border p-2 rounded-lg mt-1 outline-none">
                    <option value="date">Newest First</option>
                    <option value="score">Highest Score</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 h-10 transition shadow-lg shadow-indigo-100">
                <Plus size={18} /> Add Result
              </button>
            </div>

            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-4 text-left">Test Name</th>
                        <th className="px-6 py-4 text-left">Subject / Topic</th>
                        <th className="px-6 py-4 text-left">Result</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                    {sortedTests.map((test) => (
                        <tr key={test._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-800">{test.name}</div>
                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{test.notes}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-indigo-600 font-medium">{test.subject?.name}</div>
                            <div className="text-xs text-gray-400">{test.topic?.name}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-800">{test.score}/{test.maxScore}</div>
                            <div className={`text-xs font-black ${test.percentage >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {test.percentage}% {test.percentage >= 60 ? 'PASS' : 'FAIL'}
                            </div>
                        </td>
                        {/* DATE FORMAT: DD/MM/YYYY  */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(test.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => handleEdit(test)} className="text-gray-400 hover:text-indigo-600 mr-3 transition"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(test._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-600" />
                <h2 className="font-bold text-gray-800 uppercase text-xs tracking-wider">Subject Proficiency</h2>
              </div>
              <div className="p-4 space-y-5">
                {subjectStats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-gray-700">{stat.name}</span>
                      <span className="text-xs font-black text-indigo-600">{stat.avg}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stat.avg}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Based on {stat.count} Tests</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingTest ? 'Edit Result' : 'Record New Result'}</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 font-medium">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Subject</label>
                  <select 
                    disabled={editingTest}
                    value={formData.subject} 
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value, topic: '' })}
                    className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required
                  >
                    <option value="">Select</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Topic</label>
                  <select
                    disabled={!!editingTest || !formData.subject}
                    value={formData.topic} 
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required 
                  >
                    <option value="">Select</option>
                    {getFilteredTopicsForForm().map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-gray-700 mb-1 uppercase">
                  <span>Test Title</span>
                  <span className="text-gray-400">{formData.name.length}/50</span>
                </label>
                <input 
                  type="text" value={formData.name} maxLength={50}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Score</label>
                  <input 
                    type="number" value={formData.score === 0 ? "" : formData.score} min="0" max={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                    className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Max Score</label>
                  <input 
                    type="number" value={formData.maxScore} min="1" max="1000"
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                    className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Date Taken</label>
                <input 
                  type="date" value={formData.date} max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500" required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Notes</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border-2 border-gray-100 p-2 rounded-lg outline-none focus:border-indigo-500"
                  rows="2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-2 font-bold text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tests;
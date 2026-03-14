import api from './axios';

// ==================== SUBJECTS ====================

export const getSubjects = async () => {
  try {
    const response = await api.get('/subjects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get subjects' };
  }
};

export const getSubject = async (id) => {
  try {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get subject' };
  }
};

export const createSubject = async (subjectData) => {
  try {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create subject' };
  }
};

export const updateSubject = async (id, subjectData) => {
  try {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update subject' };
  }
};

export const deleteSubject = async (id) => {
  try {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete subject' };
  }
};

// ==================== TOPICS ====================

export const getTopics = async (subjectId = null) => {
  try {
    const url = subjectId ? `/topics?subject=${subjectId}` : '/topics';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get topics' };
  }
};

export const getWeakTopics = async () => {
  try {
    const response = await api.get('/topics/weak');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get weak topics' };
  }
};

export const getTopic = async (id) => {
  try {
    const response = await api.get(`/topics/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get topic' };
  }
};

export const createTopic = async (topicData) => {
  try {
    const response = await api.post('/topics', topicData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create topic' };
  }
};

export const updateTopic = async (id, topicData) => {
  try {
    const response = await api.put(`/topics/${id}`, topicData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update topic' };
  }
};

export const deleteTopic = async (id) => {
  try {
    const response = await api.delete(`/topics/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete topic' };
  }
};

// ==================== TESTS ====================

export const getTests = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.topic) params.append('topic', filters.topic);
    
    const url = params.toString() ? `/tests?${params.toString()}` : '/tests';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get tests' };
  }
};

export const getTest = async (id) => {
  try {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get test' };
  }
};

export const createTest = async (testData) => {
  try {
    const response = await api.post('/tests', testData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create test' };
  }
};

export const updateTest = async (id, testData) => {
  try {
    const response = await api.put(`/tests/${id}`, testData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update test' };
  }
};

export const deleteTest = async (id) => {
  try {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete test' };
  }
};

// ==================== STUDY SESSIONS ====================

export const getSessions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.date) params.append('date', filters.date);
    
    const url = params.toString() ? `/sessions?${params.toString()}` : '/sessions';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get sessions' };
  }
};

export const getSessionStats = async () => {
  try {
    const response = await api.get('/sessions/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get session stats' };
  }
};

export const getSession = async (id) => {
  try {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get session' };
  }
};

export const createSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create session' };
  }
};

export const updateSession = async (id, sessionData) => {
  try {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update session' };
  }
};

export const deleteSession = async (id) => {
  try {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete session' };
  }
};

// ==================== AI STUDY PLAN ====================

export const generateStudyPlan = async (config) => {
  try {
    const response = await api.post('/ai/study-plan', config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate study plan' };
  }
};
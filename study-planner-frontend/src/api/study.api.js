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

export const analyzeSubject = async (subjectId) => {
  try {
    const response = await api.post(`/subjects/${subjectId}/analyze`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate AI analysis' };
  }
};

// ==================== TOPICS ====================

export const getTopics = async () => {
  try {
    const response = await api.get('/topics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get topics' };
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

export const getTests = async () => {
  try {
    const response = await api.get('/tests');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get tests' };
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

export const getSessions = async (date = '') => {
  try{
    const url = date ? `/sessions?date=${date}` : '/sessions';
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

export const createSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create session' };
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

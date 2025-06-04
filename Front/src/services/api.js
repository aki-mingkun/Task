import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.6.136.246:5000', // Đảm bảo đây là IP backend thật
});

export const signup = async (userData) => {
  // userData: {username, password, email}
  const response = await api.post('/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/login', userData);
  return response.data;
};

export const getTasks = async (username) => {
  if (!username) throw new Error('Username is required to get tasks');
  const response = await api.get(`/tasks/${username}`);
  return response.data.tasks;
};

export const createTask = async (taskData) => {
  const response = await api.post('/task', taskData);
  return response.data;
};

export const updateTask = async (taskId, updateData) => {
  const response = await api.put(`/task/${taskId}`, updateData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/task/${taskId}`);
  return response.data;
};

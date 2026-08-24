import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const predictDisease = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/disease/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const predictYield = async (data) => {
  const response = await api.post('/api/yield/predict', data);
  return response.data;
};

export const optimizeFertilizer = async (data) => {
  const response = await api.post('/api/fertilizer/optimize', data);
  return response.data;
};

export const getShapInsights = async () => {
  const response = await api.get('/api/shap/insights');
  return response.data;
};

export const getMetadata = async () => {
  const response = await api.get('/api/metadata');
  return response.data;
};

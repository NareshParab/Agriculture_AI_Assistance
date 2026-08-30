import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

/** Returns the list of crops available in the soil reference dataset. */
export const getFertilizerCrops = async () => {
  const response = await api.get('/api/fertilizer/crops');
  return response.data;
};

/**
 * Compare current N/P/K against soil dataset ranges for the given crop.
 * @param {{ crop: string, N: number, P: number, K: number }} data
 */
export const recommendFertilizer = async (data) => {
  const response = await api.post('/api/fertilizer/recommend', data);
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

export const wakeupBackend = async () => {
  try {
    await api.get('/health');
  } catch (error) {
    console.error('Failed to wake up backend:', error);
  }
};

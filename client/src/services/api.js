import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(API_TIMEOUT),
});

export const cryptoAPI = {
  getCurrentData: async () => {
    const response = await api.get('/coins');
    return response.data;
  },

  getCoinHistory: async (coinId) => {
    const response = await api.get(`/coins/history/${coinId}`);
    return response.data;
  },

  storeHistory: async () => {
    const response = await api.post('/coins/history');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api; 
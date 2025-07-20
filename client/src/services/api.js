import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
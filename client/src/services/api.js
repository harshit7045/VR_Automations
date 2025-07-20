import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.109.255.75:5001/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// Debug logging
console.log('🔧 Environment Variables:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_API_TIMEOUT:', import.meta.env.VITE_API_TIMEOUT);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('Final API_TIMEOUT:', API_TIMEOUT);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(API_TIMEOUT),
});

export const cryptoAPI = {
  getCurrentData: async () => {
    console.log('🌐 Making API call to:', `${API_BASE_URL}/coins`);
    const response = await api.get('/coins');
    console.log('✅ API Response:', response.data);
    return response.data;
  },

  getCoinHistory: async (coinId) => {
    console.log('🌐 Making API call to:', `${API_BASE_URL}/coins/history/${coinId}`);
    const response = await api.get(`/coins/history/${coinId}`);
    console.log('✅ API Response:', response.data);
    return response.data;
  },

  storeHistory: async () => {
    console.log('🌐 Making API call to:', `${API_BASE_URL}/coins/history`);
    const response = await api.post('/coins/history');
    console.log('✅ API Response:', response.data);
    return response.data;
  },

  healthCheck: async () => {
    const healthUrl = API_BASE_URL.replace('/api', '') + '/health';
    console.log('🌐 Making API call to:', healthUrl);
    const response = await api.get('/health');
    console.log('✅ API Response:', response.data);
    return response.data;
  }
};

export default api; 
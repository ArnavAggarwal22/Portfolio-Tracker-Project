import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const stockAPI = {
  getAllStocks: () => api.get('/stocks'),
  addStock: (stockData) => api.post('/stocks', stockData),
  deleteStock: (id) => api.delete(`/stocks/${id}`),
  getStockPrice: (symbol) => api.get(`/stocks/price/${symbol}`),
  getMultiplePrices: (symbols) => api.post('/stocks/prices', { symbols }),
};

// at bottom of file, after stockAPI
export const marketAPI = {
  getSymbols: () => api.get('/market/symbols'),
  getPrices: (symbols) => api.post('/market/prices', { symbols })
};


export default api;

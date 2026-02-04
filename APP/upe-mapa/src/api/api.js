import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000, // 30 segundos
});

// Interceptor para debug
api.interceptors.request.use(
  (config) => {
    console.log('Requisição:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Centralized API setup
// In development: proxy via Vite (/api → localhost:8080)
// In production:  VITE_API_URL points to the Railway backend

import axios from 'axios';
import qs from 'qs';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default api;
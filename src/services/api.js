import axios from 'axios';
import { URL as API_URL } from 'config/api';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...config.headers,
    'content-type': 'application/json; charset=utf-8',
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
  },
}));

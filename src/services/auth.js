import { api } from 'services/api';

export const loginAuth = (data) => api.post(`/auth/authenticate`, data);

export const getToken = (data) => api.post(`/auth/forgot-password`, data);

export const resetPassword = (data) => api.post(`/auth/reset-password`, data);
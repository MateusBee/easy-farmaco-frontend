import { api } from 'services/api';

export const getAll = () => api.get(`/user`);

export const createUser = (data) => api.post(`/user`, data);

export const updateUser = (id, data) => api.post(`/user/${id}`, data);

export const deleteUser = (id) => api.delete(`/user/${id}`);

export const resetPassword = (data) => api.post(`/user/reset-password`, data);
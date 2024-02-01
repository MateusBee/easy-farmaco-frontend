import { api } from 'services/api';

export const getAll = () => api.get(`/ministration`);

export const createMedication = (data) => api.post(`/ministration`, data);

export const updateMedication = (id, data) => api.post(`/ministration/${id}`, data);
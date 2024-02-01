import { api } from 'services/api';

export const getAll = () => api.get(`/medication`);

export const createMedication = (data) => api.post(`/medication`, data);

export const updateMedication = (id, data) => api.post(`/medication/${id}`, data);

export const deleteMedication = (id) => api.delete(`/medication/${id}`);
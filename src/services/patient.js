import { api } from 'services/api';

export const getAll = () => api.get(`/patient`);

export const getMedications = () => api.get(`/medication`);

export const createPatient = (data) => api.post(`/patient`, data);

export const updatePatient = (id, data) => api.post(`/patient/${id}`, data);

export const deletePatient = (id) => api.delete(`/patient/${id}`);
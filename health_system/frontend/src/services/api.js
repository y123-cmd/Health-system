import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL
});

// Health Program endpoints
export const getPrograms = () => api.get('/programs/');
export const getProgram = (id) => api.get(`/programs/${id}/`);
export const createProgram = (programData) => api.post('/programs/', programData);
export const updateProgram = (id, programData) => api.put(`/programs/${id}/`, programData);
export const deleteProgram = (id) => api.delete(`/programs/${id}/`);

// Client endpoints
export const getClients = (search = '') => {
  const params = search ? { search } : {};
  return api.get('/clients/', { params });
};
export const getClient = (id) => api.get(`/clients/${id}/`);
export const createClient = (clientData) => api.post('/clients/', clientData);
export const updateClient = (id, clientData) => api.put(`/clients/${id}/`, clientData);
export const deleteClient = (id) => api.delete(`/clients/${id}/`);

// Enrollment endpoints
export const getEnrollments = () => api.get('/enrollments/');
export const enrollClient = (clientId, programId, data) => 
  api.post(`/clients/${clientId}/enroll/`, { program_id: programId, ...data });
export const getClientEnrollments = (clientId) => api.get(`/clients/${clientId}/enrollments/`);

export default api;
import axios from 'axios';
import { API_BASE_URL } from '../constants';

const EMPLOYER_TOKEN_KEY = 'edurozgaar-employer-token';

const employerAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

employerAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(EMPLOYER_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (e) => Promise.reject(e)
);

employerAxios.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(EMPLOYER_TOKEN_KEY);
      localStorage.removeItem('edurozgaar-employer');
    }
    return Promise.reject(err);
  }
);

export const EMPLOYER_TOKEN_STORAGE = EMPLOYER_TOKEN_KEY;

export const employerAuthApi = {
  register: (payload) => axios.post(`${API_BASE_URL}/auth/employer/register`, payload),
  login: (email, password) => axios.post(`${API_BASE_URL}/auth/employer/login`, { email, password }),
  me: () => employerAxios.get('/employer/me'),
};

export const employerApi = {
  dashboard: () => employerAxios.get('/employer/dashboard'),
  plans: () => employerAxios.get('/employer/plans'),
  getJobs: (params) => employerAxios.get('/employer/jobs', { params }),
  createJob: (body) => employerAxios.post('/employer/jobs', body),
  updateJob: (id, body) => employerAxios.patch(`/employer/jobs/${id}`, body),
  activateJob: (id, body) => employerAxios.post(`/employer/jobs/${id}/activate`, body),
  getJobApplications: (jobId) => employerAxios.get(`/employer/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId, status) =>
    employerAxios.patch(`/employer/applications/${applicationId}`, { status }),
  jobAnalytics: (jobId) => employerAxios.get(`/employer/analytics/${jobId}`),
};

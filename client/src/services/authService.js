import axiosInstance from './axiosBase';

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me'),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh-token', { refreshToken }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.patch('/auth/profile', data),
};

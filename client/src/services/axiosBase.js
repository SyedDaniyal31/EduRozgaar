import axios from 'axios';
import { API_BASE_URL } from '../constants';

const TOKEN_KEY = 'edurozgaar-token';
const REFRESH_KEY = 'edurozgaar-refresh-token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – add JWT for protected requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor – on 401 try refresh token, then retry or clear auth
let refreshPromise = null;
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) {
      if (err.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem('edurozgaar-user');
      }
      return Promise.reject(err);
    }
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('edurozgaar-user');
      return Promise.reject(err);
    }
    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken: refresh })
        .then((res) => {
          const { accessToken, refreshToken: newRefresh, user } = res.data;
          localStorage.setItem(TOKEN_KEY, accessToken);
          if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
          if (user) localStorage.setItem('edurozgaar-user', JSON.stringify(user));
          return accessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    try {
      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem('edurozgaar-user');
      return Promise.reject(err);
    }
  }
);

export default axiosInstance;

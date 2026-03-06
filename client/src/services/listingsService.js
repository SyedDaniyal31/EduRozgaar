import axiosInstance from './axiosBase';

function buildParams(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null && value !== '') searchParams.set(key, value);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const jobsApi = {
  list: (params) => axiosInstance.get(`/jobs${buildParams(params)}`),
  get: (idOrSlug) => axiosInstance.get(`/jobs/${encodeURIComponent(idOrSlug)}`),
  save: (id) => axiosInstance.post(`/jobs/${id}/save`),
  unsave: (id) => axiosInstance.delete(`/jobs/${id}/save`),
};

export const scholarshipsApi = {
  list: (params) => axiosInstance.get(`/scholarships${buildParams(params)}`),
  get: (idOrSlug) => axiosInstance.get(`/scholarships/${encodeURIComponent(idOrSlug)}`),
  save: (id) => axiosInstance.post(`/scholarships/${id}/save`),
  unsave: (id) => axiosInstance.delete(`/scholarships/${id}/save`),
};

export const admissionsApi = {
  list: (params) => axiosInstance.get(`/admissions${buildParams(params)}`),
  get: (idOrSlug) => axiosInstance.get(`/admissions/${encodeURIComponent(idOrSlug)}`),
  save: (id) => axiosInstance.post(`/admissions/${id}/save`),
  unsave: (id) => axiosInstance.delete(`/admissions/${id}/save`),
};

export const savedApi = {
  get: () => axiosInstance.get('/auth/saved'),
  getBookmarks: () => axiosInstance.get('/auth/bookmarks'),
};

export const trendingApi = {
  jobs: () => axiosInstance.get('/trending/jobs'),
  scholarships: () => axiosInstance.get('/trending/scholarships'),
  admissions: () => axiosInstance.get('/trending/admissions'),
};

export const dashboardApi = {
  get: () => axiosInstance.get('/auth/dashboard'),
};

export const newsletterApi = {
  subscribe: (email, frequency = 'weekly') => axiosInstance.post('/newsletter/subscribe', { email, frequency }),
  unsubscribe: (email) => axiosInstance.post('/newsletter/unsubscribe', { email }),
};

export const recentViewedApi = {
  record: (type, id) => axiosInstance.post('/auth/recently-viewed', { type, id }),
};

export const monetizationApi = {
  featuredJobs: () => axiosInstance.get('/monetization/featured/jobs'),
  featuredScholarships: () => axiosInstance.get('/monetization/featured/scholarships'),
  sponsoredJobs: () => axiosInstance.get('/monetization/sponsored/jobs'),
  sponsoredScholarships: () => axiosInstance.get('/monetization/sponsored/scholarships'),
  adSlots: () => axiosInstance.get('/monetization/ad-slots'),
};

export const fcmApi = {
  registerToken: (token) => axiosInstance.post('/auth/fcm-token', { token }),
};

export const aiJobApi = {
  generate: (payload) => axiosInstance.post('/admin/jobs/generate', payload),
};

export const resumeApi = {
  analyze: (formData) => axiosInstance.post('/users/resume-analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

const v1 = (path) => `/v1${path}`;
export const recommendationsApi = {
  get: (userId = 'me') => axiosInstance.get(v1(`/recommendations/${userId}`)),
};
export const v1Api = {
  jobs: (params) => axiosInstance.get(v1('/jobs') + (params ? '?' + new URLSearchParams(params).toString() : '')),
  scholarships: (params) => axiosInstance.get(v1('/scholarships') + (params ? '?' + new URLSearchParams(params).toString() : '')),
  admissions: (params) => axiosInstance.get(v1('/admissions') + (params ? '?' + new URLSearchParams(params).toString() : '')),
  trending: (type) => axiosInstance.get(v1(`/trending/${type}`)),
  bookmarks: () => axiosInstance.get(v1('/bookmarks')),
  notifications: () => axiosInstance.get(v1('/notifications')),
  landingPage: (type, slug) => axiosInstance.get(v1(`/landing-pages/${type}/${slug}`)),
  analyticsEvent: (payload) => axiosInstance.post(v1('/analytics/event'), payload),
  analyticsDashboard: () => axiosInstance.get(v1('/analytics/dashboard')),
  alertsTelegram: (body) => axiosInstance.post(v1('/alerts/telegram/send'), body),
  alertsWhatsApp: (body) => axiosInstance.post(v1('/alerts/whatsapp/send'), body),
};

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
  apply: (id, formData) => axiosInstance.post(`/jobs/${id}/apply`, formData, formData instanceof FormData ? {} : {}),
};

export const applicationsApi = {
  getMy: () => axiosInstance.get('/users/applications'),
};

export const referralsApi = {
  getMy: () => axiosInstance.get('/auth/referrals'),
};

export const seoApi = {
  jobsIn: (slug) => axiosInstance.get(`/seo/jobs-in/${encodeURIComponent(slug)}`),
  jobsByCategory: (slug) => axiosInstance.get(`/seo/jobs-by-category/${encodeURIComponent(slug)}`),
  jobsBySource: (source) => axiosInstance.get(`/seo/jobs-by-source/${encodeURIComponent(source)}`),
  latestGovernmentJobs: () => axiosInstance.get('/seo/latest-government-jobs'),
  scholarshipsIn: (country) => axiosInstance.get(`/seo/scholarships-in/${encodeURIComponent(country)}`),
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

export const blogsApi = {
  list: (params) => axiosInstance.get(`/blogs${buildParams(params || {})}`),
  get: (idOrSlug) => axiosInstance.get(`/blogs/${encodeURIComponent(idOrSlug)}`),
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

export const coverLetterApi = {
  generate: (jobId) => axiosInstance.post('/users/cover-letter', { jobId }),
};

export const internshipsApi = {
  list: (params) => axiosInstance.get(`/internships${buildParams(params)}`),
  get: (idOrSlug) => axiosInstance.get(`/internships/${encodeURIComponent(idOrSlug)}`),
  apply: (idOrSlug) => axiosInstance.post(`/internships/${encodeURIComponent(idOrSlug)}/apply`),
  myApplications: () => axiosInstance.get('/internships/my/applications'),
  save: (id) => axiosInstance.post(`/internships/${id}/save`),
  unsave: (id) => axiosInstance.delete(`/internships/${id}/save`),
};

export const chatbotApi = {
  query: (message) => axiosInstance.post('/chatbot/query', { message }),
  history: () => axiosInstance.get('/chatbot/history'),
};

export const webinarsApi = {
  list: (params) => axiosInstance.get(`/webinars${buildParams(params)}`),
  upcoming: () => axiosInstance.get('/webinars/upcoming'),
  recorded: (params) => axiosInstance.get(`/webinars/recorded${buildParams(params)}`),
  get: (id) => axiosInstance.get(`/webinars/${id}`),
  register: (id) => axiosInstance.post(`/webinars/${id}/register`),
  myRegistrations: () => axiosInstance.get('/webinars/my/registrations'),
};

export const intlScholarshipsApi = {
  list: (params) => axiosInstance.get(`/intl-scholarships${buildParams(params)}`),
  get: (id) => axiosInstance.get(`/intl-scholarships/${id}`),
  universities: () => axiosInstance.get('/intl-scholarships/universities'),
  save: (id) => axiosInstance.post(`/intl-scholarships/${id}/save`),
  unsave: (id) => axiosInstance.delete(`/intl-scholarships/${id}/save`),
};

export const badgesApi = {
  myBadges: () => axiosInstance.get('/badges/me'),
  leaderboard: (params) => axiosInstance.get('/badges/leaderboard', { params }), // params: { limit, by: 'points'|'referrals'|'applications' }
  myRank: () => axiosInstance.get('/badges/rank'),
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

export const adminApi = {
  growthDashboard: () => axiosInstance.get('/admin/growth-dashboard'),
  scraperRun: () => axiosInstance.post('/admin/scraper/run'),
  scraperRuns: (params) => axiosInstance.get('/admin/scraper/runs' + (params ? '?' + new URLSearchParams(params).toString() : '')),
  autoGenerateBlog: (body) => axiosInstance.post('/blogs/auto-generate', body || {}),
};

export const examsApi = {
  listExams: () => axiosInstance.get('/exams'),
  getExam: (slug) => axiosInstance.get(`/exams/${encodeURIComponent(slug)}`),
  listPastPapers: (examId) => axiosInstance.get(`/exams/${encodeURIComponent(examId)}/past-papers`),
  listQuizzes: (examId) => axiosInstance.get(`/exams/${encodeURIComponent(examId)}/quizzes`),
  getQuiz: (quizId) => axiosInstance.get(`/quizzes/${encodeURIComponent(quizId)}`),
  submitQuiz: (body) => axiosInstance.post('/quizzes/submit', body),
  leaderboard: (params) => axiosInstance.get('/quizzes/leaderboard', { params }),
  myProgress: () => axiosInstance.get('/quizzes/my-progress'),
};

export const resumeScansApi = {
  getHistory: (params) => axiosInstance.get('/users/resume-scans', { params }),
};

export const resumesApi = {
  create: (body) => axiosInstance.post('/resumes', body),
  getMy: () => axiosInstance.get('/resumes/user'),
  getById: (id) => axiosInstance.get(`/resumes/${id}`),
  update: (id, body) => axiosInstance.put(`/resumes/${id}`, body),
  delete: (id) => axiosInstance.delete(`/resumes/${id}`),
  aiSuggest: (body) => axiosInstance.post('/resumes/ai-suggest', body),
  optimizeForJob: (resumeId, jobId, resumePayload) =>
    axiosInstance.post('/resumes/optimize-for-job', resumeId != null ? { resumeId, jobId } : { jobId, resume: resumePayload }),
};

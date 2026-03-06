export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  SCHOLARSHIPS: '/scholarships',
  ADMISSIONS: '/admissions',
  SCHOOLS_AND_COLLEGES: '/schools-and-colleges',
  FOREIGN_STUDIES: '/foreign-studies',
  BLOG: '/blog',
  CONTACT: '/contact',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  SAVED_JOBS: '/saved-jobs',
  ADMIN: '/admin',
  RESUME_ANALYZER: '/resume-analyzer',
  EXAM_PREP: '/exam-prep',
  EXAM_DETAIL: '/exam-prep/:slug',
  QUIZ_TAKE: '/exam-prep/quiz/:quizId',
  INTERNSHIPS: '/internships',
  WEBINARS: '/webinars',
  INTL_SCHOLARSHIPS: '/intl-scholarships',
  BADGES_LEADERBOARD: '/badges',
};

export const ROLES = { ADMIN: 'Admin', USER: 'User' };

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

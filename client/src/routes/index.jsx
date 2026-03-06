import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayoutWrapper } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants';
import { ROLES } from '../constants';

const Home = lazyLoad(() => import('../pages/Home/Home'));
const Jobs = lazyLoad(() => import('../pages/Jobs/Jobs'));
const JobDetail = lazyLoad(() => import('../pages/Jobs/JobDetail'));
const Scholarships = lazyLoad(() => import('../pages/Scholarships/Scholarships'));
const ScholarshipDetail = lazyLoad(() => import('../pages/Scholarships/ScholarshipDetail'));
const Admissions = lazyLoad(() => import('../pages/Admissions/Admissions'));
const AdmissionDetail = lazyLoad(() => import('../pages/Admissions/AdmissionDetail'));
const SchoolsAndColleges = lazyLoad(() => import('../pages/SchoolsAndColleges/SchoolsAndColleges'));
const ForeignStudies = lazyLoad(() => import('../pages/ForeignStudies/ForeignStudies'));
const Blog = lazyLoad(() => import('../pages/Blog/Blog'));
const BlogPost = lazyLoad(() => import('../pages/Blog/BlogPost'));
const Contact = lazyLoad(() => import('../pages/Contact/Contact'));
const Login = lazyLoad(() => import('../pages/Auth/Login'));
const Register = lazyLoad(() => import('../pages/Auth/Register'));
const Profile = lazyLoad(() => import('../pages/Profile/Profile'));
const Dashboard = lazyLoad(() => import('../pages/Dashboard/Dashboard'));
const SavedJobs = lazyLoad(() => import('../pages/SavedJobs/SavedJobs'));
const Admin = lazyLoad(() => import('../pages/Admin/Admin'));
const AIJobGenerator = lazyLoad(() => import('../pages/Admin/AIJobGenerator'));
const AnalyticsDashboard = lazyLoad(() => import('../pages/Admin/AnalyticsDashboard'));
const AlertsAdmin = lazyLoad(() => import('../pages/Admin/AlertsAdmin'));
const JobsProvinceLanding = lazyLoad(() => import('../pages/Landing/JobsProvinceLanding'));
const JobsCategoryLanding = lazyLoad(() => import('../pages/Landing/JobsCategoryLanding'));
const ResumeAnalyzer = lazyLoad(() => import('../pages/ResumeAnalyzer/ResumeAnalyzer'));

function lazyLoad(importFn) {
  const Lazy = lazy(importFn);
  return function Wrapped(props) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
    </div>
  );
}

export const routes = [
  {
    path: '/',
    element: <MainLayoutWrapper />,
    children: [
      { index: true, element: <Home /> },
      { path: ROUTES.JOBS, element: <Jobs /> },
      { path: `${ROUTES.JOBS}/province/:slug`, element: <JobsProvinceLanding /> },
      { path: `${ROUTES.JOBS}/category/:slug`, element: <JobsCategoryLanding /> },
      { path: `${ROUTES.JOBS}/:slug`, element: <JobDetail /> },
      { path: ROUTES.SCHOLARSHIPS, element: <Scholarships /> },
      { path: `${ROUTES.SCHOLARSHIPS}/:slug`, element: <ScholarshipDetail /> },
      { path: ROUTES.ADMISSIONS, element: <Admissions /> },
      { path: `${ROUTES.ADMISSIONS}/:slug`, element: <AdmissionDetail /> },
      { path: ROUTES.SCHOOLS_AND_COLLEGES, element: <SchoolsAndColleges /> },
      { path: ROUTES.FOREIGN_STUDIES, element: <ForeignStudies /> },
      { path: ROUTES.BLOG, element: <Blog /> },
      { path: `${ROUTES.BLOG}/:slug`, element: <BlogPost /> },
      { path: ROUTES.CONTACT, element: <Contact /> },
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SAVED_JOBS,
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN,
        element: (
          <ProtectedRoute requireRole={[ROLES.ADMIN]}>
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { path: 'ai-job-generator', element: <AIJobGenerator /> },
          { path: 'analytics', element: <AnalyticsDashboard /> },
          { path: 'alerts', element: <AlertsAdmin /> },
        ],
      },
      {
        path: ROUTES.RESUME_ANALYZER,
        element: (
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

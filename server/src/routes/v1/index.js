import { Router } from 'express';
import { getJobs, getJobByIdOrSlug } from '../../controllers/jobsController.js';
import { getScholarships, getScholarshipByIdOrSlug } from '../../controllers/scholarshipsController.js';
import { getAdmissions, getAdmissionByIdOrSlug } from '../../controllers/admissionsController.js';
import { getForeignStudies, getForeignStudyByIdOrSlug } from '../../controllers/foreignStudiesController.js';
import { getTrendingJobs, getTrendingScholarships, getTrendingAdmissions } from '../../controllers/trendingController.js';
import { getSaved } from '../../controllers/savedController.js';
import { getRecommendations } from '../../controllers/recommendationsController.js';
import { sendTelegramAlert, sendWhatsAppAlert } from '../../controllers/alertsController.js';
import { getLandingPage } from '../../controllers/landingPagesController.js';
import { recordEvent, getDashboard as getAnalyticsDashboard } from '../../controllers/analyticsController.js';
import { getNotificationsForUser } from '../../controllers/notificationsListController.js';
import { saveJob, unsaveJob, saveScholarship, unsaveScholarship, saveAdmission, unsaveAdmission } from '../../controllers/savedController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

export const v1Router = Router();

v1Router.get('/jobs', getJobs);
v1Router.get('/jobs/:idOrSlug', getJobByIdOrSlug);
v1Router.post('/jobs/:id/save', requireAuth, saveJob);
v1Router.delete('/jobs/:id/save', requireAuth, unsaveJob);

v1Router.get('/scholarships', getScholarships);
v1Router.get('/scholarships/:idOrSlug', getScholarshipByIdOrSlug);
v1Router.post('/scholarships/:id/save', requireAuth, saveScholarship);
v1Router.delete('/scholarships/:id/save', requireAuth, unsaveScholarship);

v1Router.get('/admissions', getAdmissions);
v1Router.get('/admissions/:idOrSlug', getAdmissionByIdOrSlug);
v1Router.post('/admissions/:id/save', requireAuth, saveAdmission);
v1Router.delete('/admissions/:id/save', requireAuth, unsaveAdmission);

v1Router.get('/foreign-studies', getForeignStudies);
v1Router.get('/foreign-studies/:idOrSlug', getForeignStudyByIdOrSlug);

v1Router.get('/trending/jobs', getTrendingJobs);
v1Router.get('/trending/scholarships', getTrendingScholarships);
v1Router.get('/trending/admissions', getTrendingAdmissions);

v1Router.get('/recommendations/:userId', requireAuth, getRecommendations);
v1Router.get('/bookmarks', requireAuth, getSaved);
v1Router.get('/notifications', requireAuth, getNotificationsForUser);

v1Router.post('/alerts/telegram/send', requireAuth, requireAdmin, sendTelegramAlert);
v1Router.post('/alerts/whatsapp/send', requireAuth, requireAdmin, sendWhatsAppAlert);

v1Router.get('/landing-pages/:type/:slug', getLandingPage);

v1Router.post('/analytics/event', recordEvent);
v1Router.get('/analytics/dashboard', requireAuth, requireAdmin, getAnalyticsDashboard);

v1Router.get('/', (_req, res) => {
  res.json({
    version: '1',
    endpoints: [
      'GET /jobs',
      'GET /jobs/:idOrSlug',
      'GET /scholarships',
      'GET /scholarships/:idOrSlug',
      'GET /admissions',
      'GET /admissions/:idOrSlug',
      'GET /foreign-studies',
      'GET /foreign-studies/:idOrSlug',
      'GET /trending/jobs',
      'GET /trending/scholarships',
      'GET /trending/admissions',
      'GET /recommendations/me',
      'GET /bookmarks',
      'GET /notifications',
      'POST /alerts/telegram/send',
      'POST /alerts/whatsapp/send',
      'GET /landing-pages/:type/:slug',
      'POST /analytics/event',
      'GET /analytics/dashboard',
    ],
  });
});

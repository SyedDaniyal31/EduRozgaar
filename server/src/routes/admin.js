import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as adminJobs from '../controllers/admin/adminJobsController.js';
import * as adminScholarships from '../controllers/admin/adminScholarshipsController.js';
import * as adminAdmissions from '../controllers/admin/adminAdmissionsController.js';
import * as adminBlogs from '../controllers/admin/adminBlogsController.js';
import * as adminForeignStudies from '../controllers/admin/adminForeignStudiesController.js';
import * as adminNotifications from '../controllers/admin/adminNotificationsController.js';
import * as adminExams from '../controllers/admin/adminExamsController.js';
import * as adminInternships from '../controllers/admin/adminInternshipsController.js';
import * as adminWebinars from '../controllers/admin/adminWebinarsController.js';
import * as adminIntl from '../controllers/admin/adminIntlScholarshipsController.js';
import { generateJobDescription } from '../controllers/admin/aiJobController.js';
import { getGrowthDashboard } from '../controllers/growthDashboardController.js';
import { triggerScraper, getScraperRuns, getScraperSourcesList, getScraperConfig, updateScraperConfig } from '../controllers/scraperController.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/', (_req, res) => {
  res.json({ message: 'Admin panel', endpoints: ['/admin/jobs', '/admin/internships', '/admin/webinars', '/admin/intl-scholarships', '/admin/universities', '/admin/growth-dashboard', '/admin/scraper/run'] });
});

adminRouter.get('/growth-dashboard', getGrowthDashboard);
adminRouter.post('/scraper/run', triggerScraper);
adminRouter.get('/scraper/runs', getScraperRuns);
adminRouter.get('/scraper/sources', getScraperSourcesList);
adminRouter.get('/scraper/config', getScraperConfig);
adminRouter.patch('/scraper/config', updateScraperConfig);

adminRouter.get('/jobs', adminJobs.list);
adminRouter.post('/jobs/generate', generateJobDescription);
adminRouter.post('/jobs', adminJobs.create);
adminRouter.put('/jobs/:id', adminJobs.update);
adminRouter.post('/jobs/:id/approve', adminJobs.approveJob);
adminRouter.delete('/jobs/:id', adminJobs.remove);

adminRouter.get('/scholarships', adminScholarships.list);
adminRouter.post('/scholarships', adminScholarships.create);
adminRouter.put('/scholarships/:id', adminScholarships.update);
adminRouter.delete('/scholarships/:id', adminScholarships.remove);

adminRouter.get('/admissions', adminAdmissions.list);
adminRouter.post('/admissions', adminAdmissions.create);
adminRouter.put('/admissions/:id', adminAdmissions.update);
adminRouter.delete('/admissions/:id', adminAdmissions.remove);

adminRouter.get('/blogs', adminBlogs.list);
adminRouter.post('/blogs', adminBlogs.create);
adminRouter.put('/blogs/:id', adminBlogs.update);
adminRouter.delete('/blogs/:id', adminBlogs.remove);

adminRouter.get('/foreign-studies', adminForeignStudies.list);
adminRouter.post('/foreign-studies', adminForeignStudies.create);
adminRouter.put('/foreign-studies/:id', adminForeignStudies.update);
adminRouter.delete('/foreign-studies/:id', adminForeignStudies.remove);

adminRouter.get('/notifications', adminNotifications.list);
adminRouter.post('/notifications', adminNotifications.create);
adminRouter.delete('/notifications/:id', adminNotifications.remove);

adminRouter.get('/exams', adminExams.listExams);
adminRouter.post('/exams', adminExams.createExam);
adminRouter.put('/exams/:id', adminExams.updateExam);
adminRouter.delete('/exams/:id', adminExams.removeExam);
adminRouter.get('/exams/analytics', adminExams.getExamAnalytics);

adminRouter.get('/internships', adminInternships.list);
adminRouter.post('/internships', adminInternships.create);
adminRouter.put('/internships/:id', adminInternships.update);
adminRouter.delete('/internships/:id', adminInternships.remove);

adminRouter.get('/webinars', adminWebinars.list);
adminRouter.post('/webinars', adminWebinars.create);
adminRouter.put('/webinars/:id', adminWebinars.update);
adminRouter.delete('/webinars/:id', adminWebinars.remove);

adminRouter.get('/intl-scholarships', adminIntl.listScholarships);
adminRouter.post('/intl-scholarships', adminIntl.createScholarship);
adminRouter.put('/intl-scholarships/:id', adminIntl.updateScholarship);
adminRouter.delete('/intl-scholarships/:id', adminIntl.removeScholarship);
adminRouter.get('/universities', adminIntl.listUniversities);
adminRouter.post('/universities', adminIntl.createUniversity);
adminRouter.put('/universities/:id', adminIntl.updateUniversity);
adminRouter.delete('/universities/:id', adminIntl.removeUniversity);

adminRouter.get('/past-papers', adminExams.listPastPapers);
adminRouter.post('/past-papers', adminExams.createPastPaper);
adminRouter.put('/past-papers/:id', adminExams.updatePastPaper);
adminRouter.delete('/past-papers/:id', adminExams.removePastPaper);
adminRouter.get('/mcqs', adminExams.listMcqs);
adminRouter.post('/mcqs', adminExams.createMcq);
adminRouter.put('/mcqs/:id', adminExams.updateMcq);
adminRouter.delete('/mcqs/:id', adminExams.removeMcq);
adminRouter.get('/quizzes', adminExams.listQuizzes);
adminRouter.post('/quizzes', adminExams.createQuiz);
adminRouter.put('/quizzes/:id', adminExams.updateQuiz);
adminRouter.delete('/quizzes/:id', adminExams.removeQuiz);

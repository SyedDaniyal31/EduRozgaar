import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as adminJobs from '../controllers/admin/adminJobsController.js';
import * as adminScholarships from '../controllers/admin/adminScholarshipsController.js';
import * as adminAdmissions from '../controllers/admin/adminAdmissionsController.js';
import * as adminBlogs from '../controllers/admin/adminBlogsController.js';
import * as adminForeignStudies from '../controllers/admin/adminForeignStudiesController.js';
import * as adminNotifications from '../controllers/admin/adminNotificationsController.js';
import { generateJobDescription } from '../controllers/admin/aiJobController.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/', (_req, res) => {
  res.json({ message: 'Admin panel', endpoints: ['/admin/jobs', '/admin/jobs/generate', '/admin/scholarships', '/admin/admissions', '/admin/blogs', '/admin/foreign-studies', '/admin/notifications'] });
});

adminRouter.get('/jobs', adminJobs.list);
adminRouter.post('/jobs/generate', generateJobDescription);
adminRouter.post('/jobs', adminJobs.create);
adminRouter.put('/jobs/:id', adminJobs.update);
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

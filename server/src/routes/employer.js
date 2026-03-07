import { Router } from 'express';
import { requireAuth, requireEmployerAuth } from '../middleware/auth.js';
import * as employerAuth from '../controllers/employerAuthController.js';
import * as employer from '../controllers/employerController.js';

export const employerRouter = Router();

employerRouter.post('/auth/employer/register', employerAuth.employerRegister);
employerRouter.post('/auth/employer/login', employerAuth.employerLogin);

employerRouter.get('/employer/me', requireAuth, requireEmployerAuth, employerAuth.employerMe);
employerRouter.get('/employer/dashboard', requireAuth, requireEmployerAuth, employer.getDashboard);
employerRouter.get('/employer/plans', requireAuth, requireEmployerAuth, employer.getPlans);
employerRouter.get('/employer/jobs', requireAuth, requireEmployerAuth, employer.getMyJobs);
employerRouter.post('/employer/jobs', requireAuth, requireEmployerAuth, employer.createJob);
employerRouter.patch('/employer/jobs/:id', requireAuth, requireEmployerAuth, employer.updateJob);
employerRouter.post('/employer/jobs/:id/activate', requireAuth, requireEmployerAuth, employer.activateJob);
employerRouter.get('/employer/jobs/:id/applications', requireAuth, requireEmployerAuth, employer.getJobApplications);
employerRouter.get('/employer/analytics/:jobId', requireAuth, requireEmployerAuth, employer.getJobAnalytics);
employerRouter.patch('/employer/applications/:id', requireAuth, requireEmployerAuth, employer.updateApplicationStatus);

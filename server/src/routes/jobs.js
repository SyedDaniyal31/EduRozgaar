import { Router } from 'express';
import { getJobs, getJobByIdOrSlug } from '../controllers/jobsController.js';
import { saveJob, unsaveJob } from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

export const jobsRouter = Router();

jobsRouter.get('/jobs', getJobs);
jobsRouter.get('/jobs/:idOrSlug', getJobByIdOrSlug);
jobsRouter.post('/jobs/:id/save', requireAuth, saveJob);
jobsRouter.delete('/jobs/:id/save', requireAuth, unsaveJob);

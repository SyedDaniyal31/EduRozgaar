import { Router } from 'express';
import { getJobs, getJobByIdOrSlug } from '../controllers/jobsController.js';
import { saveJob, unsaveJob } from '../controllers/savedController.js';
import { applyToJob } from '../controllers/applicationsController.js';
import { uploadResume } from '../middleware/upload.js';
import { requireAuth, requireUserAuth } from '../middleware/auth.js';

export const jobsRouter = Router();

jobsRouter.get('/jobs', getJobs);
jobsRouter.get('/jobs/:idOrSlug', getJobByIdOrSlug);
jobsRouter.post('/jobs/:id/save', requireAuth, requireUserAuth, saveJob);
jobsRouter.delete('/jobs/:id/save', requireAuth, requireUserAuth, unsaveJob);
jobsRouter.post('/jobs/:id/apply', requireAuth, requireUserAuth, (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'File upload failed' });
    next();
  });
}, applyToJob);

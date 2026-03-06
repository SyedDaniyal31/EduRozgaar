import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  aiSuggest,
  optimizeForJob,
} from '../controllers/resumesController.js';

export const resumesRouter = Router();

resumesRouter.post('/resumes', requireAuth, createResume);
resumesRouter.get('/resumes/user', requireAuth, getMyResumes);
resumesRouter.post('/resumes/ai-suggest', requireAuth, aiSuggest);
resumesRouter.post('/resumes/optimize-for-job', requireAuth, optimizeForJob);
resumesRouter.get('/resumes/:id', requireAuth, getResumeById);
resumesRouter.put('/resumes/:id', requireAuth, updateResume);
resumesRouter.delete('/resumes/:id', requireAuth, deleteResume);

import { Router } from 'express';
import { analyzeResume } from '../controllers/resumeAnalyzerController.js';
import { uploadResume } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.post('/users/resume-analyze', requireAuth, (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'File upload failed' });
    next();
  });
}, analyzeResume);

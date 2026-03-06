import { Router } from 'express';
import { getScholarships, getScholarshipByIdOrSlug } from '../controllers/scholarshipsController.js';
import { saveScholarship, unsaveScholarship } from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

export const scholarshipsRouter = Router();

scholarshipsRouter.get('/scholarships', getScholarships);
scholarshipsRouter.get('/scholarships/:idOrSlug', getScholarshipByIdOrSlug);
scholarshipsRouter.post('/scholarships/:id/save', requireAuth, saveScholarship);
scholarshipsRouter.delete('/scholarships/:id/save', requireAuth, unsaveScholarship);

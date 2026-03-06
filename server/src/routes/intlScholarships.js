import { Router } from 'express';
import { listIntlScholarships, getIntlScholarshipById, listUniversities } from '../controllers/intlScholarshipsController.js';
import { saveIntlScholarship, unsaveIntlScholarship } from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

export const intlScholarshipsRouter = Router();

intlScholarshipsRouter.get('/intl-scholarships', listIntlScholarships);
intlScholarshipsRouter.get('/intl-scholarships/universities', listUniversities);
intlScholarshipsRouter.get('/intl-scholarships/:id', getIntlScholarshipById);
intlScholarshipsRouter.post('/intl-scholarships/:id/save', requireAuth, saveIntlScholarship);
intlScholarshipsRouter.delete('/intl-scholarships/:id/save', requireAuth, unsaveIntlScholarship);

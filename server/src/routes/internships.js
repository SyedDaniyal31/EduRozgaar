import { Router } from 'express';
import { listInternships, getInternshipByIdOrSlug, applyToInternship, getMyApplications } from '../controllers/internshipsController.js';
import { saveInternship, unsaveInternship } from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

export const internshipsRouter = Router();

internshipsRouter.get('/internships', listInternships);
internshipsRouter.get('/internships/:idOrSlug', getInternshipByIdOrSlug);
internshipsRouter.post('/internships/:idOrSlug/apply', requireAuth, applyToInternship);
internshipsRouter.get('/internships/my/applications', requireAuth, getMyApplications);
internshipsRouter.post('/internships/:id/save', requireAuth, saveInternship);
internshipsRouter.delete('/internships/:id/save', requireAuth, unsaveInternship);

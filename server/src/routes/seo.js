import { Router } from 'express';
import { getSeoJobsPage, getSeoJobsByCategory, getSeoScholarshipsPage } from '../controllers/seoController.js';

export const seoRouter = Router();

seoRouter.get('/seo/jobs-in/:slug', getSeoJobsPage);
seoRouter.get('/seo/jobs-by-category/:slug', getSeoJobsByCategory);
seoRouter.get('/seo/scholarships-in/:country', getSeoScholarshipsPage);

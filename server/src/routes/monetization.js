import { Router } from 'express';
import {
  getFeaturedJobs,
  getFeaturedScholarships,
  getSponsoredJobs,
  getSponsoredScholarships,
  getAdSlots,
  listAdSlots,
  createAdSlot,
  updateAdSlot,
  deleteAdSlot,
  setJobMonetization,
  setScholarshipMonetization,
} from '../controllers/monetizationController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const monetizationRouter = Router();

monetizationRouter.get('/monetization/featured/jobs', getFeaturedJobs);
monetizationRouter.get('/monetization/featured/scholarships', getFeaturedScholarships);
monetizationRouter.get('/monetization/sponsored/jobs', getSponsoredJobs);
monetizationRouter.get('/monetization/sponsored/scholarships', getSponsoredScholarships);
monetizationRouter.get('/monetization/ad-slots', getAdSlots);

monetizationRouter.get('/monetization/admin/ad-slots', requireAuth, requireAdmin, listAdSlots);
monetizationRouter.post('/monetization/admin/ad-slots', requireAuth, requireAdmin, createAdSlot);
monetizationRouter.put('/monetization/admin/ad-slots/:id', requireAuth, requireAdmin, updateAdSlot);
monetizationRouter.delete('/monetization/admin/ad-slots/:id', requireAuth, requireAdmin, deleteAdSlot);
monetizationRouter.patch('/monetization/admin/jobs/:id', requireAuth, requireAdmin, setJobMonetization);
monetizationRouter.patch('/monetization/admin/scholarships/:id', requireAuth, requireAdmin, setScholarshipMonetization);

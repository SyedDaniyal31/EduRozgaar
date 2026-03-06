import { Router } from 'express';
import { subscribe, unsubscribe, sendDaily } from '../controllers/newsletterController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const newsletterRouter = Router();

newsletterRouter.post('/newsletter/subscribe', subscribe);
newsletterRouter.post('/newsletter/unsubscribe', unsubscribe);
newsletterRouter.post('/newsletter/send-daily', requireAuth, requireAdmin, sendDaily);

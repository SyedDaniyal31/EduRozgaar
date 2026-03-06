import { Router } from 'express';
import { sendNotification } from '../controllers/notificationsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const notificationsRouter = Router();

notificationsRouter.post('/notifications/send', requireAuth, requireAdmin, sendNotification);

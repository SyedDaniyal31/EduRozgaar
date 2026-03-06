import { Router } from 'express';
import {
  register,
  login,
  me,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { getSaved } from '../controllers/savedController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { recordRecentlyViewed } from '../controllers/recentlyViewedController.js';
import { registerFcmToken } from '../controllers/fcmController.js';
import { getMyReferrals } from '../controllers/referralsController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/auth/register', register);
authRouter.post('/auth/login', login);
authRouter.post('/auth/forgot-password', forgotPassword);
authRouter.post('/auth/reset-password', resetPassword);
authRouter.get('/auth/me', requireAuth, me);
authRouter.post('/auth/logout', requireAuth, logout);
authRouter.post('/auth/refresh-token', refreshToken);
authRouter.get('/auth/profile', requireAuth, getProfile);
authRouter.patch('/auth/profile', requireAuth, updateProfile);
authRouter.get('/auth/saved', requireAuth, getSaved);
authRouter.get('/auth/bookmarks', requireAuth, getSaved);
authRouter.get('/auth/dashboard', requireAuth, getDashboard);
authRouter.get('/auth/referrals', requireAuth, getMyReferrals);
authRouter.post('/auth/recently-viewed', requireAuth, recordRecentlyViewed);
authRouter.post('/auth/fcm-token', requireAuth, registerFcmToken);

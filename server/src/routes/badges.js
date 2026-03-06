import { Router } from 'express';
import { getMyBadges, getLeaderboard, getMyRank } from '../controllers/badgesController.js';
import { requireAuth } from '../middleware/auth.js';

export const badgesRouter = Router();

badgesRouter.get('/badges/me', requireAuth, getMyBadges);
badgesRouter.get('/badges/leaderboard', getLeaderboard);
badgesRouter.get('/badges/rank', requireAuth, getMyRank);

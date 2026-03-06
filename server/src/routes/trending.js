import { Router } from 'express';
import { getTrendingByType } from '../controllers/trendingController.js';

export const trendingRouter = Router();

trendingRouter.get('/trending/:type', getTrendingByType);

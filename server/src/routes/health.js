import { Router } from 'express';
import mongoose from 'mongoose';
import { getRedisClient } from '../config/redis.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  const mongo = mongoose.connection.readyState === 1 ? 'up' : 'down';
  let redis = 'disabled';
  try {
    const client = await getRedisClient();
    if (client) {
      await client.ping();
      redis = 'up';
    }
  } catch {
    redis = 'down';
  }
  res.json({
    status: mongo === 'up' ? 'ok' : 'degraded',
    service: 'EduRozgaar API',
    mongo,
    redis,
  });
});

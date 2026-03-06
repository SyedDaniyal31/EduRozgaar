import rateLimit from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

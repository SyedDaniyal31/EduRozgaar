import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheGet, cacheSet } from '../config/redis.js';

const CACHE_TTL = 120;

export const recordEvent = asyncHandler(async (req, res) => {
  const { eventType, listingType, listingId, metadata } = req.body || {};
  if (!eventType || !String(eventType).trim()) return res.status(400).json({ error: 'eventType is required' });
  const doc = await AnalyticsEvent.create({
    eventType: String(eventType).trim(),
    userId: req.user?.userId || undefined,
    listingType: listingType || undefined,
    listingId: listingId || undefined,
    metadata: metadata || undefined,
  });
  res.status(201).json({ id: doc._id });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const cacheKey = 'analytics:dashboard';
  let data = await cacheGet(cacheKey);
  if (data) return res.json(data);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [dailyActiveUsers, trendingSearches, recommendedClicks, notificationsSent, notificationsOpened] = await Promise.all([
    AnalyticsEvent.distinct('userId', { createdAt: { $gte: startOfDay }, userId: { $ne: null } }),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'search', createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } } },
      { $group: { _id: '$metadata.query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AnalyticsEvent.countDocuments({ eventType: 'click', listingType: { $in: ['job', 'scholarship', 'admission'] }, createdAt: { $gte: startOfDay } }),
    AnalyticsEvent.countDocuments({ eventType: 'notification_sent', createdAt: { $gte: startOfDay } }),
    AnalyticsEvent.countDocuments({ eventType: 'notification_opened', createdAt: { $gte: startOfDay } }),
  ]);

  data = {
    dailyActiveUsers: dailyActiveUsers?.length ?? 0,
    trendingSearches: (trendingSearches || []).map((s) => ({ query: s._id || '(unknown)', count: s.count })),
    recommendedClicksToday: recommendedClicks ?? 0,
    notificationsSentToday: notificationsSent ?? 0,
    notificationsOpenedToday: notificationsOpened ?? 0,
  };
  await cacheSet(cacheKey, data, CACHE_TTL);
  res.json(data);
});

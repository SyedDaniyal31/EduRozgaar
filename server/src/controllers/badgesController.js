import { UserBadge } from '../models/UserBadge.js';
import { BadgeDefinition } from '../models/BadgeDefinition.js';
import { User } from '../models/User.js';
import { Application } from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const DEFAULT_POINTS = {
  job_applied: 5, internship_applied: 5, quiz_completed: 10, webinar_attended: 15, webinar_registered: 5,
  referral: 20, resume_scan: 5, cover_letter: 5,
  job_hunter_5: 15, scholarship_explorer: 10, exam_master: 20, top_referrer: 50,
};

async function addPointsToUser(userId, points) {
  if (!userId || !points) return;
  await User.findByIdAndUpdate(userId, { $inc: { totalPoints: points } });
}

export const getMyBadges = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const badges = await UserBadge.find({ userId }).sort({ earnedAt: -1 }).limit(100).lean();
  const definitions = await BadgeDefinition.find({}).lean();
  const defMap = Object.fromEntries((definitions || []).map((d) => [d.badgeType, d]));
  const withDef = badges.map((b) => ({ ...b, ...defMap[b.badgeType] }));
  res.json({ data: withDef });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const by = (req.query.by || 'points').toLowerCase();
  if (by === 'referrals') {
    const users = await User.find({ role: 'User' }).select('name referralCount').sort({ referralCount: -1 }).limit(limit).lean();
    const ranked = users.map((u, i) => ({ rank: i + 1, userId: u._id, name: u.name || 'Anonymous', referralCount: u.referralCount || 0 }));
    return res.json({ data: ranked, by: 'referrals' });
  }
  if (by === 'applications') {
    const agg = await Application.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { userId: '$_id', name: '$user.name', applicationCount: '$count' } },
    ]);
    const ranked = agg.map((r, i) => ({ rank: i + 1, userId: r.userId, name: r.name || 'Anonymous', applicationCount: r.applicationCount }));
    return res.json({ data: ranked, by: 'applications' });
  }
  const users = await User.find({ role: 'User' }).select('name totalPoints').sort({ totalPoints: -1 }).limit(limit).lean();
  const ranked = users.map((u, i) => ({ rank: i + 1, userId: u._id, name: u.name || 'Anonymous', totalPoints: u.totalPoints || 0 }));
  res.json({ data: ranked, by: 'points' });
});

export const getMyRank = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findById(userId).select('totalPoints').lean();
  const points = user?.totalPoints || 0;
  const above = await User.countDocuments({ role: 'User', totalPoints: { $gt: points } });
  res.json({ rank: above + 1, totalPoints: points });
});

/**
 * Internal helper: award badge to user (call from apply, quiz submit, webinar attendance, etc.)
 */
export async function awardBadge(userId, badgeType, name, description, metadata = {}) {
  if (!userId || !badgeType) return null;
  const def = await BadgeDefinition.findOne({ badgeType }).lean();
  const points = def?.points ?? DEFAULT_POINTS[badgeType] ?? 10;
  const existing = await UserBadge.findOne({ userId, badgeType });
  if (existing) return existing;
  const badge = await UserBadge.create({
    userId,
    badgeType,
    name: name || def?.name || badgeType,
    description: description || def?.description,
    points,
    metadata,
  });
  await addPointsToUser(userId, points);
  return badge;
}

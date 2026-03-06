import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const LIMIT = 20;

export const getNotificationsForUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('province interests').lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  const list = await Notification.find({
    $and: [
      { $or: [{ target_province: { $exists: false } }, { target_province: { $in: [null, ''] } }, { target_province: user.province }] },
      { $or: [{ target_interest: { $exists: false } }, { target_interest: { $in: [null, ''] } }, { target_interest: { $in: user.interests || [] } }] },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(LIMIT)
    .lean();
  res.json({ data: list });
});

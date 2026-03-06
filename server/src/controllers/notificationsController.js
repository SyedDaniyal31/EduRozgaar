import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeString } from '../utils/sanitize.js';

/**
 * Create and send notification targeting province and/or interest.
 * FCM: find users matching target, send via Firebase Admin SDK (placeholder).
 */
export const sendNotification = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Title is required' });
  if (!body.message || !String(body.message).trim()) return res.status(400).json({ error: 'Message is required' });
  const doc = await Notification.create({
    title: sanitizeString(body.title),
    message: sanitizeString(body.message),
    target_province: body.target_province ? sanitizeString(body.target_province) : undefined,
    target_interest: body.target_interest ? sanitizeString(body.target_interest) : undefined,
    link: body.link ? sanitizeString(body.link) : undefined,
    delivered: false,
  });

  const q = {};
  if (body.target_province) q.province = new RegExp(body.target_province.trim(), 'i');
  if (body.target_interest) q.interests = body.target_interest;
  const users = await User.find(q).select('+fcmToken').lean();
  const tokens = (users || []).map((u) => u.fcmToken).filter(Boolean);
  // Placeholder: Firebase Admin messaging.sendEachForMulticast({ tokens, notification: { title, body } })
  if (tokens.length) doc.delivered = true;
  await doc.save();

  res.status(201).json({ message: 'Notification created', id: doc._id, targetCount: tokens.length });
});

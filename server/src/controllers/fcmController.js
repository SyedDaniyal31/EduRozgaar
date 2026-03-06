import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeString } from '../utils/sanitize.js';

export const registerFcmToken = asyncHandler(async (req, res) => {
  const token = req.body?.token ? sanitizeString(String(req.body.token)).trim() : '';
  if (!token) return res.status(400).json({ error: 'FCM token is required' });
  await User.findByIdAndUpdate(req.user.userId, { fcmToken: token });
  res.json({ message: 'FCM token registered' });
});

import crypto from 'crypto';
import { User } from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt.js';
import { validateAuthRegister, validateAuthLogin, validateForgotPassword, validateResetPassword } from '../validators/authValidator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ensureReferralCode } from '../utils/referralCode.js';
import { awardBadge } from './badgesController.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

function toSafeUser(user) {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  delete u.refreshToken;
  delete u.refreshTokenExpires;
  delete u.passwordResetToken;
  delete u.passwordResetExpires;
  return u;
}

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const FRONTEND_BASE = process.env.FRONTEND_URL || process.env.APP_URL || process.env.SITE_URL || 'http://localhost:5173';

export const register = asyncHandler(async (req, res) => {
  const { emailError, passwordError, name } = validateAuthRegister(req.body);
  if (emailError || passwordError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: { email: emailError, password: passwordError },
    });
  }
  const email = req.body.email.trim().toLowerCase();
  const referralCode = (req.body.referralCode || req.query.ref || '').trim();
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer && referrer._id) referredBy = referrer._id;
  }
  const user = await User.create({
    email,
    password: req.body.password,
    name: name || email.split('@')[0],
    role: 'User',
    referredBy,
  });
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  await ensureReferralCode(user);

  const REFERRER_POINTS = 25;
  const REFEREE_POINTS = 10;
  if (referredBy) {
    await User.findByIdAndUpdate(referredBy, {
      $inc: { referralCount: 1, totalPoints: REFERRER_POINTS, rewardPoints: REFERRER_POINTS },
    });
    await User.findByIdAndUpdate(user._id, { $inc: { totalPoints: REFEREE_POINTS, rewardPoints: REFEREE_POINTS } });
    await awardBadge(referredBy, 'referral', 'Referral Champion', 'Referred a friend');
  }

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  res.status(201).json({
    user: toSafeUser(await User.findById(user._id)),
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
});

export const login = asyncHandler(async (req, res) => {
  const { emailError, passwordError } = validateAuthLogin(req.body);
  if (emailError || passwordError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: { email: emailError, password: passwordError },
    });
  }
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  const safe = toSafeUser(await User.findById(user._id));
  res.json({
    user: safe,
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toSafeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  // Placeholder: optional token blacklist or clear refresh token in DB for this user
  // Integration point: revoke refresh tokens; notifications service can stop sending to this device
  res.json({ message: 'Logged out' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.headers['x-refresh-token'];
  if (!token) return res.status(401).json({ error: 'Refresh token required' });
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
  if (decoded.type !== 'refresh' || !decoded.userId) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  const user = await User.findById(decoded.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id.toString() });
  res.json({
    user: toSafeUser(user),
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { emailError } = validateForgotPassword(req.body);
  if (emailError) {
    return res.status(400).json({ error: 'Validation failed', details: { email: emailError } });
  }
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
  const message = 'If an account exists with this email, you will receive a password reset link shortly.';
  if (!user) {
    return res.status(200).json({ message });
  }
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${FRONTEND_BASE.replace(/\/$/, '')}/auth/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetUrl).catch((err) => {
    console.error('[forgotPassword] sendEmail failed:', err);
  });
  return res.status(200).json({ message });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { tokenError, passwordError } = validateResetPassword(req.body);
  if (tokenError || passwordError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: { token: tokenError, password: passwordError },
    });
  }
  const token = req.body.token.trim();
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  })
    .select('+password +passwordResetToken +passwordResetExpires');
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new password reset.' });
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({ message: 'Password reset successfully. You can now sign in with your new password.' });
});

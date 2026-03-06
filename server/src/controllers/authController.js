import { User } from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt.js';
import { validateAuthRegister, validateAuthLogin } from '../validators/authValidator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function toSafeUser(user) {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  delete u.refreshToken;
  delete u.refreshTokenExpires;
  return u;
}

export const register = asyncHandler(async (req, res) => {
  const { emailError, passwordError, name } = validateAuthRegister(req.body);
  if (emailError || passwordError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: { email: emailError, password: passwordError },
    });
  }
  const email = req.body.email.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = await User.create({
    email,
    password: req.body.password,
    name: name || email.split('@')[0],
    role: 'User',
  });
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  res.status(201).json({
    user: toSafeUser(user),
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

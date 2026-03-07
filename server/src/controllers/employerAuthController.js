import { Employer } from '../models/Employer.js';
import { signEmployerToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function toSafeEmployer(employer) {
  if (!employer) return null;
  const e = employer.toObject ? employer.toObject() : employer;
  delete e.password;
  return e;
}

export const employerRegister = asyncHandler(async (req, res) => {
  const { companyName, email, phone, website, companyDescription, password } = req.body;
  if (!companyName || !email || !password) {
    return res.status(400).json({ error: 'companyName, email and password are required' });
  }
  const emailNorm = email.trim().toLowerCase();
  const existing = await Employer.findOne({ email: emailNorm });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered as employer' });
  }
  const employer = await Employer.create({
    companyName: (companyName || '').trim(),
    email: emailNorm,
    phone: (phone || '').trim(),
    website: (website || '').trim(),
    companyDescription: (companyDescription || '').trim(),
    password,
  });
  const token = signEmployerToken(employer._id);
  res.status(201).json({
    employer: toSafeEmployer(await Employer.findById(employer._id)),
    accessToken: token,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
});

export const employerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const emailNorm = email.trim().toLowerCase();
  const employer = await Employer.findOne({ email: emailNorm }).select('+password');
  if (!employer || !(await employer.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signEmployerToken(employer._id);
  res.json({
    employer: toSafeEmployer(await Employer.findById(employer._id)),
    accessToken: token,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
});

export const employerMe = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.employer.employerId);
  if (!employer) return res.status(404).json({ error: 'Employer not found' });
  res.json({ employer: toSafeEmployer(employer) });
});

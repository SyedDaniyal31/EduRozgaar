import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeString } from '../utils/sanitize.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = asyncHandler(async (req, res) => {
  const email = sanitizeString(req.body?.email || '').toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  let doc = await NewsletterSubscriber.findOne({ email });
  if (doc) {
    doc.subscribed = true;
    doc.frequency = req.body.frequency || doc.frequency || 'weekly';
    await doc.save();
  } else {
    doc = await NewsletterSubscriber.create({
      email,
      frequency: req.body.frequency || 'weekly',
    });
  }
  res.status(201).json({ message: 'Subscribed to student alerts', email: doc.email });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const email = sanitizeString(req.body?.email || req.query?.email || '').toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const doc = await NewsletterSubscriber.findOneAndUpdate({ email }, { subscribed: false }, { new: true });
  if (!doc) return res.status(404).json({ error: 'Email not found' });
  res.json({ message: 'Unsubscribed', email: doc.email });
});

/**
 * Placeholder: send daily/weekly digest. Integrate Nodemailer/SendGrid in Phase-6.
 */
export const sendDaily = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ subscribed: true }).limit(100).lean();
  // Placeholder: in production, queue emails with trending jobs, scholarships, admissions
  res.json({
    message: 'Send-daily placeholder. Integrate Nodemailer/SendGrid for actual delivery.',
    subscriberCount: subscribers.length,
  });
});

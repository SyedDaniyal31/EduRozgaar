import { Notification } from '../../models/Notification.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.target_province) filter.target_province = new RegExp(sanitizeString(q.target_province), 'i');
  if (q.target_interest) filter.target_interest = new RegExp(sanitizeString(q.target_interest), 'i');
  if (q.delivered !== undefined) filter.delivered = q.delivered === 'true' || q.delivered === true;
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.message || !String(body.message).trim()) return res.status(400).json({ error: 'Validation failed', details: { message: 'Message is required' } });
  const doc = await Notification.create({
    title: sanitizeString(body.title),
    message: sanitizeString(body.message),
    target_province: body.target_province ? sanitizeString(body.target_province) : undefined,
    target_interest: body.target_interest ? sanitizeString(body.target_interest) : undefined,
    delivered: body.delivered ?? false,
    link: body.link ? sanitizeString(body.link) : undefined,
  });
  res.status(201).json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Notification.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Notification not found' });
  res.status(204).send();
});

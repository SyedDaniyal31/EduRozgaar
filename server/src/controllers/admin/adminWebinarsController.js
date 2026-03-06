import { Webinar } from '../../models/Webinar.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const query = status ? { status } : {};
  const [data, total] = await Promise.all([
    Webinar.find(query).sort({ scheduledAt: -1 }).skip(skip).limit(limit).lean(),
    Webinar.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.scheduledAt) return res.status(400).json({ error: 'Validation failed', details: { scheduledAt: 'Scheduled date is required' } });
  const doc = await Webinar.create({
    title: sanitizeString(body.title),
    description: body.description ? sanitizeString(body.description) : undefined,
    scheduledAt: new Date(body.scheduledAt),
    durationMinutes: body.durationMinutes || 60,
    meetingUrl: body.meetingUrl ? sanitizeString(body.meetingUrl) : undefined,
    recordingUrl: body.recordingUrl ? sanitizeString(body.recordingUrl) : undefined,
    status: body.status || 'scheduled',
    isSponsored: body.isSponsored === true,
  });
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await Webinar.findById(id);
  if (!doc) return res.status(404).json({ error: 'Webinar not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.description !== undefined) doc.description = body.description ? sanitizeString(body.description) : undefined;
  if (body.scheduledAt !== undefined) doc.scheduledAt = new Date(body.scheduledAt);
  if (body.durationMinutes !== undefined) doc.durationMinutes = body.durationMinutes;
  if (body.meetingUrl !== undefined) doc.meetingUrl = body.meetingUrl ? sanitizeString(body.meetingUrl) : undefined;
  if (body.recordingUrl !== undefined) doc.recordingUrl = body.recordingUrl ? sanitizeString(body.recordingUrl) : undefined;
  if (body.status !== undefined) doc.status = body.status;
  if (body.isSponsored !== undefined) doc.isSponsored = !!body.isSponsored;
  await doc.save();
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Webinar.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Webinar not found' });
  res.status(204).send();
});

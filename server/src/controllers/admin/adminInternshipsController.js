import { Internship } from '../../models/Internship.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { slugify } from '../../utils/slugify.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.organization) filter.organization = new RegExp(sanitizeString(q.organization), 'i');
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ title: re }, { organization: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Internship.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Internship.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.organization || !String(body.organization).trim()) return res.status(400).json({ error: 'Validation failed', details: { organization: 'Organization is required' } });
  const slug = body.slug || slugify(body.title) + '-' + Date.now().toString(36);
  const doc = await Internship.create({
    title: sanitizeString(body.title),
    slug,
    organization: sanitizeString(body.organization),
    location: body.location ? sanitizeString(body.location) : undefined,
    province: body.province ? sanitizeString(body.province) : undefined,
    duration: body.duration ? sanitizeString(body.duration) : undefined,
    skillset: Array.isArray(body.skillset) ? body.skillset.map(sanitizeString).filter(Boolean) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    applicationLink: body.applicationLink ? sanitizeString(body.applicationLink) : undefined,
    applyInPlatform: body.applyInPlatform === true,
    status: body.status || 'active',
    deadline: body.deadline ? new Date(body.deadline) : undefined,
    postedBy: req.user?.userId,
    isPaid: body.isPaid === true,
    paidUntil: body.paidUntil ? new Date(body.paidUntil) : undefined,
  });
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await Internship.findById(id);
  if (!doc) return res.status(404).json({ error: 'Internship not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.organization !== undefined) doc.organization = sanitizeString(body.organization);
  if (body.location !== undefined) doc.location = body.location ? sanitizeString(body.location) : undefined;
  if (body.province !== undefined) doc.province = body.province ? sanitizeString(body.province) : undefined;
  if (body.duration !== undefined) doc.duration = body.duration ? sanitizeString(body.duration) : undefined;
  if (body.skillset !== undefined) doc.skillset = Array.isArray(body.skillset) ? body.skillset.map(sanitizeString).filter(Boolean) : doc.skillset;
  if (body.description !== undefined) doc.description = body.description ? sanitizeString(body.description) : undefined;
  if (body.applicationLink !== undefined) doc.applicationLink = body.applicationLink ? sanitizeString(body.applicationLink) : undefined;
  if (body.applyInPlatform !== undefined) doc.applyInPlatform = !!body.applyInPlatform;
  if (body.status !== undefined) doc.status = body.status;
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.isPaid !== undefined) doc.isPaid = !!body.isPaid;
  if (body.paidUntil !== undefined) doc.paidUntil = body.paidUntil ? new Date(body.paidUntil) : undefined;
  if (doc.isModified('title') && !body.slug) doc.slug = slugify(doc.title) + '-' + doc._id.toString().slice(-6);
  await doc.save();
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Internship.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Internship not found' });
  res.status(204).send();
});

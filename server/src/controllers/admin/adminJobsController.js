import { Job } from '../../models/Job.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { jobSlug } from '../../utils/slugify.js';
import { cacheDelPattern } from '../../config/redis.js';
import { CACHE_KEYS } from '../../utils/cacheKeys.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.province) filter.province = new RegExp(sanitizeString(q.province), 'i');
  if (q.category) filter.category = new RegExp(sanitizeString(q.category), 'i');
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ title: re }, { company: re }, { organization: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Job.countDocuments(query),
  ]);
  const pagination = paginate(page, limit, total);
  res.json(listResponse(data, pagination, req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.company && !body.organization) return res.status(400).json({ error: 'Validation failed', details: { company: 'Company or organization is required' } });
  const slug = body.slug || jobSlug(body.title, body.province || body.location || '');
  const doc = await Job.create({
    title: sanitizeString(body.title),
    slug,
    company: sanitizeString(body.company || body.organization),
    organization: body.organization ? sanitizeString(body.organization) : undefined,
    location: body.location ? sanitizeString(body.location) : undefined,
    province: body.province ? sanitizeString(body.province) : undefined,
    category: body.category ? sanitizeString(body.category) : undefined,
    type: body.type || 'full-time',
    description: body.description ? sanitizeString(body.description) : undefined,
    requirements: Array.isArray(body.requirements) ? body.requirements.map(sanitizeString).filter(Boolean) : undefined,
    applicationInstructions: body.applicationInstructions ? sanitizeString(body.applicationInstructions) : undefined,
    status: body.status || 'active',
    deadline: body.deadline ? new Date(body.deadline) : undefined,
    logoUrl: body.logoUrl ? sanitizeString(body.logoUrl) : undefined,
    postedBy: req.user?.userId,
    isFeatured: body.isFeatured === true,
    isSponsored: body.isSponsored === true,
  });
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await Job.findById(id);
  if (!doc) return res.status(404).json({ error: 'Job not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.company !== undefined) doc.company = sanitizeString(body.company);
  if (body.organization !== undefined) doc.organization = sanitizeString(body.organization);
  if (body.location !== undefined) doc.location = sanitizeString(body.location);
  if (body.province !== undefined) doc.province = sanitizeString(body.province);
  if (body.category !== undefined) doc.category = sanitizeString(body.category);
  if (body.type !== undefined) doc.type = body.type;
  if (body.description !== undefined) doc.description = sanitizeString(body.description);
  if (body.requirements !== undefined) doc.requirements = Array.isArray(body.requirements) ? body.requirements.map(sanitizeString).filter(Boolean) : doc.requirements;
  if (body.applicationInstructions !== undefined) doc.applicationInstructions = sanitizeString(body.applicationInstructions);
  if (body.status !== undefined) doc.status = body.status;
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.logoUrl !== undefined) doc.logoUrl = sanitizeString(body.logoUrl);
  if (body.isFeatured !== undefined) doc.isFeatured = !!body.isFeatured;
  if (body.isSponsored !== undefined) doc.isSponsored = !!body.isSponsored;
  if (body.approvalStatus !== undefined) doc.approvalStatus = body.approvalStatus;
  if (doc.isModified('title') || doc.isModified('province') || doc.isModified('location')) doc.slug = body.slug || jobSlug(doc.title, doc.province || doc.location || '');
  await doc.save();
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(doc);
});

export const approveJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Job.findByIdAndUpdate(id, { status: 'active', approvalStatus: 'approved' }, { new: true });
  if (!doc) return res.status(404).json({ error: 'Job not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(doc);
});

export const rejectJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Job.findByIdAndUpdate(id, { approvalStatus: 'rejected' }, { new: true });
  if (!doc) return res.status(404).json({ error: 'Job not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Job.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Job not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.status(204).send();
});

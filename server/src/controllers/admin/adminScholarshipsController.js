import { Scholarship } from '../../models/Scholarship.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { scholarshipSlug } from '../../utils/slugify.js';
import { cacheDelPattern } from '../../config/redis.js';
import { CACHE_KEYS } from '../../utils/cacheKeys.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.level) filter.level = q.level;
  if (q.country) filter.country = new RegExp(sanitizeString(q.country), 'i');
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ title: re }, { provider: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Scholarship.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Scholarship.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.provider || !String(body.provider).trim()) return res.status(400).json({ error: 'Validation failed', details: { provider: 'Provider is required' } });
  const slug = body.slug || scholarshipSlug(body.title, body.country || '');
  const doc = await Scholarship.create({
    title: sanitizeString(body.title),
    slug,
    provider: sanitizeString(body.provider),
    level: body.level || 'Other',
    country: body.country ? sanitizeString(body.country) : undefined,
    amount: body.amount ? sanitizeString(body.amount) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    eligibility: Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : undefined,
    applicationInstructions: body.applicationInstructions ? sanitizeString(body.applicationInstructions) : undefined,
    deadline: body.deadline ? new Date(body.deadline) : undefined,
    link: body.link ? sanitizeString(body.link) : undefined,
    status: body.status || 'active',
    logoUrl: body.logoUrl ? sanitizeString(body.logoUrl) : undefined,
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
  const doc = await Scholarship.findById(id);
  if (!doc) return res.status(404).json({ error: 'Scholarship not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.provider !== undefined) doc.provider = sanitizeString(body.provider);
  if (body.level !== undefined) doc.level = body.level;
  if (body.country !== undefined) doc.country = sanitizeString(body.country);
  if (body.amount !== undefined) doc.amount = sanitizeString(body.amount);
  if (body.description !== undefined) doc.description = sanitizeString(body.description);
  if (body.eligibility !== undefined) doc.eligibility = Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : doc.eligibility;
  if (body.applicationInstructions !== undefined) doc.applicationInstructions = sanitizeString(body.applicationInstructions);
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.link !== undefined) doc.link = sanitizeString(body.link);
  if (body.status !== undefined) doc.status = body.status;
  if (body.logoUrl !== undefined) doc.logoUrl = sanitizeString(body.logoUrl);
  if (body.isFeatured !== undefined) doc.isFeatured = !!body.isFeatured;
  if (body.isSponsored !== undefined) doc.isSponsored = !!body.isSponsored;
  if (doc.isModified('title') || doc.isModified('country')) doc.slug = body.slug || scholarshipSlug(doc.title, doc.country || '');
  await doc.save();
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Scholarship.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Scholarship not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_TRENDING);
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.status(204).send();
});

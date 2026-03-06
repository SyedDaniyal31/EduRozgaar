import { ForeignStudy } from '../../models/ForeignStudy.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { foreignStudySlug } from '../../utils/slugify.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.country) filter.country = new RegExp(sanitizeString(q.country), 'i');
  if (q.level) filter.level = q.level;
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ country: re }, { program: re }, { institution: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    ForeignStudy.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ForeignStudy.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.country || !String(body.country).trim()) return res.status(400).json({ error: 'Validation failed', details: { country: 'Country is required' } });
  const slug = body.slug || foreignStudySlug(body.country, body.program || '');
  const doc = await ForeignStudy.create({
    country: sanitizeString(body.country),
    program: body.program ? sanitizeString(body.program) : undefined,
    slug,
    level: body.level || 'Other',
    institution: body.institution ? sanitizeString(body.institution) : undefined,
    requirements: Array.isArray(body.requirements) ? body.requirements.map(sanitizeString).filter(Boolean) : undefined,
    deadline: body.deadline ? new Date(body.deadline) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    link: body.link ? sanitizeString(body.link) : undefined,
    status: body.status || 'active',
    imageUrl: body.imageUrl ? sanitizeString(body.imageUrl) : undefined,
  });
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await ForeignStudy.findById(id);
  if (!doc) return res.status(404).json({ error: 'Foreign study not found' });
  if (body.country !== undefined) doc.country = sanitizeString(body.country);
  if (body.program !== undefined) doc.program = sanitizeString(body.program);
  if (body.level !== undefined) doc.level = body.level;
  if (body.institution !== undefined) doc.institution = sanitizeString(body.institution);
  if (body.requirements !== undefined) doc.requirements = Array.isArray(body.requirements) ? body.requirements.map(sanitizeString).filter(Boolean) : doc.requirements;
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.description !== undefined) doc.description = sanitizeString(body.description);
  if (body.link !== undefined) doc.link = sanitizeString(body.link);
  if (body.status !== undefined) doc.status = body.status;
  if (body.imageUrl !== undefined) doc.imageUrl = sanitizeString(body.imageUrl);
  if (doc.isModified('country') || doc.isModified('program')) doc.slug = body.slug || foreignStudySlug(doc.country, doc.program || '');
  await doc.save();
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await ForeignStudy.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Foreign study not found' });
  res.status(204).send();
});

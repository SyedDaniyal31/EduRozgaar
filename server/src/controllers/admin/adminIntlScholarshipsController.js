import { IntlScholarship } from '../../models/IntlScholarship.js';
import { University } from '../../models/University.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildScholarshipQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.country) filter.country = new RegExp(sanitizeString(q.country), 'i');
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ title: re }, { country: re }, { university: re }];
  }
  return filter;
}

export const listScholarships = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildScholarshipQuery(req.query);
  const [data, total] = await Promise.all([
    IntlScholarship.find(query).populate('universityId', 'name country').sort({ deadline: 1 }).skip(skip).limit(limit).lean(),
    IntlScholarship.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const createScholarship = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  if (!body.country || !String(body.country).trim()) return res.status(400).json({ error: 'Validation failed', details: { country: 'Country is required' } });
  const doc = await IntlScholarship.create({
    title: sanitizeString(body.title),
    country: sanitizeString(body.country),
    university: body.university ? sanitizeString(body.university) : undefined,
    universityId: body.universityId && mongoose.Types.ObjectId.isValid(body.universityId) ? body.universityId : undefined,
    deadline: body.deadline ? new Date(body.deadline) : undefined,
    applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : undefined,
    visaRequirements: body.visaRequirements ? sanitizeString(body.visaRequirements) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    eligibility: Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : undefined,
    link: body.link ? sanitizeString(body.link) : undefined,
    status: body.status || 'active',
  });
  res.status(201).json(doc);
});

export const updateScholarship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await IntlScholarship.findById(id);
  if (!doc) return res.status(404).json({ error: 'Scholarship not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.country !== undefined) doc.country = sanitizeString(body.country);
  if (body.university !== undefined) doc.university = body.university ? sanitizeString(body.university) : undefined;
  if (body.universityId !== undefined) doc.universityId = body.universityId && mongoose.Types.ObjectId.isValid(body.universityId) ? body.universityId : undefined;
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.applicationDeadline !== undefined) doc.applicationDeadline = body.applicationDeadline ? new Date(body.applicationDeadline) : undefined;
  if (body.visaRequirements !== undefined) doc.visaRequirements = body.visaRequirements ? sanitizeString(body.visaRequirements) : undefined;
  if (body.description !== undefined) doc.description = body.description ? sanitizeString(body.description) : undefined;
  if (body.eligibility !== undefined) doc.eligibility = Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : doc.eligibility;
  if (body.link !== undefined) doc.link = body.link ? sanitizeString(body.link) : undefined;
  if (body.status !== undefined) doc.status = body.status;
  await doc.save();
  res.json(doc);
});

export const removeScholarship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await IntlScholarship.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Scholarship not found' });
  res.status(204).send();
});

export const listUniversities = asyncHandler(async (req, res) => {
  const data = await University.find({}).sort({ name: 1 }).lean();
  res.json({ data });
});

export const createUniversity = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.name || !String(body.name).trim()) return res.status(400).json({ error: 'Validation failed', details: { name: 'Name is required' } });
  if (!body.country || !String(body.country).trim()) return res.status(400).json({ error: 'Validation failed', details: { country: 'Country is required' } });
  const doc = await University.create({
    name: sanitizeString(body.name),
    country: sanitizeString(body.country),
    website: body.website ? sanitizeString(body.website) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    status: body.status || 'active',
  });
  res.status(201).json(doc);
});

export const updateUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await University.findById(id);
  if (!doc) return res.status(404).json({ error: 'University not found' });
  if (body.name !== undefined) doc.name = sanitizeString(body.name);
  if (body.country !== undefined) doc.country = sanitizeString(body.country);
  if (body.website !== undefined) doc.website = body.website ? sanitizeString(body.website) : undefined;
  if (body.description !== undefined) doc.description = body.description ? sanitizeString(body.description) : undefined;
  if (body.status !== undefined) doc.status = body.status;
  await doc.save();
  res.json(doc);
});

export const removeUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await University.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'University not found' });
  res.status(204).send();
});

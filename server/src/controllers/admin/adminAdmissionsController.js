import { Admission } from '../../models/Admission.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { admissionSlug } from '../../utils/slugify.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.university) filter.institution = new RegExp(sanitizeString(q.university), 'i');
  if (q.province) filter.province = new RegExp(sanitizeString(q.province), 'i');
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ program: re }, { institution: re }, { department: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Admission.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Admission.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.program || !String(body.program).trim()) return res.status(400).json({ error: 'Validation failed', details: { program: 'Program is required' } });
  const institution = sanitizeString(body.institution || body.university);
  if (!institution) return res.status(400).json({ error: 'Validation failed', details: { institution: 'Institution or university is required' } });
  const slug = body.slug || admissionSlug(body.program, institution);
  const doc = await Admission.create({
    program: sanitizeString(body.program),
    slug,
    institution,
    department: body.department ? sanitizeString(body.department) : undefined,
    province: body.province ? sanitizeString(body.province) : undefined,
    session: body.session ? sanitizeString(body.session) : undefined,
    deadline: body.deadline || body.application_deadline ? new Date(body.deadline || body.application_deadline) : undefined,
    description: body.description ? sanitizeString(body.description) : undefined,
    eligibility: Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : undefined,
    applicationInstructions: body.applicationInstructions ? sanitizeString(body.applicationInstructions) : undefined,
    link: body.link ? sanitizeString(body.link) : undefined,
    status: body.status || 'active',
    logoUrl: body.logoUrl ? sanitizeString(body.logoUrl) : undefined,
  });
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await Admission.findById(id);
  if (!doc) return res.status(404).json({ error: 'Admission not found' });
  if (body.program !== undefined) doc.program = sanitizeString(body.program);
  if (body.institution !== undefined) doc.institution = sanitizeString(body.institution);
  if (body.department !== undefined) doc.department = sanitizeString(body.department);
  if (body.province !== undefined) doc.province = sanitizeString(body.province);
  if (body.session !== undefined) doc.session = sanitizeString(body.session);
  if (body.deadline !== undefined) doc.deadline = body.deadline ? new Date(body.deadline) : undefined;
  if (body.description !== undefined) doc.description = sanitizeString(body.description);
  if (body.eligibility !== undefined) doc.eligibility = Array.isArray(body.eligibility) ? body.eligibility.map(sanitizeString).filter(Boolean) : doc.eligibility;
  if (body.applicationInstructions !== undefined) doc.applicationInstructions = sanitizeString(body.applicationInstructions);
  if (body.link !== undefined) doc.link = sanitizeString(body.link);
  if (body.status !== undefined) doc.status = body.status;
  if (body.logoUrl !== undefined) doc.logoUrl = sanitizeString(body.logoUrl);
  if (doc.isModified('program') || doc.isModified('institution')) doc.slug = body.slug || admissionSlug(doc.program, doc.institution);
  await doc.save();
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Admission.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Admission not found' });
  res.status(204).send();
});

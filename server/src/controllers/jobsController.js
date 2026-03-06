import { Job } from '../models/Job.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listResponse, paginate } from '../utils/apiResponse.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function buildJobQuery(q) {
  const filter = { status: 'active' };
  if (q.province) filter.province = new RegExp(q.province.trim(), 'i');
  if (q.category) filter.category = new RegExp(q.category.trim(), 'i');
  if (q.organization) {
    const re = new RegExp(q.organization.trim(), 'i');
    filter.$or = [{ company: re }, { organization: re }];
  }
  if (q.deadline) {
    const d = new Date(q.deadline);
    if (!isNaN(d.getTime())) filter.deadline = { $gte: d };
  }
  if (q.search && q.search.trim()) {
    const re = new RegExp(q.search.trim(), 'i');
    const searchOr = [{ title: re }, { company: re }, { organization: re }, { location: re }, { province: re }];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
      delete filter.$or;
    } else {
      filter.$or = searchOr;
    }
  }
  return filter;
}

function buildJobSort(sort) {
  if (sort === 'deadline') return { deadline: 1, createdAt: -1 };
  return { createdAt: -1 };
}

export const getJobs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const sort = req.query.sort === 'deadline' ? 'deadline' : 'newest';
  const query = buildJobQuery(req.query);
  const [data, total] = await Promise.all([
    Job.find(query).sort(buildJobSort(sort)).skip(skip).limit(limit).lean(),
    Job.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const getJobByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug;
  const job = isId
    ? await Job.findOne({ _id: idOrSlug, status: 'active' }).lean()
    : await Job.findOne({ slug: idOrSlug, status: 'active' }).lean();
  if (!job) return res.status(404).json({ error: 'Job not found' });
  await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });
  const relatedFilter = { status: 'active', _id: { $ne: job._id } };
  if (job.category) relatedFilter.category = job.category;
  else if (job.province) relatedFilter.province = job.province;
  const related = await Job.find(relatedFilter).sort({ createdAt: -1 }).limit(4).lean();
  res.json({ ...job, views: (job.views || 0) + 1, related });
});

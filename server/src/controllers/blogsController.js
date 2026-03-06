import { Blog } from '../models/Blog.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listResponse, paginate } from '../utils/apiResponse.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function buildQuery(q) {
  const filter = { status: 'published' };
  if (q.category) filter.category = new RegExp(String(q.category).trim(), 'i');
  if (q.tags) {
    const tags = Array.isArray(q.tags) ? q.tags : [q.tags].filter(Boolean).map(String);
    if (tags.length) filter.tags = { $in: tags };
  }
  if (q.search && String(q.search).trim()) {
    const re = new RegExp(String(q.search).trim(), 'i');
    filter.$or = [{ title: re }, { content: re }, { excerpt: re }];
  }
  return filter;
}

export const getBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const sort = req.query.sort === 'views' ? { views: -1, publishedAt: -1 } : { publishedAt: -1, createdAt: -1 };
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Blog.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Blog.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const getBlogByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug;
  const blog = isId
    ? await Blog.findOne({ _id: idOrSlug, status: 'published' }).lean()
    : await Blog.findOne({ slug: idOrSlug, status: 'published' }).lean();
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
  res.json({ ...blog, views: (blog.views || 0) + 1 });
});

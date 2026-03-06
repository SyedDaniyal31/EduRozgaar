import { Blog } from '../../models/Blog.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { listResponse, paginate } from '../../utils/apiResponse.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { blogSlug } from '../../utils/slugify.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function buildQuery(q) {
  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.category) filter.category = new RegExp(sanitizeString(q.category), 'i');
  if (q.tags) {
    const tags = Array.isArray(q.tags) ? q.tags : [q.tags].filter(Boolean).map(String);
    if (tags.length) filter.tags = { $in: tags.map(sanitizeString) };
  }
  if (q.search && sanitizeString(q.search)) {
    const re = new RegExp(sanitizeString(q.search), 'i');
    filter.$or = [{ title: re }, { content: re }, { excerpt: re }];
  }
  return filter;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const query = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Blog.countDocuments(query),
  ]);
  res.json(listResponse(data, paginate(page, limit, total), req.query));
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.title || !String(body.title).trim()) return res.status(400).json({ error: 'Validation failed', details: { title: 'Title is required' } });
  const slug = body.slug || blogSlug(body.title);
  const doc = await Blog.create({
    title: sanitizeString(body.title),
    slug,
    excerpt: body.excerpt ? sanitizeString(body.excerpt) : undefined,
    content: body.content ? sanitizeString(body.content) : undefined,
    tags: Array.isArray(body.tags) ? body.tags.map(sanitizeString).filter(Boolean) : [],
    category: body.category ? sanitizeString(body.category) : undefined,
    author: body.author || req.user?.userId,
    views: body.views ?? 0,
    status: body.status || 'draft',
    publishedAt: body.publishedAt || (body.status === 'published' ? new Date() : undefined),
    imageUrl: body.imageUrl ? sanitizeString(body.imageUrl) : undefined,
  });
  res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body || {};
  const doc = await Blog.findById(id);
  if (!doc) return res.status(404).json({ error: 'Blog not found' });
  if (body.title !== undefined) doc.title = sanitizeString(body.title);
  if (body.excerpt !== undefined) doc.excerpt = sanitizeString(body.excerpt);
  if (body.content !== undefined) doc.content = sanitizeString(body.content);
  if (body.tags !== undefined) doc.tags = Array.isArray(body.tags) ? body.tags.map(sanitizeString).filter(Boolean) : doc.tags;
  if (body.category !== undefined) doc.category = sanitizeString(body.category);
  if (body.views !== undefined) doc.views = Number(body.views) || 0;
  if (body.status !== undefined) {
    doc.status = body.status;
    if (body.status === 'published' && !doc.publishedAt) doc.publishedAt = new Date();
  }
  if (body.publishedAt !== undefined) doc.publishedAt = body.publishedAt ? new Date(body.publishedAt) : undefined;
  if (body.imageUrl !== undefined) doc.imageUrl = sanitizeString(body.imageUrl);
  if (doc.isModified('title')) doc.slug = body.slug || blogSlug(doc.title);
  await doc.save();
  res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const doc = await Blog.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Blog not found' });
  res.status(204).send();
});

import { Job } from '../models/Job.js';
import { Scholarship } from '../models/Scholarship.js';
import { AdSlotConfig } from '../models/AdSlotConfig.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheGet, cacheSet, cacheDelPattern } from '../config/redis.js';
import { CACHE_KEYS } from '../utils/cacheKeys.js';
import { sanitizeString } from '../utils/sanitize.js';

const FEATURED_LIMIT = 10;
const SPONSORED_LIMIT = 10;
const CACHE_TTL = 300;

export const getFeaturedJobs = asyncHandler(async (req, res) => {
  let data = await cacheGet(CACHE_KEYS.FEATURED_JOBS);
  if (!data) {
    data = await Job.find({ status: 'active', isFeatured: true }).sort({ createdAt: -1 }).limit(FEATURED_LIMIT).lean();
    await cacheSet(CACHE_KEYS.FEATURED_JOBS, data, CACHE_TTL);
  }
  res.json({ data });
});

export const getSponsoredJobs = asyncHandler(async (req, res) => {
  const data = await Job.find({ status: 'active', isSponsored: true }).sort({ createdAt: -1 }).limit(SPONSORED_LIMIT).lean();
  res.json({ data });
});

export const getFeaturedScholarships = asyncHandler(async (req, res) => {
  let data = await cacheGet(CACHE_KEYS.FEATURED_SCHOLARSHIPS);
  if (!data) {
    data = await Scholarship.find({ status: 'active', isFeatured: true }).sort({ deadline: 1 }).limit(FEATURED_LIMIT).lean();
    await cacheSet(CACHE_KEYS.FEATURED_SCHOLARSHIPS, data, CACHE_TTL);
  }
  res.json({ data });
});

export const getSponsoredScholarships = asyncHandler(async (req, res) => {
  const data = await Scholarship.find({ status: 'active', isSponsored: true }).sort({ createdAt: -1 }).limit(SPONSORED_LIMIT).lean();
  res.json({ data });
});

export const getAdSlots = asyncHandler(async (req, res) => {
  const slots = await AdSlotConfig.find({ active: true }).lean();
  res.json({ data: slots });
});

export const listAdSlots = asyncHandler(async (req, res) => {
  const slots = await AdSlotConfig.find({}).sort({ placement: 1 }).lean();
  res.json({ data: slots });
});

export const createAdSlot = asyncHandler(async (req, res) => {
  const body = req.body || {};
  if (!body.slotId || !String(body.slotId).trim()) return res.status(400).json({ error: 'slotId is required' });
  const doc = await AdSlotConfig.create({
    slotId: sanitizeString(body.slotId),
    name: sanitizeString(body.name || body.slotId),
    placement: body.placement || 'sidebar',
    dimensions: body.dimensions ? sanitizeString(body.dimensions) : undefined,
    active: body.active !== false,
  });
  res.status(201).json(doc);
});

export const updateAdSlot = asyncHandler(async (req, res) => {
  const doc = await AdSlotConfig.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body?.name != null && { name: sanitizeString(req.body.name) }),
      ...(req.body?.placement != null && { placement: req.body.placement }),
      ...(req.body?.dimensions != null && { dimensions: sanitizeString(req.body.dimensions) }),
      ...(req.body?.active !== undefined && { active: !!req.body.active }),
    },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: 'Ad slot not found' });
  res.json(doc);
});

export const deleteAdSlot = asyncHandler(async (req, res) => {
  const doc = await AdSlotConfig.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Ad slot not found' });
  res.json({ message: 'Deleted' });
});

/** Admin: set job featured/sponsored */
export const setJobMonetization = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body?.isFeatured !== undefined && { isFeatured: !!req.body.isFeatured }),
      ...(req.body?.isSponsored !== undefined && { isSponsored: !!req.body.isSponsored }),
    },
    { new: true }
  );
  if (!job) return res.status(404).json({ error: 'Job not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(job);
});

/** Admin: set scholarship featured/sponsored */
export const setScholarshipMonetization = asyncHandler(async (req, res) => {
  const doc = await Scholarship.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body?.isFeatured !== undefined && { isFeatured: !!req.body.isFeatured }),
      ...(req.body?.isSponsored !== undefined && { isSponsored: !!req.body.isSponsored }),
    },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: 'Scholarship not found' });
  await cacheDelPattern(CACHE_KEYS.PREFIX_FEATURED);
  res.json(doc);
});

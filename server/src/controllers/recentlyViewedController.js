import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Scholarship } from '../models/Scholarship.js';
import { Admission } from '../models/Admission.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_RECENT = 10;

async function addRecentlyViewed(userId, type, listingId) {
  const oid = mongoose.Types.ObjectId.isValid(listingId) ? new mongoose.Types.ObjectId(listingId) : null;
  if (!oid) return;
  const field = type === 'job' ? 'recentlyViewedJobs' : type === 'scholarship' ? 'recentlyViewedScholarships' : 'recentlyViewedAdmissions';
  const Model = type === 'job' ? Job : type === 'scholarship' ? Scholarship : Admission;
  const exists = await Model.exists({ _id: oid, status: 'active' });
  if (!exists) return;
  const user = await User.findById(userId);
  if (!user) return;
  let arr = user[field] || [];
  arr = arr.filter((x) => x.toString() !== oid.toString());
  arr.push(oid);
  user[field] = arr.slice(-MAX_RECENT);
  await user.save();
}

export const recordRecentlyViewed = asyncHandler(async (req, res) => {
  const { type, id } = req.body || {};
  if (!type || !id) return res.status(400).json({ error: 'type and id are required' });
  if (!['job', 'scholarship', 'admission'].includes(type)) return res.status(400).json({ error: 'type must be job, scholarship, or admission' });
  await addRecentlyViewed(req.user.userId, type, id);
  res.json({ ok: true });
});

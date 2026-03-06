import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Scholarship } from '../models/Scholarship.js';
import { Admission } from '../models/Admission.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';

async function toggleSaved(userId, collection, id, add) {
  const oid = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
  if (!oid) return { found: false };
  const Model = collection === 'jobs' ? Job : collection === 'scholarships' ? Scholarship : Admission;
  const doc = await Model.findOne({ _id: oid, status: 'active' });
  if (!doc) return { found: false };
  const field = collection === 'jobs' ? 'savedJobs' : collection === 'scholarships' ? 'savedScholarships' : 'savedAdmissions';
  const user = await User.findById(userId);
  if (!user) return { found: false };
  let arr = user[field] || [];
  if (add) {
    if (arr.some((x) => x.toString() === oid.toString())) return { found: true, saved: true };
    arr.push(oid);
  } else {
    arr = arr.filter((x) => x.toString() !== oid.toString());
  }
  user[field] = arr;
  await user.save();
  return { found: true, saved: add };
}

export const saveJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await toggleSaved(req.user.userId, 'jobs', id, true);
  if (!result.found) return res.status(404).json({ error: 'Job not found' });
  res.json({ saved: true });
});

export const unsaveJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await toggleSaved(req.user.userId, 'jobs', id, false);
  res.json({ saved: false });
});

export const saveScholarship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await toggleSaved(req.user.userId, 'scholarships', id, true);
  if (!result.found) return res.status(404).json({ error: 'Scholarship not found' });
  res.json({ saved: true });
});

export const unsaveScholarship = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await toggleSaved(req.user.userId, 'scholarships', id, false);
  res.json({ saved: false });
});

export const saveAdmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await toggleSaved(req.user.userId, 'admissions', id, true);
  if (!result.found) return res.status(404).json({ error: 'Admission not found' });
  res.json({ saved: true });
});

export const unsaveAdmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await toggleSaved(req.user.userId, 'admissions', id, false);
  res.json({ saved: false });
});

export const getSaved = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate('savedJobs')
    .populate('savedScholarships')
    .populate('savedAdmissions')
    .lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    savedJobs: (user.savedJobs || []).filter((j) => j && j.status === 'active'),
    savedScholarships: (user.savedScholarships || []).filter((s) => s && s.status === 'active'),
    savedAdmissions: (user.savedAdmissions || []).filter((a) => a && a.status === 'active'),
  });
});

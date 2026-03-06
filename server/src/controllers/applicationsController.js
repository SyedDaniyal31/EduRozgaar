import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import asyncHandler from '../utils/asyncHandler.js';
import { awardBadge } from './badgesController.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const resumeURL = req.file ? (req.file.originalname || 'resume_uploaded') : null;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'active') return res.status(400).json({ error: 'Job is not open for applications' });

  if (job.applyType === 'external') {
    return res.status(400).json({ error: 'This job requires external application. Use the official link.' });
  }

  const existing = await Application.findOne({ userId, jobId });
  if (existing) return res.status(400).json({ error: 'You have already applied to this job' });

  const application = await Application.create({
    userId,
    jobId,
    resumeURL,
    status: 'submitted',
  });

  const appCount = await Application.countDocuments({ userId });
  await awardBadge(userId, 'job_applied', 'First Application', 'Applied to your first job');
  if (appCount >= 5) await awardBadge(userId, 'job_hunter_5', 'Job Hunter', '5 applications submitted');

  res.status(201).json({
    id: application._id,
    message: 'Application submitted successfully',
    status: application.status,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const applications = await Application.find({ userId })
    .populate('jobId', 'title organization province deadline slug')
    .sort({ appliedDate: -1 })
    .lean();

  res.json({
    data: applications.map((a) => ({
      _id: a._id,
      job: a.jobId,
      status: a.status,
      appliedDate: a.appliedDate,
      resumeURL: a.resumeURL,
    })),
  });
});

import { Job } from '../models/Job.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * Placeholder NLP extraction. In production use pdf-parse + mammoth for DOCX + NLP/lib for skills.
 */
function extractFromFile(buffer, mimetype) {
  const skills = ['Communication', 'Teamwork', 'Microsoft Office', 'Problem Solving', 'Leadership', 'Project Management', 'Data Analysis', 'Writing'];
  const education = ['Bachelor\'s degree', 'Relevant field'];
  const experience = ['2+ years experience', 'Relevant industry'];
  return { skills, education, experience };
}

/**
 * Match jobs by overlapping skills/category. Placeholder: simple text match.
 */
async function matchJobs(skills, limit = 10) {
  if (!skills || !skills.length) {
    return Job.find({ status: 'active' }).sort({ views: -1, createdAt: -1 }).limit(limit).lean();
  }
  const or = skills.slice(0, 10).map((s) => ({ $or: [{ title: new RegExp(s, 'i') }, { category: new RegExp(s, 'i') }, { requirements: new RegExp(s, 'i') }] }));
  const jobs = await Job.find({ status: 'active', $or: or.length ? or : [{}] }).sort({ views: -1 }).limit(limit).lean();
  return jobs.length >= limit ? jobs : await Job.find({ status: 'active', _id: { $nin: jobs.map((j) => j._id) } }).sort({ createdAt: -1 }).limit(limit - jobs.length).lean().then((extra) => [...jobs, ...extra]);
}

export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'No file uploaded' });
  const mimetype = req.file.mimetype || '';
  if (!ALLOWED_MIMES.includes(mimetype)) return res.status(400).json({ error: 'Only PDF and DOCX files are allowed' });
  if (req.file.size > MAX_FILE_SIZE) return res.status(400).json({ error: 'File too large (max 5MB)' });

  const extracted = extractFromFile(req.file.buffer, mimetype);
  const jobs = await matchJobs(extracted.skills, 10);

  const matchedSkills = jobs.map((job) => {
    const jobSkills = [...(job.requirements || []), job.category, job.title].filter(Boolean).map((s) => String(s).toLowerCase());
    const found = extracted.skills.filter((s) => jobSkills.some((js) => js.includes(s.toLowerCase())));
    return { jobId: job._id, matched: found.length ? found : ['Relevant background'] };
  });

  res.json({
    extracted: {
      skills: extracted.skills,
      education: extracted.education,
      experience: extracted.experience,
    },
    jobs,
    matchedSkills,
    suggestions: extracted.skills.length < 3 ? ['Add more skills to your resume for better matches'] : [],
  });
});

import { Resume } from '../models/Resume.js';
import { Job } from '../models/Job.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createResume = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const body = sanitizeResumeBody(req.body);
  const resume = await Resume.create({ userId, ...body });
  res.status(201).json(resume);
});

export const getMyResumes = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
  res.json(resumes);
});

export const getResumeById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const resume = await Resume.findOne({ _id: req.params.id, userId }).lean();
  if (!resume) return res.status(404).json({ error: 'Resume not found' });
  const score = computeResumeScore(resume);
  res.json({ ...resume, score });
});

export const updateResume = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const resume = await Resume.findOne({ _id: req.params.id, userId });
  if (!resume) return res.status(404).json({ error: 'Resume not found' });
  const body = sanitizeResumeBody(req.body);
  Object.assign(resume, body);
  await resume.save();
  const score = computeResumeScore(resume.toObject());
  res.json({ ...resume.toObject(), score });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId });
  if (!deleted) return res.status(404).json({ error: 'Resume not found' });
  res.json({ message: 'Resume deleted' });
});

export const aiSuggest = asyncHandler(async (req, res) => {
  const { careerObjective, projectDescription } = req.body || {};
  const suggestions = {};
  if (careerObjective != null && String(careerObjective).trim()) {
    suggestions.careerObjective = improveCareerObjective(String(careerObjective).trim());
  }
  if (projectDescription != null && String(projectDescription).trim()) {
    suggestions.projectDescription = improveProjectDescription(String(projectDescription).trim());
  }
  res.json(suggestions);
});

export const optimizeForJob = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { resumeId, jobId, resume: resumePayload } = req.body || {};
  if (!jobId) return res.status(400).json({ error: 'jobId is required' });

  let resume;
  if (resumeId) {
    resume = await Resume.findOne({ _id: resumeId, userId }).lean();
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
  } else if (resumePayload && typeof resumePayload === 'object') {
    resume = resumePayload;
  } else {
    return res.status(400).json({ error: 'Provide resumeId or resume payload' });
  }

  const job = await Job.findById(jobId).lean();
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const resumeSkills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.soft || []),
  ].map((s) => String(s).toLowerCase().trim());
  const requirementText = [
    ...(job.requirements || []),
    job.description || '',
    job.title || '',
    job.educationRequirement || '',
    job.experience || '',
  ].join(' ');
  const keywords = extractKeywords(requirementText);
  const missing = keywords.filter((k) => !resumeSkills.some((s) => s.includes(k) || k.includes(s)));
  const matched = keywords.filter((k) => resumeSkills.some((s) => s.includes(k) || k.includes(s)));

  res.json({
    jobTitle: job.title,
    missingKeywords: [...new Set(missing)].slice(0, 15),
    matchedKeywords: [...new Set(matched)].slice(0, 20),
    suggestions: missing.length
      ? [`Add these skills or keywords to improve match: ${[...new Set(missing)].slice(0, 8).join(', ')}.`]
      : ['Your resume already matches many job requirements.'],
  });
});

function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];
  const stop = new Set(['the', 'and', 'for', 'with', 'years', 'year', 'experience', 'required', 'preferred', 'ability', 'knowledge', 'good', 'strong', 'etc', 'e.g', 'i.e']);
  const tokens = text
    .replace(/[,.\-;:()\[\]\/]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 1 && !stop.has(t) && !/^\d+$/.test(t));
  return [...new Set(tokens)];
}

function sanitizeResumeBody(body) {
  if (!body || typeof body !== 'object') return {};
  const allowed = [
    'title', 'template', 'personalInfo', 'careerObjective', 'education', 'skills',
    'experience', 'projects', 'certifications', 'languages',
  ];
  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  if (out.personalInfo && typeof out.personalInfo === 'object') {
    out.personalInfo = sanitizePersonalInfo(out.personalInfo);
  }
  if (Array.isArray(out.education)) {
    out.education = out.education.map((e) => (e && typeof e === 'object' ? e : {}));
  }
  if (out.skills && typeof out.skills === 'object') {
    out.skills = {
      technical: Array.isArray(out.skills.technical) ? out.skills.technical : [],
      soft: Array.isArray(out.skills.soft) ? out.skills.soft : [],
    };
  }
  if (Array.isArray(out.experience)) {
    out.experience = out.experience.map((e) => (e && typeof e === 'object' ? e : {}));
  }
  if (Array.isArray(out.projects)) {
    out.projects = out.projects.map((p) => (p && typeof p === 'object' ? p : {}));
  }
  if (Array.isArray(out.certifications)) {
    out.certifications = out.certifications.filter((c) => typeof c === 'string');
  }
  if (Array.isArray(out.languages)) {
    out.languages = out.languages.filter((l) => typeof l === 'string');
  }
  return out;
}

function sanitizePersonalInfo(p) {
  const fields = ['fullName', 'email', 'phone', 'city', 'province', 'linkedInUrl', 'githubUrl', 'portfolioUrl', 'profilePhotoUrl'];
  const out = {};
  for (const f of fields) {
    if (p[f] != null && typeof p[f] === 'string') out[f] = p[f].trim();
    else out[f] = '';
  }
  return out;
}

function computeResumeScore(resume) {
  let score = 0;
  const max = 100;
  const personal = resume.personalInfo || {};
  const hasName = !!(personal.fullName && personal.fullName.trim());
  const hasEmail = !!(personal.email && personal.email.trim());
  const hasPhone = !!(personal.phone && personal.phone.trim());
  const hasLinkedIn = !!(personal.linkedInUrl && personal.linkedInUrl.trim());
  if (hasName) score += 15;
  if (hasEmail) score += 10;
  if (hasPhone) score += 5;
  if (hasLinkedIn) score += 10;
  if (resume.careerObjective && resume.careerObjective.trim()) score += 10;
  const eduCount = (resume.education || []).length;
  if (eduCount > 0) score += 10;
  const techCount = (resume.skills?.technical || []).length;
  const softCount = (resume.skills?.soft || []).length;
  score += Math.min(15, techCount * 2 + softCount);
  const expCount = (resume.experience || []).length;
  score += Math.min(15, expCount * 5);
  const projCount = (resume.projects || []).length;
  score += Math.min(10, projCount * 3);
  return Math.min(max, score);
}

function improveCareerObjective(text) {
  const lower = text.toLowerCase();
  let improved = text;
  if (improved.length < 30) {
    improved = 'Motivated professional seeking opportunities to apply my skills and contribute to impactful projects.';
  } else if (!/\.$/.test(improved)) {
    improved = improved + '.';
  }
  const suggestions = [];
  if (!lower.includes('seek') && !lower.includes('looking') && !lower.includes('apply')) {
    suggestions.push('Consider starting with "Seeking" or "Looking to apply" for clarity.');
  }
  if (!lower.includes('skill') && !lower.includes('experience')) {
    suggestions.push('Mention your key skills or experience area.');
  }
  return { improved, suggestions };
}

function improveProjectDescription(text) {
  const lower = text.toLowerCase();
  let improved = text;
  if (improved.length < 20) {
    improved = 'Developed a project using relevant technologies with measurable outcomes.';
  } else {
    if (!/^(developed|built|designed|implemented|created)/i.test(improved)) {
      improved = 'Developed ' + improved.charAt(0).toLowerCase() + improved.slice(1);
    }
    if (!lower.includes('react') && !lower.includes('node') && !lower.includes('api')) {
      improved += ' Consider adding technologies used (e.g. React, Node.js, REST APIs).';
    }
  }
  const suggestions = [];
  suggestions.push('Use action verbs: Developed, Built, Implemented, Designed.');
  suggestions.push('Include technologies and frameworks used.');
  suggestions.push('Add measurable outcomes if possible (e.g. "improved load time by 20%").');
  return { improved, suggestions };
}

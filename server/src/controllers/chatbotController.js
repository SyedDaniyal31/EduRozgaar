import { ChatHistory } from '../models/ChatHistory.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeString } from '../utils/sanitize.js';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 20;

/**
 * Placeholder AI: return guidance based on keywords and user profile.
 */
async function getAiResponse(userId, message) {
  const msg = (message || '').toLowerCase();
  const user = userId ? await User.findById(userId).select('province interests').lean() : null;
  const province = user?.province ? ` in ${user.province}` : '';
  if (msg.includes('job') || msg.includes('career')) {
    return `Focus on jobs that match your skills and location${province}. Use filters for province and category, and apply to roles where you meet most requirements. Keep your resume updated.`;
  }
  if (msg.includes('scholarship') || msg.includes('funding')) {
    return `Check the Scholarships section for local and international opportunities. Filter by deadline and eligibility. Prepare documents in advance and apply before deadlines.`;
  }
  if (msg.includes('exam') || msg.includes('ppsc') || msg.includes('nts') || msg.includes('quiz')) {
    return `Use the Exam Preparation section for syllabus, past papers, and practice quizzes. Regular practice improves scores. Track your progress and focus on weak areas.`;
  }
  if (msg.includes('internship') || msg.includes('training')) {
    return `Browse Internships & Trainings from the dashboard. Filter by duration and skillset. You can apply in-platform or via the company link.`;
  }
  if (msg.includes('webinar') || msg.includes('workshop')) {
    return `Upcoming webinars and workshops are listed on your dashboard. Register to get reminders and access recordings after the session.`;
  }
  if (msg.includes('resume') || msg.includes('cover letter')) {
    return `Use the Resume Scanner to get job matches and improvement suggestions. The Cover Letter Builder can generate a draft for any saved job.`;
  }
  return `I can help with job search, scholarships, exam preparation, internships, webinars, and resume tips. What would you like to know?`;
}

export const chatbotQuery = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { message } = req.body || {};
  const msg = typeof message === 'string' ? sanitizeString(message).trim() : '';
  if (!msg) return res.status(400).json({ error: 'message is required' });
  if (msg.length > MAX_MESSAGE_LENGTH) return res.status(400).json({ error: 'Message too long' });
  if (!userId) return res.status(401).json({ error: 'Login required to use chatbot' });

  await ChatHistory.create({ userId, role: 'user', message: msg });
  const reply = await getAiResponse(userId, msg);
  await ChatHistory.create({ userId, role: 'assistant', message: reply });
  res.json({ reply });
});

export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const limit = Math.min(50, parseInt(req.query.limit, 10) || MAX_HISTORY);
  const history = await ChatHistory.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ data: history.reverse() });
});

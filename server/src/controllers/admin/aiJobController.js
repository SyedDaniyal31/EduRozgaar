import { asyncHandler } from '../../utils/asyncHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';

/**
 * Generate job description from title, organization, location.
 * Placeholder: returns SEO-friendly template. Replace with OpenAI/Claude in production.
 */
export const generateJobDescription = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const title = sanitizeString(body.title || '');
  const organization = sanitizeString(body.organization || body.company || '');
  const location = sanitizeString(body.location || body.province || '');
  const skills = Array.isArray(body.skills) ? body.skills.filter((s) => typeof s === 'string').slice(0, 15).map(sanitizeString) : [];

  if (!title) return res.status(400).json({ error: 'Job title is required' });

  const locPart = location ? ` based in ${location}.` : '.';
  const orgPart = organization ? `${organization} is` : 'We are';
  const skillsPart = skills.length ? `\n\nKey skills required:\n${skills.map((s) => `• ${s}`).join('\n')}` : '';

  const description = `${orgPart} looking for a ${title}${locPart}

## About the role
We are seeking a motivated professional to join our team. The ideal candidate will contribute to our goals and grow with us.

## Responsibilities
• Execute tasks related to ${title}
• Collaborate with team members
• Meet deadlines and maintain quality standards

## Requirements
• Relevant experience or education in the field
• Strong communication skills
• Ability to work independently and in a team${skillsPart}

## How to apply
Please submit your application through our portal or the contact method provided. We look forward to hearing from you.`;

  const summary = organization
    ? `${title} position at ${organization}${location ? ` in ${location}` : ''}.`
    : `${title} opportunity${location ? ` in ${location}` : ''}.`;

  res.json({
    description,
    summary: summary.slice(0, 160),
    suggested: {
      title: title || undefined,
      organization: organization || undefined,
      location: location || undefined,
      requirements: skills.length ? skills : ['Relevant experience', 'Good communication skills'],
    },
  });
});

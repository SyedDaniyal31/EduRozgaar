/**
 * LinkedIn jobs scraper (Pakistan-focused).
 * Production: use LinkedIn API or approved partner; respect ToS and rate limits.
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'LINKEDIN';
const SOURCE_WEBSITE = 'LinkedIn';
const SOURCE_URL = 'https://www.linkedin.com/jobs';

export async function scrape() {
  const rawJobs = [
    { title: 'Software Engineer Pakistan', organization: 'Tech Company', province: 'Punjab', city: 'Lahore', jobType: 'Private', educationRequirement: 'BS CS', experience: '2-4 years', deadline: addDays(14), applicationLink: SOURCE_URL },
    { title: 'Digital Marketing Specialist', organization: 'Startup PK', province: 'Sindh', city: 'Karachi', jobType: 'Private', educationRequirement: 'Bachelor', experience: '1-2 years', deadline: addDays(21), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

/**
 * Indeed Pakistan jobs scraper.
 * Production: use Indeed API or approved aggregation; respect ToS.
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'INDEED';
const SOURCE_WEBSITE = 'Indeed';
const SOURCE_URL = 'https://pk.indeed.com';

export async function scrape() {
  const rawJobs = [
    { title: 'Data Analyst Karachi', organization: 'Data Solutions PK', province: 'Sindh', city: 'Karachi', jobType: 'Private', educationRequirement: 'BS Statistics/CS', experience: '2 years', deadline: addDays(14), applicationLink: SOURCE_URL },
    { title: 'HR Coordinator Islamabad', organization: 'HR Consultancy', province: 'Islamabad', city: 'Islamabad', jobType: 'Private', educationRequirement: 'MBA HR', deadline: addDays(20), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

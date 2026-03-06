/**
 * WAPDA jobs scraper.
 * Production: scrape https://www.wapda.gov.pk
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'WAPDA';
const SOURCE_WEBSITE = 'WAPDA';
const SOURCE_URL = 'https://www.wapda.gov.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Assistant Engineer Civil WAPDA', organization: 'WAPDA', province: 'Punjab', city: 'Lahore', jobType: 'Government', educationRequirement: 'BE Civil', experience: '2 years', deadline: addDays(30), applicationLink: SOURCE_URL },
    { title: 'Electrical Engineer WAPDA 2026', organization: 'Water and Power Development Authority', province: 'Punjab', jobType: 'Government', educationRequirement: 'BE Electrical', deadline: addDays(45), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

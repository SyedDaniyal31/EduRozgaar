/**
 * HEC (Higher Education Commission) jobs scraper.
 * Production: scrape https://www.hec.gov.pk
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'HEC';
const SOURCE_WEBSITE = 'HEC';
const SOURCE_URL = 'https://www.hec.gov.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Research Associate HEC', organization: 'HEC', province: 'Islamabad', jobType: 'Government', educationRequirement: 'PhD', experience: '2 years', deadline: addDays(40), applicationLink: SOURCE_URL },
    { title: 'Program Officer HEC 2026', organization: 'Higher Education Commission', province: 'Islamabad', city: 'Islamabad', jobType: 'Government', educationRequirement: 'Master\'s', deadline: addDays(35), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

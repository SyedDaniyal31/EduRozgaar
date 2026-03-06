/**
 * NTS (National Testing Service) jobs scraper.
 * Production: scrape https://www.nts.org.pk
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'NTS';
const SOURCE_WEBSITE = 'NTS';
const SOURCE_URL = 'https://www.nts.org.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'NTS Test Invigilator 2026', organization: 'NTS', province: 'Punjab', city: 'Lahore', jobType: 'Government', educationRequirement: 'Bachelor', deadline: addDays(30), applicationLink: SOURCE_URL },
    { title: 'Project Coordinator NTS', organization: 'National Testing Service', province: 'Islamabad', jobType: 'Government', educationRequirement: 'Master\'s', experience: '1 year', deadline: addDays(25), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

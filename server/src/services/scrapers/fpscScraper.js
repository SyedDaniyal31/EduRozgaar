/**
 * FPSC (Federal Public Service Commission) job scraper.
 * Production: scrape https://www.fpsc.gov.pk
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'FPSC';
const SOURCE_WEBSITE = 'FPSC';
const SOURCE_URL = 'https://www.fpsc.gov.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Assistant Director BS-17 FPSC', organization: 'FPSC', province: 'Islamabad', city: 'Islamabad', jobType: 'Government', educationRequirement: 'Master\'s', experience: '2 years', deadline: addDays(45), applicationLink: SOURCE_URL },
    { title: 'Research Officer FPSC 2026', organization: 'Federal Public Service Commission', province: 'Islamabad', jobType: 'Government', educationRequirement: 'PhD/MPhil', deadline: addDays(50), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

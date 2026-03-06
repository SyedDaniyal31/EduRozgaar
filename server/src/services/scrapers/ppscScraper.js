/**
 * PPSC (Punjab Public Service Commission) job scraper.
 * Production: use HTTP + Cheerio/Puppeteer to scrape https://www.ppsc.gop.pk
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'PPSC';
const SOURCE_WEBSITE = 'PPSC';
const SOURCE_URL = 'https://www.ppsc.gop.pk';

export async function scrape() {
  // Mock: replace with real fetch + parse in production
  const rawJobs = [
    { title: 'Assistant Director (BS-17) PPSC 2026', organization: 'PPSC', province: 'Punjab', city: 'Lahore', jobType: 'Government', educationRequirement: 'Master\'s', experience: '2 years', deadline: addDays(45), applicationLink: `${SOURCE_URL}/apply` },
    { title: 'Secondary School Teacher SST PPSC', organization: 'Punjab Public Service Commission', province: 'Punjab', jobType: 'Government', educationRequirement: 'Bachelor with B.Ed', deadline: addDays(60), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

/**
 * Rozee.pk jobs scraper.
 * Production: use Rozee API if available or scrape with rate limiting and ToS compliance.
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'ROZEE';
const SOURCE_WEBSITE = 'Rozee.pk';
const SOURCE_URL = 'https://www.rozee.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Frontend Developer Lahore', organization: 'Software House', province: 'Punjab', city: 'Lahore', jobType: 'Private', educationRequirement: 'BS CS', experience: '1-3 years', deadline: addDays(14), applicationLink: SOURCE_URL },
    { title: 'Accountant Faisalabad', organization: 'Manufacturing Co', province: 'Punjab', city: 'Faisalabad', jobType: 'Private', educationRequirement: 'ACCA/CA', experience: '2 years', deadline: addDays(25), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

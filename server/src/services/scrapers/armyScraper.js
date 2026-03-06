/**
 * Pakistan Army / ISSB jobs scraper.
 * Production: scrape official recruitment portals.
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'PAKISTAN_ARMY';
const SOURCE_WEBSITE = 'Pakistan Army';
const SOURCE_URL = 'https://www.joinpakarmy.gov.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Captain (GD) Pakistan Army 2026', organization: 'Pakistan Army', province: 'Punjab', jobType: 'Government', educationRequirement: 'Bachelor', deadline: addDays(60), applicationLink: SOURCE_URL },
    { title: 'Technical Cadet Course TCC', organization: 'Pakistan Army', province: 'Multiple', jobType: 'Government', educationRequirement: 'FSc/ A-Level', deadline: addDays(90), applicationLink: SOURCE_URL },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

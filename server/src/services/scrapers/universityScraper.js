/**
 * University job portals (PU, UET, NUST, etc.) scraper.
 * Production: aggregate from multiple university career pages.
 */
import { normalizeJob } from './base.js';

const SOURCE_KEY = 'UNIVERSITY_PORTALS';
const SOURCE_WEBSITE = 'University Portals';
const SOURCE_URL = 'https://pu.edu.pk';

export async function scrape() {
  const rawJobs = [
    { title: 'Lecturer Computer Science', organization: 'University of Punjab', province: 'Punjab', city: 'Lahore', jobType: 'Government', educationRequirement: 'PhD/MPhil', experience: '1 year', deadline: addDays(45), applicationLink: SOURCE_URL },
    { title: 'Assistant Professor Mathematics', organization: 'UET Lahore', province: 'Punjab', city: 'Lahore', jobType: 'Government', educationRequirement: 'PhD', experience: '3 years', deadline: addDays(55), applicationLink: 'https://uet.edu.pk' },
  ];
  return rawJobs.map((r) => normalizeJob(r, SOURCE_KEY, SOURCE_WEBSITE, r.applicationLink || SOURCE_URL)).filter(Boolean);
}

function addDays(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() + d);
  return d2;
}

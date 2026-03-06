/**
 * AI Job Scraper – Phase-8.
 * Simulates scraping PPSC, FPSC, NTS, WAPDA, Punjab Police, universities.
 * Replace fetchFromSource() with real HTTP + Cheerio/Puppeteer for production.
 */
import { Job } from '../models/Job.js';
import { Admission } from '../models/Admission.js';
import { ScraperRun } from '../models/ScraperRun.js';
import { jobSlug } from '../utils/slugify.js';
import { admissionSlug } from '../utils/slugify.js';

const SOURCES = {
  PPSC: { name: 'PPSC', url: 'https://www.ppsc.gop.pk', type: 'jobs' },
  FPSC: { name: 'FPSC', url: 'https://www.fpsc.gov.pk', type: 'jobs' },
  NTS: { name: 'NTS', url: 'https://www.nts.org.pk', type: 'jobs' },
  WAPDA: { name: 'WAPDA', url: 'https://www.wapda.gov.pk', type: 'jobs' },
  PUNJAB_POLICE: { name: 'Punjab Police', url: 'https://punjabpolice.gov.pk', type: 'jobs' },
  PU: { name: 'University of Punjab', url: 'https://pu.edu.pk', type: 'admissions' },
  UET: { name: 'UET Lahore', url: 'https://uet.edu.pk', type: 'admissions' },
};

/** Mock scrape result – replace with real HTTP + parse in production */
function fetchFromSource(sourceKey) {
  const source = SOURCES[sourceKey];
  if (!source) return { jobs: [], admissions: [] };
  const ts = new Date().toISOString().slice(0, 10);
  if (source.type === 'jobs') {
    return {
      jobs: [
        { title: `${source.name} Job ${ts} – Specialist`, company: source.name, organization: source.name, province: 'Punjab', category: 'Government', sourceUrl: source.url, sourceKey },
        { title: `${source.name} Recruitment ${ts}`, company: source.name, organization: source.name, province: 'Punjab', category: 'Government', sourceUrl: source.url, sourceKey },
      ],
      admissions: [],
    };
  }
  return {
    jobs: [],
    admissions: [
      { program: `${source.name} Admissions ${ts}`, institution: source.name, province: 'Punjab', sourceUrl: source.url, sourceKey },
    ],
  };
}

function makeSlugUnique(baseSlug, existingSlugs, index = 0) {
  const slug = index === 0 ? baseSlug : `${baseSlug}-${index}`;
  if (existingSlugs.has(slug)) return makeSlugUnique(baseSlug, existingSlugs, index + 1);
  return slug;
}

export async function runScraper() {
  const run = await ScraperRun.create({ status: 'running', sources: Object.keys(SOURCES) });
  const start = Date.now();
  let jobsAdded = 0;
  let admissionsAdded = 0;
  let jobsSkipped = 0;
  let admissionsSkipped = 0;
  const errors = [];

  try {
    const existingJobSlugs = new Set((await Job.find({}).select('slug').lean()).map((j) => j.slug));
    const existingJobTitleCompany = new Set((await Job.find({}).select('title company').lean()).map((j) => `${(j.title || '').toLowerCase()}|${(j.company || '').toLowerCase()}`));
    const existingAdmissionSlugs = new Set((await Admission.find({}).select('slug').lean()).map((a) => a.slug));
    const existingAdmissionKey = new Set((await Admission.find({}).select('program institution').lean()).map((a) => `${(a.program || '').toLowerCase()}|${(a.institution || '').toLowerCase()}`));

    for (const sourceKey of Object.keys(SOURCES)) {
      try {
        const { jobs, admissions } = fetchFromSource(sourceKey);
        const scrapedAt = new Date();

        for (const j of jobs) {
          const key = `${(j.title || '').toLowerCase()}|${(j.company || '').toLowerCase()}`;
          if (existingJobTitleCompany.has(key)) {
            jobsSkipped++;
            continue;
          }
          const baseSlug = jobSlug(j.title, j.province || j.location || '');
          const slug = makeSlugUnique(baseSlug, existingJobSlugs);
          existingJobSlugs.add(slug);
          existingJobTitleCompany.add(key);
          await Job.create({
            title: j.title,
            slug,
            company: j.company,
            organization: j.organization || j.company,
            province: j.province,
            category: j.category,
            type: 'full-time',
            status: 'active',
            source: 'scraper',
            scrapedAt,
            sourceUrl: j.sourceUrl,
          });
          jobsAdded++;
        }

        for (const a of admissions) {
          const key = `${(a.program || '').toLowerCase()}|${(a.institution || '').toLowerCase()}`;
          if (existingAdmissionKey.has(key)) {
            admissionsSkipped++;
            continue;
          }
          const baseSlug = admissionSlug(a.program, a.institution);
          const slug = makeSlugUnique(baseSlug, existingAdmissionSlugs);
          existingAdmissionSlugs.add(slug);
          existingAdmissionKey.add(key);
          await Admission.create({
            program: a.program,
            slug,
            institution: a.institution,
            province: a.province,
            status: 'active',
            source: 'scraper',
            scrapedAt,
            sourceUrl: a.sourceUrl,
          });
          admissionsAdded++;
        }
      } catch (err) {
        errors.push(`${sourceKey}: ${err.message}`);
      }
    }

    run.status = errors.length === 0 ? 'success' : 'partial';
    run.jobsAdded = jobsAdded;
    run.admissionsAdded = admissionsAdded;
    run.jobsSkipped = jobsSkipped;
    run.admissionsSkipped = admissionsSkipped;
    run.errors = errors;
    run.durationMs = Date.now() - start;
    await run.save();
    return { run, jobsAdded, admissionsAdded, jobsSkipped, admissionsSkipped, errors };
  } catch (err) {
    run.status = 'failed';
    run.errors = [...(run.errors || []), err.message];
    run.durationMs = Date.now() - start;
    await run.save();
    throw err;
  }
}

export function getScraperSources() {
  return Object.entries(SOURCES).map(([key, v]) => ({ key, ...v }));
}

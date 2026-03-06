/**
 * Base utilities for scrapers: validation, normalization, rate limiting.
 * All scrapers should return jobs in this shape.
 */
const JOB_TYPES = ['Government', 'Private', 'Internship'];
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 300;

/**
 * Validate and normalize a raw scraped job. Returns null if invalid.
 */
export function normalizeJob(raw, sourceKey, sourceWebsite, sourceUrl) {
  if (!raw || typeof raw !== 'object') return null;
  const title = sanitize(raw.title);
  if (!title || title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) return null;
  const organization = sanitize(raw.organization || raw.company || raw.employer) || sourceWebsite || sourceKey;
  const externalId = raw.externalId || raw.id || hashExternalId(sourceKey, title, organization, raw.applicationLink || raw.sourceUrl || '');
  return {
    title,
    organization,
    company: organization,
    location: sanitize(raw.location) || '',
    province: sanitize(raw.province || raw.state) || inferProvince(raw.city || raw.location),
    city: sanitize(raw.city) || '',
    jobType: JOB_TYPES.includes(raw.jobType) ? raw.jobType : inferJobType(sourceKey, raw),
    educationRequirement: sanitize(raw.educationRequirement || raw.education) || '',
    experience: sanitize(raw.experience) || '',
    deadline: parseDate(raw.deadline || raw.applicationDeadline || raw.lastDate),
    applicationLink: sanitizeUrl(raw.applicationLink || raw.applyUrl || raw.sourceUrl || sourceUrl) || sourceUrl,
    sourceUrl: sourceUrl || '',
    sourceWebsite: sourceWebsite || sourceKey,
    externalId,
    description: sanitize(raw.description) || '',
    category: sanitize(raw.category) || '',
  };
}

function sanitize(s) {
  if (s == null) return '';
  const t = String(s).trim();
  return t.length > 2000 ? t.slice(0, 2000) : t;
}

function sanitizeUrl(u) {
  if (!u || typeof u !== 'string') return '';
  const trimmed = u.trim();
  if (!/^https?:\/\//i.test(trimmed)) return '';
  return trimmed;
}

function parseDate(d) {
  if (!d) return null;
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function inferProvince(loc) {
  if (!loc) return '';
  const l = String(loc).toLowerCase();
  if (l.includes('lahore') || l.includes('punjab') || l.includes('faisalabad') || l.includes('rawalpindi')) return 'Punjab';
  if (l.includes('karachi') || l.includes('sindh') || l.includes('hyderabad')) return 'Sindh';
  if (l.includes('peshawar') || l.includes('kpk') || l.includes('khyber')) return 'Khyber Pakhtunkhwa';
  if (l.includes('quetta') || l.includes('balochistan')) return 'Balochistan';
  if (l.includes('islamabad')) return 'Islamabad';
  return '';
}

function inferJobType(sourceKey, raw) {
  const key = (sourceKey || '').toUpperCase();
  if (key.includes('PPSC') || key.includes('FPSC') || key.includes('NTS') || key.includes('WAPDA') || key.includes('HEC') || key.includes('ARMY')) return 'Government';
  if (raw.jobType === 'Internship' || key.includes('INTERN')) return 'Internship';
  return 'Private';
}

function hashExternalId(sourceKey, title, org, link) {
  const str = [sourceKey, (title || '').toLowerCase(), (org || '').toLowerCase(), (link || '').toLowerCase()].join('|');
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = ((h << 5) - h) + c;
    h |= 0;
  }
  return `ext_${sourceKey}_${Math.abs(h).toString(36)}`;
}

/** Delay for rate limiting between scraper sources (ms) */
export const RATE_LIMIT_DELAY_MS = 2000;

export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

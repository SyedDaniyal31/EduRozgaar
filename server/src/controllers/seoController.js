import { Job } from '../models/Job.js';
import { Scholarship } from '../models/Scholarship.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SITE_URL = process.env.SITE_URL || 'https://edurozgaar.pk';
const CITIES = ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan', 'peshawar', 'quetta', 'sialkot', 'gujranwala'];
const PROVINCES = ['punjab', 'sindh', 'khyber-pakhtunkhwa', 'balochistan', 'islamabad', 'gilgit-baltistan'];
const JOB_CATEGORIES = ['government-jobs', 'private-jobs', 'internships'];
const SCHOLARSHIP_COUNTRIES = ['turkey', 'germany', 'china', 'uk', 'usa', 'australia', 'canada', 'hungary', 'italy'];

/**
 * GET /sitemap.xml - Dynamic sitemap for SEO pages and listing pages.
 */
export const getSitemap = asyncHandler(async (_req, res) => {
  const base = SITE_URL.replace(/\/$/, '');
  const urls = [
    { loc: base + '/', changefreq: 'daily', priority: '1.0' },
    { loc: base + '/jobs', changefreq: 'daily', priority: '0.9' },
    { loc: base + '/scholarships', changefreq: 'daily', priority: '0.9' },
    { loc: base + '/admissions', changefreq: 'daily', priority: '0.9' },
    { loc: base + '/internships', changefreq: 'daily', priority: '0.9' },
    { loc: base + '/blog', changefreq: 'weekly', priority: '0.8' },
    { loc: base + '/exam-prep', changefreq: 'weekly', priority: '0.8' },
    { loc: base + '/resume-builder', changefreq: 'monthly', priority: '0.7' },
    { loc: base + '/career-guidance', changefreq: 'monthly', priority: '0.7' },
  ];
  CITIES.forEach((city) => urls.push({ loc: `${base}/jobs-in-${city}`, changefreq: 'daily', priority: '0.8' }));
  PROVINCES.forEach((prov) => urls.push({ loc: `${base}/jobs-in-${prov}`, changefreq: 'daily', priority: '0.8' }));
  JOB_CATEGORIES.forEach((cat) => urls.push({ loc: `${base}/${cat}`, changefreq: 'daily', priority: '0.8' }));
  SCHOLARSHIP_COUNTRIES.forEach((c) => urls.push({ loc: `${base}/scholarships-in-${c}`, changefreq: 'weekly', priority: '0.7' }));

  const jobs = await Job.find({ status: 'active' }).select('slug updatedAt').limit(5000).lean();
  jobs.forEach((j) => urls.push({ loc: `${base}/jobs/${j.slug}`, changefreq: 'weekly', priority: '0.6', lastmod: j.updatedAt }));

  const scholarships = await Scholarship.find({ status: 'active' }).select('slug updatedAt').limit(2000).lean();
  scholarships.forEach((s) => urls.push({ loc: `${base}/scholarships/${s.slug}`, changefreq: 'weekly', priority: '0.6', lastmod: s.updatedAt }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
});

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const SLUG_TO_PROVINCE = {
  'khyber-pakhtunkhwa': 'Khyber Pakhtunkhwa', 'kpk': 'Khyber Pakhtunkhwa',
  'punjab': 'Punjab', 'sindh': 'Sindh', 'balochistan': 'Balochistan', 'islamabad': 'Islamabad', 'gilgit-baltistan': 'Gilgit-Baltistan',
};
const SLUG_TO_JOB_TYPE = { 'government-jobs': 'Government', 'private-jobs': 'Private', 'internships': 'Internship', 'internship-jobs': 'Internship' };

/**
 * GET /api/seo/jobs-in/:slug - Jobs by city or province (for SEO pages).
 */
export const getSeoJobsPage = asyncHandler(async (req, res) => {
  const slug = (req.params.slug || '').toLowerCase().replace(/\s+/g, '-');
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 24);
  const filter = { status: 'active' };
  const province = SLUG_TO_PROVINCE[slug];
  if (province) {
    filter.province = new RegExp(province, 'i');
  } else {
    filter.$or = [
      { city: new RegExp(slug.replace(/-/g, ' '), 'i') },
      { province: new RegExp(slug.replace(/-/g, ' '), 'i') },
      { location: new RegExp(slug.replace(/-/g, ' '), 'i') },
    ];
  }
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  const title = province
    ? `Latest Government & Private Jobs in ${province} 2026 | EduRozgaar`
    : `Latest Jobs in ${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} 2026 | EduRozgaar`;
  const description = `Find the latest government and private jobs in ${slug.replace(/-/g, ' ')}. Updated daily with verified opportunities.`;
  const base = SITE_URL.replace(/\/$/, '');
  res.json({
    meta: { title, description, canonical: `${base}/jobs-in-${slug}` },
    data: jobs,
    total: jobs.length,
  });
});

/**
 * GET /api/seo/jobs-by-category/:slug - government-jobs | private-jobs | internships
 */
export const getSeoJobsByCategory = asyncHandler(async (req, res) => {
  const slug = (req.params.slug || '').toLowerCase();
  const jobType = SLUG_TO_JOB_TYPE[slug];
  if (!jobType) return res.status(404).json({ error: 'Invalid category' });
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 24);
  const jobs = await Job.find({ status: 'active', jobType }).sort({ createdAt: -1 }).limit(limit).lean();
  const title = `Latest ${jobType} in Pakistan 2026 | EduRozgaar`;
  const description = `Find the latest ${jobType.toLowerCase()} in Pakistan. Updated daily with verified opportunities.`;
  const base = SITE_URL.replace(/\/$/, '');
  res.json({
    meta: { title, description, canonical: `${base}/${slug}` },
    data: jobs,
    total: jobs.length,
  });
});

/**
 * GET /api/seo/scholarships-in/:country - Scholarships by country.
 */
export const getSeoScholarshipsPage = asyncHandler(async (req, res) => {
  const country = (req.params.country || '').toLowerCase().replace(/-/g, ' ');
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 24);
  const filter = { status: 'active', country: new RegExp(country, 'i') };
  const scholarships = await Scholarship.find(filter).sort({ deadline: 1 }).limit(limit).lean();
  const countryTitle = country.replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `Scholarships in ${countryTitle} for Pakistani Students 2026 | EduRozgaar`;
  const description = `Find scholarships in ${countryTitle} for Pakistani students. Fully funded and partial scholarships.`;
  const base = SITE_URL.replace(/\/$/, '');
  res.json({
    meta: { title, description, canonical: `${base}/scholarships-in-${req.params.country}` },
    data: scholarships,
    total: scholarships.length,
  });
});

/**
 * GET /robots.txt
 */
export const getRobots = (_req, res) => {
  const base = SITE_URL.replace(/\/$/, '');
  const txt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
  res.type('text/plain').send(txt);
};

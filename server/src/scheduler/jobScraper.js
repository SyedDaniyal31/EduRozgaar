/**
 * Government Job Auto Scraper – runs every 6 hours via cron.
 * Target sources: FPSC, PPSC, NTS, WAPDA, Pakistan Army (Navy, Airforce, Punjab Police when scrapers added).
 * Flow: fetch → parse → extract → check duplicates (title + organization + deadline) → save → trigger alerts.
 */
import { runScraper } from '../services/scraperService.js';

/** Government source keys from SCRAPER_REGISTRY. Add PAKISTAN_NAVY, PAKISTAN_AIRFORCE, PUNJAB_POLICE when scrapers exist. */
export const GOVERNMENT_SOURCES = [
  'FPSC',
  'PPSC',
  'NTS',
  'WAPDA',
  'PAKISTAN_ARMY',
  'HEC',
];

/**
 * Run government job scrapers only. Duplicate rule (title + organization + deadline) is applied in scraperService.
 * After new jobs are saved, alerts can be triggered for matching users (Phase 2 – Smart Job Alerts).
 */
export async function runGovernmentJobScraper() {
  const result = await runScraper({
    onlySources: GOVERNMENT_SOURCES,
    skipAdmissions: true,
  });
  if (result.jobsAdded > 0) {
    try {
      await triggerAlertsForNewJobs(result.jobsAdded);
    } catch (err) {
      console.error('[jobScraper] triggerAlertsForNewJobs error:', err.message);
    }
  }
  return result;
}

/**
 * Placeholder: notify users who match new government jobs (province, degree, job_category, etc.).
 * To be implemented in Phase 2 – Smart Job Alert System (email, browser, telegram).
 */
async function triggerAlertsForNewJobs(count) {
  if (count <= 0) return;
  console.log('[jobScraper] New government jobs added:', count, '– alert dispatch (Phase 2)');
}

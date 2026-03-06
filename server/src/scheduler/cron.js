/**
 * Phase-8: Run scraper every 6 hours.
 * Uses node-cron. Disable with DISABLE_SCRAPER_CRON=1.
 */
import cron from 'node-cron';
import { runScraper } from '../services/scraperService.js';
import { generateBlogFromListings } from '../services/blogAutoGenerateService.js';

const CRON_SCHEDULE = '0 */6 * * *'; // every 6 hours at minute 0

let task = null;

export function startScraperCron() {
  if (process.env.DISABLE_SCRAPER_CRON === '1') {
    console.log('[Cron] Scraper cron disabled (DISABLE_SCRAPER_CRON=1)');
    return;
  }
  task = cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Cron] Starting scheduled scraper run...');
    try {
      const result = await runScraper();
      console.log('[Cron] Scraper done:', result.jobsAdded, 'jobs,', result.admissionsAdded, 'admissions');
      if (result.jobsAdded > 0 || result.admissionsAdded > 0) {
        try {
          await generateBlogFromListings();
          console.log('[Cron] Auto blog generated');
        } catch (e) {
          console.error('[Cron] Auto blog error:', e.message);
        }
      }
    } catch (err) {
      console.error('[Cron] Scraper error:', err.message);
    }
  });
  console.log('[Cron] Scraper scheduled every 6 hours');
}

export function stopScraperCron() {
  if (task) {
    task.stop();
    task = null;
  }
}

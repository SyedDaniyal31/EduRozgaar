import { asyncHandler } from '../utils/asyncHandler.js';
import { runScraper, getScraperSources } from '../services/scraperService.js';
import { ScraperRun } from '../models/ScraperRun.js';

export const triggerScraper = asyncHandler(async (req, res) => {
  const result = await runScraper();
  res.json({
    message: 'Scraper run completed',
    runId: result.run._id,
    jobsAdded: result.jobsAdded,
    admissionsAdded: result.admissionsAdded,
    jobsSkipped: result.jobsSkipped,
    admissionsSkipped: result.admissionsSkipped,
    status: result.run.status,
    durationMs: result.run.durationMs,
    errors: result.errors,
  });
});

export const getScraperRuns = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
  const runs = await ScraperRun.find().sort({ runAt: -1 }).limit(limit).lean();
  res.json({ data: runs });
});

export const getScraperSourcesList = asyncHandler(async (_req, res) => {
  const sources = getScraperSources();
  res.json({ data: sources });
});

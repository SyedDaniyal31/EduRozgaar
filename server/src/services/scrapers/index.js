/**
 * Registry of all job scrapers. Only enabled sources (via ScraperConfig) are run.
 * Rate-limited and deduplicated by externalId.
 */
import { delay, RATE_LIMIT_DELAY_MS } from './base.js';
import { scrape as ppscScraper } from './ppscScraper.js';
import { scrape as fpscScraper } from './fpscScraper.js';
import { scrape as ntsScraper } from './ntsScraper.js';
import { scrape as hecScraper } from './hecScraper.js';
import { scrape as wapdaScraper } from './wapdaScraper.js';
import { scrape as armyScraper } from './armyScraper.js';
import { scrape as universityScraper } from './universityScraper.js';
import { scrape as linkedinScraper } from './linkedinScraper.js';
import { scrape as indeedScraper } from './indeedScraper.js';
import { scrape as rozeeScraper } from './rozeeScraper.js';

export const SCRAPER_REGISTRY = {
  PPSC: { name: 'PPSC', scrape: ppscScraper },
  FPSC: { name: 'FPSC', scrape: fpscScraper },
  NTS: { name: 'NTS', scrape: ntsScraper },
  HEC: { name: 'HEC', scrape: hecScraper },
  WAPDA: { name: 'WAPDA', scrape: wapdaScraper },
  PAKISTAN_ARMY: { name: 'Pakistan Army', scrape: armyScraper },
  UNIVERSITY_PORTALS: { name: 'University Portals', scrape: universityScraper },
  LINKEDIN: { name: 'LinkedIn', scrape: linkedinScraper },
  INDEED: { name: 'Indeed', scrape: indeedScraper },
  ROZEE: { name: 'Rozee.pk', scrape: rozeeScraper },
};

export { RATE_LIMIT_DELAY_MS, delay };

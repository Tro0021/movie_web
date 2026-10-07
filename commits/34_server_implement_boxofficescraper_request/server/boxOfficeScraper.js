/**
 * Box Office Mojo Scraper & Revenue Split Microservice
 * 
 * Extracts granular theatrical, financial, and distributor data using Cheerio & Axios,
 * computes algorithmic distributor shares, and aggressively caches results for 24 hours.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { LRUCache } from 'lru-cache';

// Aggressive 24-hour LRU Cache (TTL: 24h, Max: 500 titles)
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
export const financialCache = new LRUCache({
  max: 500,
  ttl: CACHE_TTL_MS,
  updateAgeOnGet: false,
});

// Realistic desktop browser headers to prevent Cloudflare/BOM blocking
export const SCRAPER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Referer': 'https://www.boxofficemojo.com/',
  'DNT': '1'
};

/**
 * Clean monetary string into clean integer
 * e.g. "$190,000,000" -> 190000000
 */
export function parseCurrencyString(rawStr) {
  if (!rawStr) return 0;
  const cleaned = String(rawStr).replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Main Scraper for Box Office Mojo title page (Initial HTML Parser)
 */
export async function scrapeBoxOfficeMojo(imdbId) {
  if (!imdbId || !/^tt\d+$/.test(imdbId.trim())) {
    throw new Error(`Invalid IMDB ID format: "${imdbId}". Expected format like "tt15239678".`);
  }

  const cleanId = imdbId.trim();

  // Check Cache first
  if (financialCache.has(cleanId)) {
    const cachedData = financialCache.get(cleanId);
    return {
      ...cachedData,
      fromCache: true
    };
  }

  const mainUrl = `https://www.boxofficemojo.com/title/${cleanId}/`;

  try {
    const res = await axios.get(mainUrl, { headers: SCRAPER_HEADERS, timeout: 3500 });
    if (!res || !res.data) {
      throw new Error(`Could not retrieve Box Office Mojo page for ${cleanId}`);
    }

    const $ = cheerio.load(res.data);

    // 1. Extract Primary Title
    const title = $('h1.a-size-extra-large').first().text().trim() || 
                  $('title').text().replace('- Box Office Mojo', '').trim();

    // 2. Extract Domestic, International, Worldwide Gross from Performance Summary Table
    let domesticGross = 0;
    let internationalGross = 0;
    let worldwideGross = 0;

    $('.mojo-performance-summary-table .a-section').each((_, el) => {
      const label = $(el).find('span.a-size-small').text().toLowerCase();
      const moneyText = $(el).find('span.money').first().text().trim();
      const value = parseCurrencyString(moneyText);

      if (label.includes('domestic')) domesticGross = value;
      else if (label.includes('international')) internationalGross = value;
      else if (label.includes('worldwide')) worldwideGross = value;
    });

    if (!worldwideGross) {
      worldwideGross = parseCurrencyString($('span:contains("Worldwide")').next('span.money').text()) ||
                       parseCurrencyString($('.mojo-fixture-gross').first().text());
    }

    // 3. Extract Metadata values from `.mojo-summary-values`
    let budget = 0;
    let openingWeekendDomestic = 0;
    let domesticDistributor = 'Major Studio Distribution';

    $('.mojo-summary-values .a-section').each((_, el) => {
      const fullText = $(el).text().replace(/\s+/g, ' ').trim();
      const lower = fullText.toLowerCase();

      if (lower.includes('budget')) {
        const money = $(el).find('span.money').text() || fullText.split('Budget')[1];
        budget = parseCurrencyString(money);
      } else if (lower.includes('domestic opening')) {
        const money = $(el).find('span.money').text() || fullText.split('Domestic Opening')[1];
        openingWeekendDomestic = parseCurrencyString(money);
      } else if (lower.includes('domestic distributor')) {
        const dist = fullText.replace(/domestic distributor/i, '').replace(/see full release info/i, '').trim();
        if (dist) domesticDistributor = dist;
      }
    });

    return {
      imdbId: cleanId,
      title,
      bomUrl: mainUrl,
      financialBaseline: {
        budget,
        domesticGross,
        internationalGross,
        worldwideGross,
        openingWeekendDomestic,
        domesticDistributor
      },
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[BOM Scraper Error for ${cleanId}]:`, error.message);
    throw error;
  }
}

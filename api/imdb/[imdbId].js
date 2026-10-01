/**
 * Vercel Serverless Function: /api/imdb/[imdbId]
 * GET /api/imdb/tt15239678
 *
 * Proxies live IMDb / OMDB rating scrape from the serverless environment
 * (bypasses browser CORS restrictions that prevent frontend direct fetch).
 */

import { scrapeIMDbData } from '../../src/services/boxOfficeEngine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // IMDb ratings change daily — cache for 6 hours, stale-while-revalidate for 12 h
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=43200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { imdbId: rawId } = req.query;

  if (!rawId) {
    return res.status(400).json({ status: 'error', message: 'Missing imdbId parameter' });
  }

  const cleanId = decodeURIComponent(String(rawId)).trim();

  try {
    const data = await scrapeIMDbData(cleanId);
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    console.error(`[/api/imdb] Error for ${cleanId}:`, err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

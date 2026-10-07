/**
 * Vercel Serverless Function: /api/box-office
 * GET /api/box-office?imdbId=tt...&title=...&year=...&budget=...&revenue=...
 *
 * The main unified financial resolver called by getAggregatedMovieData() in the frontend.
 * Orchestrates Box Office Mojo + Wikipedia + IMDb + Gemini AI in parallel.
 *
 * Cache: 24 hours via Vercel Edge Network (s-maxage) so repeated calls for the same
 * film are served instantly without burning scraper quota.
 */

import { resolveLiveFinancials } from '../src/services/boxOfficeEngine.js';

export default async function handler(req, res) {
  // --- CORS & cache headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // Cache financial data for 24 h on Vercel Edge; serve stale for up to 48 h while revalidating
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=172800');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    imdbId,
    title,
    year,
    budget,
    revenue,
    tmdbId,
    movieId,
    voteAverage,
    tmdbVoteAverage,
    voteCount,
    tmdbVoteCount,
    originCountry,
    originalLanguage,
  } = req.query;

  // Resolve Gemini key from either VITE_* or bare env var (Vercel dashboard supports both)
  const geminiApiKey =
    process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  try {
    const data = await resolveLiveFinancials({
      imdbId: imdbId || '',
      title: title || '',
      releaseYear: year || null,
      tmdbBudget: Number(budget) || 0,
      tmdbRevenue: Number(revenue) || 0,
      tmdbVoteAverage:
        voteAverage || tmdbVoteAverage
          ? Number(voteAverage || tmdbVoteAverage)
          : null,
      tmdbVoteCount:
        voteCount || tmdbVoteCount
          ? Number(voteCount || tmdbVoteCount)
          : null,
      tmdbId: tmdbId || null,
      movieId: movieId || null,
      geminiApiKey,
      originCountry: originCountry
        ? JSON.parse(decodeURIComponent(originCountry))
        : null,
      originalLanguage: originalLanguage || null,
    });

    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    console.error('[/api/box-office] Error:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

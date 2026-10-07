/**
 * Vercel Serverless Function: /api/movies
 * GET /api/movies?region=IN&rotate=true&seed=12345
 *
 * Serves the curated MOCK_MOVIES catalog with optional:
 *  - Regional prioritisation (movies with affinity/streaming for the requested country first)
 *  - Session rotation (deterministic offset so hero spotlights cycle across visits)
 */

import { MOCK_MOVIES } from '../src/data/mockMovies.js';

export default function handler(req, res) {
  // --- CORS & Cache headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { region, rotate, seed } = req.query;

  let moviesList = [...MOCK_MOVIES];

  // Regional priority sort
  if (region) {
    const targetRegion = region.toUpperCase();
    moviesList.sort((a, b) => {
      const aHas =
        (a.regionAffinity && a.regionAffinity.includes(targetRegion)) ||
        (a.streamingByCountry && a.streamingByCountry[targetRegion]);
      const bHas =
        (b.regionAffinity && b.regionAffinity.includes(targetRegion)) ||
        (b.streamingByCountry && b.streamingByCountry[targetRegion]);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  }

  // Session rotation
  if (rotate === 'true' || seed) {
    const offset = seed
      ? parseInt(seed, 10) % moviesList.length
      : Math.floor(Math.random() * moviesList.length);
    moviesList = [...moviesList.slice(offset), ...moviesList.slice(0, offset)];
  }

  return res.status(200).json({
    status: 'success',
    count: moviesList.length,
    region: region || 'GLOBAL',
    spotlightMovieId: moviesList[0]?.id,
    data: moviesList,
  });
}

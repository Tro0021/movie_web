// Load local environment variables if available in Node
try { if (process.loadEnvFile) process.loadEnvFile(); } catch (e) {}

import express from 'express';
import cors from 'cors';
import { MOCK_MOVIES } from '../src/data/mockMovies.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Kinova API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

/**
 * Health check & status
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kinova Theatrical & Box Office Microservice',
    moviesCount: MOCK_MOVIES.length,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * Movies List Endpoint with Dynamic Session Rotation & Regional Priority
 * GET /api/movies?region=IN&rotate=true
 */
app.get('/api/movies', (req, res) => {
  const { region, rotate, seed } = req.query;
  let moviesList = [...MOCK_MOVIES];

  if (region) {
    const targetRegion = region.toUpperCase();
    moviesList.sort((a, b) => {
      const aHasRegion = (a.regionAffinity && a.regionAffinity.includes(targetRegion)) || (a.streamingByCountry && a.streamingByCountry[targetRegion]);
      const bHasRegion = (b.regionAffinity && b.regionAffinity.includes(targetRegion)) || (b.streamingByCountry && b.streamingByCountry[targetRegion]);
      if (aHasRegion && !bHasRegion) return -1;
      if (!aHasRegion && bHasRegion) return 1;
      return 0;
    });
  }

  if (rotate === 'true' || seed) {
    const offset = seed ? (parseInt(seed, 10) % moviesList.length) : Math.floor(Math.random() * moviesList.length);
    moviesList = [...moviesList.slice(offset), ...moviesList.slice(0, offset)];
  }

  res.json({
    status: 'success',
    count: moviesList.length,
    region: region || 'GLOBAL',
    spotlightMovieId: moviesList[0]?.id,
    data: moviesList
  });
});

// Start Express Microservice
app.listen(PORT, () => {
  console.log(`[Kinova Microservice] Running on http://127.0.0.1:${PORT}`);
  console.log(`Health Endpoint: http://127.0.0.1:${PORT}/api/health`);
  console.log(`Movies Endpoint: http://127.0.0.1:${PORT}/api/movies`);
});

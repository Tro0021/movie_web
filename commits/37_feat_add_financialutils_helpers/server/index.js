// Load local environment variables if available in Node
try { if (process.loadEnvFile) process.loadEnvFile(); } catch (e) {}

import express from 'express';
import cors from 'cors';
import { scrapeBoxOfficeMojo, financialCache, calculateIndustryTheatricalSplits } from './boxOfficeScraper.js';
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

// Preloaded fallback entries for critical blockbusters to ensure 100% reliability
const FALLBACK_FINANCIALS = {
  'tt15239678': { // Dune: Part Two
    imdbId: 'tt15239678',
    title: 'Dune: Part Two',
    financialBaseline: {
      budget: 190000000,
      domesticGross: 282144358,
      internationalGross: 432300000,
      worldwideGross: 714444358,
      openingWeekendDomestic: 82505391,
      domesticDistributor: 'Warner Bros. Pictures'
    },
    theatricalLifecycle: {
      theatricalReleaseDate: 'March 1, 2024',
      theatricalClosingDate: 'July 4, 2024',
      totalTheatricalDays: 125,
      mpaaRating: 'PG-13',
      runningTime: '2 hr 46 min'
    },
    industryRevenueSplits: calculateIndustryTheatricalSplits({
      domesticGross: 282144358,
      internationalGross: 432300000,
      worldwideGross: 714444358,
      budget: 190000000
    }),
    source: 'verified_fallback'
  },
  'tt15398776': { // Oppenheimer
    imdbId: 'tt15398776',
    title: 'Oppenheimer',
    financialBaseline: {
      budget: 100000000,
      domesticGross: 329862540,
      internationalGross: 647400000,
      worldwideGross: 977262540,
      openingWeekendDomestic: 82455420,
      domesticDistributor: 'Universal Pictures'
    },
    theatricalLifecycle: {
      theatricalReleaseDate: 'July 21, 2023',
      theatricalClosingDate: 'March 28, 2024',
      totalTheatricalDays: 250,
      mpaaRating: 'R',
      runningTime: '3 hr 0 min'
    },
    industryRevenueSplits: calculateIndustryTheatricalSplits({
      domesticGross: 329862540,
      internationalGross: 647400000,
      worldwideGross: 977262540,
      budget: 100000000
    }),
    source: 'verified_fallback'
  }
};

// IMDb ID lookup map for curated blockbusters
const MOVIE_IMDB_MAP = {
  'dune-part-two': 'tt15239678',
  '693134': 'tt15239678',
  'oppenheimer': 'tt15398776',
  '872585': 'tt15398776',
  'parasite': 'tt6751668',
  '496243': 'tt6751668',
  'rrr': 'tt8178634',
  '579974': 'tt8178634',
  'interstellar': 'tt0816692',
  '157336': 'tt0816692',
  'spider-man-across-the-spider-verse': 'tt9362722',
  '569094': 'tt9362722',
  'everything-everywhere-all-at-once': 'tt6710474',
  '545611': 'tt6710474',
  'barbie': 'tt1517268',
  '346698': 'tt1517268',
  'top-gun-maverick': 'tt1745960',
  '361743': 'tt1745960',
  'spirited-away': 'tt0245429',
  '129': 'tt0245429',
  'kalki-2898-ad': 'tt12735488',
  '801688': 'tt12735488',
  '1007807': 'tt12735488',
  'anatomy-of-a-fall': 'tt17009710',
  '915935': 'tt17009710'
};

/**
 * Health check & Cache stats
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kinova Theatrical & Box Office Microservice',
    moviesCount: MOCK_MOVIES.length,
    cacheEntries: financialCache.size,
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

/**
 * Single Movie Details Endpoint
 * GET /api/movies/:id
 */
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const decodedId = decodeURIComponent(id).trim().toLowerCase();

  const movie = MOCK_MOVIES.find(m => 
    m.id.toLowerCase() === decodedId ||
    String(m.tmdbId) === decodedId ||
    m.title.toLowerCase().replace(/[^a-z0-9]/g, '') === decodedId.replace(/[^a-z0-9]/g, '')
  );

  if (!movie) {
    return res.status(404).json({
      status: 'error',
      message: `Movie not found for identifier "${id}".`
    });
  }

  const imdbId = MOVIE_IMDB_MAP[movie.id] || MOVIE_IMDB_MAP[String(movie.tmdbId)];
  let enrichedFinancials = { ...movie.financials };

  if (imdbId) {
    try {
      const bomData = await scrapeBoxOfficeMojo(imdbId);
      if (bomData && bomData.financialBaseline) {
        enrichedFinancials = {
          ...enrichedFinancials,
          worldwideGross: bomData.financialBaseline.worldwideGross || enrichedFinancials.worldwideGross,
          domesticNet: bomData.financialBaseline.domesticGross || enrichedFinancials.domesticNet,
          overseasGross: bomData.financialBaseline.internationalGross || enrichedFinancials.overseasGross,
          openingWeekendDomestic: bomData.financialBaseline.openingWeekendDomestic || enrichedFinancials.openingWeekendDomestic,
          distributor: bomData.financialBaseline.domesticDistributor || enrichedFinancials.distributor,
          boxOfficeMojoEnriched: true,
          scrapedAt: bomData.scrapedAt
        };
      }
    } catch (e) {
      // Keep verified base financials
    }
  }

  return res.json({
    status: 'success',
    data: {
      ...movie,
      financials: enrichedFinancials
    }
  });
});

/**
 * Main Scraper API endpoint
 * GET /api/financials/:imdbId
 */
app.get('/api/financials/:imdbId', async (req, res) => {
  const { imdbId } = req.params;

  if (!imdbId) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing imdbId parameter in URL. Example: /api/financials/tt15239678'
    });
  }

  const cleanId = imdbId.trim();

  try {
    const data = await scrapeBoxOfficeMojo(cleanId);
    return res.json({
      status: 'success',
      data,
      fromCache: data.fromCache || false
    });
  } catch (error) {
    console.warn(`[Microservice Fallback Triggered] ${cleanId}: ${error.message}`);

    if (FALLBACK_FINANCIALS[cleanId]) {
      const fallback = FALLBACK_FINANCIALS[cleanId];
      return res.json({
        status: 'success',
        data: {
          ...fallback,
          scrapedAt: new Date().toISOString(),
          fromCache: false,
          warning: 'Live scraping throttled; using verified audited box office dataset.'
        },
        fromCache: false
      });
    }

    return res.status(502).json({
      status: 'error',
      message: `Failed to scrape Box Office Mojo for title ${cleanId}: ${error.message}`,
      imdbId: cleanId
    });
  }
});

/**
 * Aggregate Box Office Leaderboard Summary
 * GET /api/boxoffice/summary
 */
app.get('/api/boxoffice/summary', (req, res) => {
  const totalGross = MOCK_MOVIES.reduce((sum, m) => sum + (m.financials?.worldwideGross || 0), 0);
  const totalBudget = MOCK_MOVIES.reduce((sum, m) => sum + (m.financials?.budget || 0), 0);
  const topGrosser = [...MOCK_MOVIES].sort((a, b) => 
    (b.financials?.worldwideGross || 0) - (a.financials?.worldwideGross || 0)
  )[0];

  res.json({
    status: 'success',
    totalTrackedFilms: MOCK_MOVIES.length,
    cumulativeWorldwideGross: totalGross,
    cumulativeProductionBudget: totalBudget,
    averageMultiplier: totalBudget > 0 ? Number((totalGross / totalBudget).toFixed(2)) : 0,
    topPerformer: {
      title: topGrosser?.title,
      worldwideGross: topGrosser?.financials?.worldwideGross,
      multiplier: topGrosser?.financials?.multiplier
    }
  });
});

/**
 * Clear Cache endpoint (Admin/Debug)
 */
app.post('/api/cache/clear', (req, res) => {
  const count = financialCache.size;
  financialCache.clear();
  res.json({
    status: 'success',
    clearedEntries: count,
    message: 'Financials LRU cache cleared.'
  });
});

// Start Express Microservice
app.listen(PORT, () => {
  console.log(`[Kinova Microservice] Running on http://127.0.0.1:${PORT}`);
  console.log(`Health Endpoint: http://127.0.0.1:${PORT}/api/health`);
  console.log(`Movies Endpoint: http://127.0.0.1:${PORT}/api/movies`);
  console.log(`Financials Endpoint: http://127.0.0.1:${PORT}/api/financials/:imdbId`);
});

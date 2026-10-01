import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { resolveLiveFinancials, scrapeBoxOfficeMojo, scrapeIMDbData } from './src/services/boxOfficeEngine.js'
import { MOCK_MOVIES } from './src/data/mockMovies.js'

/**
 * Unified Backend Scraper Plugin for Vite Dev Server (Step 3)
 * Provides direct middleware handling for /api/box-office, /api/financials, /api/imdb, and /api/movies
 * without requiring a separate microservice terminal on PORT 5000.
 */
function boxOfficeServerPlugin(env = {}) {
  return {
    name: 'box-office-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url, 'http://localhost');

          // 1. Unified Box Office Scraper Route: /api/box-office?imdbId=...&title=...&year=...
          if (url.pathname === '/api/box-office') {
            const imdbId = url.searchParams.get('imdbId') || '';
            const title = url.searchParams.get('title') || '';
            const year = url.searchParams.get('year') || '';
            const budget = Number(url.searchParams.get('budget')) || 0;
            const revenue = Number(url.searchParams.get('revenue')) || 0;
            const tmdbId = url.searchParams.get('tmdbId') || '';
            const movieId = url.searchParams.get('movieId') || '';
            const voteAverage = url.searchParams.get('voteAverage') || url.searchParams.get('tmdbVoteAverage');
            const voteCount = url.searchParams.get('voteCount') || url.searchParams.get('tmdbVoteCount');

            const data = await resolveLiveFinancials({
              imdbId,
              title,
              releaseYear: year,
              tmdbBudget: budget,
              tmdbRevenue: revenue,
              tmdbVoteAverage: voteAverage ? Number(voteAverage) : null,
              tmdbVoteCount: voteCount ? Number(voteCount) : null,
              tmdbId,
              movieId,
              geminiApiKey: env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ''
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ status: 'success', data }));
            return;
          }

          // 2. Financials by IMDb ID: /api/financials/:imdbId
          if (url.pathname.startsWith('/api/financials/')) {
            const rawId = url.pathname.replace('/api/financials/', '').trim();
            const imdbId = decodeURIComponent(rawId);
            const title = url.searchParams.get('title') || '';
            const year = url.searchParams.get('year') || '';
            const budget = Number(url.searchParams.get('budget')) || 0;
            const revenue = Number(url.searchParams.get('revenue')) || 0;

            const data = await resolveLiveFinancials({
              imdbId,
              title: title || imdbId,
              releaseYear: year,
              tmdbBudget: budget,
              tmdbRevenue: revenue,
              geminiApiKey: env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ''
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ status: 'success', data }));
            return;
          }

          // 3. IMDb Live Scrape: /api/imdb/:imdbId
          if (url.pathname.startsWith('/api/imdb/')) {
            const rawId = url.pathname.replace('/api/imdb/', '').trim();
            const imdbId = decodeURIComponent(rawId);
            const data = await scrapeIMDbData(imdbId);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ status: 'success', data }));
            return;
          }

          // 4. Fallback Movies Catalog: /api/movies
          if (url.pathname === '/api/movies' || url.pathname.startsWith('/api/movies/')) {
            if (url.pathname === '/api/movies') {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                status: 'success',
                count: MOCK_MOVIES.length,
                data: MOCK_MOVIES
              }));
              return;
            }
          }
        } catch (err) {
          console.error('[Vite Scraper Middleware Error]:', err.message);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 'error', message: err.message }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      boxOfficeServerPlugin(env)
    ],
    // No proxy needed — boxOfficeServerPlugin handles all /api/* routes
    // in dev, and Vercel serverless functions handle them in production.
    build: {
      // Raise the warning threshold — mockMovies.js is intentional data, not bloat
      chunkSizeWarningLimit: 600,

      rollupOptions: {
        output: {
          manualChunks(id) {
            // React core — tiny, critical-path chunk
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            // Supabase auth client — loaded once, then cached
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            // Lucide icon set — tree-shaken but still sizeable
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-lucide';
            }
            // canvas-confetti — lazy feature, separate chunk
            if (id.includes('node_modules/canvas-confetti')) {
              return 'vendor-confetti';
            }
          }
        }
      }
    }
  };
});

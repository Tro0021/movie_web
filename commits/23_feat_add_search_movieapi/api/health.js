/**
 * Vercel Serverless Function: /api/health
 * GET /api/health
 *
 * Health check and cache statistics endpoint.
 */

import { MOCK_MOVIES } from '../src/data/mockMovies.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  return res.status(200).json({
    status: 'healthy',
    service: 'Kinova Theatrical & Box Office Vault (Vercel Serverless)',
    moviesCount: MOCK_MOVIES.length,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : 'local',
  });
}

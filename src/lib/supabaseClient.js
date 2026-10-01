import { createClient } from '@supabase/supabase-js';

// Normalize Supabase Project URL (strip trailing /rest/v1 or slashes if provided)
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

// Helper functions connecting to the `watchlist` table
export {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
  checkIfInWatchlist
} from '../services/watchlistService';

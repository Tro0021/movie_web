import { supabase } from '../lib/supabaseClient';

/**
 * Add movie to user's Supabase watchlist
 * Supports both rich schemas (with movie_data JSON/poster_url) and minimal schemas
 */
export async function addToWatchlist(userId, movie) {
  if (!userId) throw new Error('User ID is required to add to watchlist.');
  if (!movie) throw new Error('Movie object is required.');

  const movieId = String(movie.tmdbId || movie.id);

  // 1. Check if already exists in user's watchlist to prevent duplicates
  const alreadyExists = await checkIfInWatchlist(userId, movieId);
  if (alreadyExists) {
    return { status: 'already_saved', movie_id: movieId };
  }

  // Full payload containing rich movie data
  const richPayload = {
    user_id: userId,
    movie_id: movieId,
    title: movie.title || 'Untitled',
    poster_url: movie.posterUrl || movie.poster_path || '',
    release_date: movie.releaseDate || null,
    movie_data: movie
  };

  try {
    // Try inserting rich payload
    const { data, error } = await supabase
      .from('watchlist')
      .insert([richPayload])
      .select();

    if (!error) return data;

    console.warn('[watchlistService] Rich insert notice:', error.message);

    // If schema lacks movie_data or poster_url columns, retry with standard columns
    const standardPayload = {
      user_id: userId,
      movie_id: movieId,
      title: movie.title || 'Untitled',
      poster_url: movie.posterUrl || movie.poster_path || ''
    };

    const { data: stdData, error: stdError } = await supabase
      .from('watchlist')
      .insert([standardPayload])
      .select();

    if (!stdError) return stdData;

    // Fallback: minimal columns (user_id, movie_id, title)
    const minimalPayload = {
      user_id: userId,
      movie_id: movieId,
      title: movie.title || 'Untitled'
    };

    const { data: minData, error: minError } = await supabase
      .from('watchlist')
      .insert([minimalPayload])
      .select();

    if (minError) {
      // Last attempt: try upsert if table has unique constraint
      const { data: upData, error: upError } = await supabase
        .from('watchlist')
        .upsert(minimalPayload)
        .select();

      if (upError) throw upError;
      return upData;
    }

    return minData;
  } catch (err) {
    if (err?.code === '23505' || err?.message?.includes('duplicate') || err?.message?.includes('already exists') || err?.message?.includes('unique constraint')) {
      console.warn('[watchlistService] Movie already exists in user watchlist, caught gracefully.');
      return { status: 'already_saved', movie_id: movieId };
    }
    console.error('[watchlistService] addToWatchlist error:', err);
    throw err;
  }
}

/**
 * Remove movie from user's Supabase watchlist
 */
export async function removeFromWatchlist(userId, tmdbMovieId) {
  if (!userId) throw new Error('User ID is required to remove from watchlist.');
  if (!tmdbMovieId) throw new Error('Movie ID is required.');

  const movieId = String(tmdbMovieId);

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[watchlistService] removeFromWatchlist error:', err);
    throw err;
  }
}

/**
 * Get all movies in user's Supabase watchlist
 */
export async function getUserWatchlist(userId) {
  if (!userId) return [];

  try {
    // Attempt sorted query first
    let result = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fallback if created_at column doesn't exist
    if (result.error) {
      result = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId);
    }

    if (result.error) throw result.error;

    // Normalize returned rows into standard movie objects
    return (result.data || []).map(row => {
      // If full movie_data was stored, restore it
      if (row.movie_data && typeof row.movie_data === 'object') {
        return {
          ...row.movie_data,
          id: row.movie_id,
          watchlistRowId: row.id
        };
      }

      // Otherwise build fallback movie structure
      return {
        id: row.movie_id,
        tmdbId: Number(row.movie_id) || row.movie_id,
        title: row.title || 'Untitled Film',
        posterUrl: row.poster_url || row.poster_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
        releaseDate: row.release_date || '',
        synopsis: row.overview || '',
        genres: Array.isArray(row.genres) ? row.genres : ['Film'],
        ratings: { 
          imdb: { score: row.imdb_rating || null },
          tmdb: { score: row.vote_average ? Number(row.vote_average).toFixed(1) : null }
        },
        watchlistRowId: row.id
      };
    });
  } catch (err) {
    console.error('[watchlistService] getUserWatchlist error:', err);
    return [];
  }
}

/**
 * Check if a movie is already in user's Supabase watchlist
 */
export async function checkIfInWatchlist(userId, tmdbMovieId) {
  if (!userId || !tmdbMovieId) return false;

  const movieId = String(tmdbMovieId);

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .maybeSingle();

    if (error) {
      console.warn('[watchlistService] checkIfInWatchlist warning:', error.message);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error('[watchlistService] checkIfInWatchlist exception:', err);
    return false;
  }
}

import { supabase } from '../lib/supabaseClient';

/**
 * Add movie to user's Supabase watchlist
 * Explicitly constructs a clean row payload matching the Supabase `watchlist` table columns:
 * - user_id, movie_id, title, poster_path, release_date, vote_average, movie_data
 * Retries with core columns if unknown column error occurs (PGRST204 or 42703).
 */
export async function addToWatchlist(userId, movie) {
  if (!userId) throw new Error('User ID is required to add to watchlist.');
  if (!movie) throw new Error('Movie object is required.');

  const rawId = movie.id || movie.tmdb_movie_id || movie.tmdbId;
  const movieId = (!isNaN(Number(rawId)) && rawId !== '') ? Number(rawId) : rawId;

  // 1. Check if already exists in user's watchlist to prevent duplicates
  const alreadyExists = await checkIfInWatchlist(userId, movieId);
  if (alreadyExists) {
    return { status: 'already_saved', movie_id: movieId };
  }

  // Exact payload matching Supabase watchlist schema
  const payload = {
    user_id: userId,
    tmdb_movie_id: Number(movie.id || movie.tmdb_movie_id || movie.tmdbId || 0),
    movie_id: Number(movie.id || movie.tmdb_movie_id || movie.tmdbId || 0),
    title: movie.title || movie.name || 'Untitled',
    poster_path: movie.poster_path || movie.poster || movie.posterUrl || '',
    release_date: movie.release_date || movie.releaseDate || '',
    vote_average: Number(movie.vote_average || movie.rating || 0),
    movie_data: movie,
    added_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .upsert(payload, { onConflict: 'user_id, tmdb_movie_id' });

    if (!error) return data;

    // Log exact error message so it never fails silently
    console.warn('[watchlistService] Upsert notice:', error.message, `(Code: ${error.code})`);

    // Handle duplicate error gracefully if caught by DB constraint
    if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('already exists') || error.message?.includes('unique constraint')) {
      console.warn('[watchlistService] Movie already exists in user watchlist, caught gracefully.');
      return { status: 'already_saved', movie_id: movieId };
    }

    // If unknown column error (PGRST204 or 42703), retry by omitting non-core columns
    if (error.code === 'PGRST204' || error.code === '42703' || error.message?.toLowerCase().includes('column') || error.message?.toLowerCase().includes('does not exist')) {
      console.warn('[watchlistService] Unknown column detected. Retrying with core schema columns. Error:', error.message);

      const corePayload = {
        user_id: userId,
        movie_id: movieId,
        title: payload.title,
        poster_path: payload.poster_path
      };

      const { data: coreData, error: coreError } = await supabase
        .from('watchlist')
        .insert([corePayload])
        .select();

      if (!coreError) return coreData;

      if (coreError.code === '23505' || coreError.message?.includes('duplicate') || coreError.message?.includes('already exists')) {
        return { status: 'already_saved', movie_id: movieId };
      }

      console.error('[watchlistService] Core fallback insert failed:', coreError.message);
      throw coreError;
    }

    throw error;
  } catch (err) {
    if (err?.code === '23505' || err?.message?.includes('duplicate') || err?.message?.includes('already exists')) {
      return { status: 'already_saved', movie_id: movieId };
    }
    console.error('[watchlistService] addToWatchlist error:', err.message || err);
    throw err;
  }
}

/**
 * Remove movie from user's Supabase watchlist
 */
export async function removeFromWatchlist(userId, tmdbMovieId) {
  if (!userId) throw new Error('User ID is required to remove from watchlist.');
  if (!tmdbMovieId) throw new Error('Movie ID is required.');

  const rawId = tmdbMovieId;
  const numId = !isNaN(Number(rawId)) ? Number(rawId) : rawId;
  const strId = String(rawId);

  try {
    let { data, error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', numId);

    // If type mismatch occurred, retry with string ID
    if (error && (error.code === '22P02' || error.message?.includes('invalid input syntax'))) {
      const retry = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', strId);
      if (retry.error) throw retry.error;
      return retry.data;
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[watchlistService] removeFromWatchlist error:', err.message || err);
    throw err;
  }
}

/**
 * Get all movies in user's Supabase watchlist
 * Maps returned rows into complete movie objects for UI rendering
 */
export async function getUserWatchlist(userId) {
  if (!userId) return [];

  try {
    // Attempt sorted query first by added_at, then created_at
    let result = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    // Fallback if added_at column doesn't exist
    if (result.error) {
      result = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    }

    // Fallback if created_at column doesn't exist
    if (result.error) {
      result = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId);
    }

    if (result.error) {
      console.error('[watchlistService] getUserWatchlist query error:', result.error.message);
      throw result.error;
    }

    // Normalize returned rows into standard movie objects
    return (result.data || []).map(row => {
      // Resolve poster URL: handle full URLs, relative TMDB paths, and fallbacks
      let posterUrl = row.poster_path || row.poster_url || '';
      if (posterUrl && !posterUrl.startsWith('http') && posterUrl.startsWith('/')) {
        posterUrl = `https://image.tmdb.org/t/p/w500${posterUrl}`;
      }
      if (!posterUrl) {
        posterUrl = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
      }

      // If full movie_data was stored in JSONB, merge and hydrate
      if (row.movie_data && typeof row.movie_data === 'object') {
        const mData = row.movie_data;
        let mPosterUrl = mData.posterUrl || mData.poster_path || posterUrl;
        if (mPosterUrl && !mPosterUrl.startsWith('http') && mPosterUrl.startsWith('/')) {
          mPosterUrl = `https://image.tmdb.org/t/p/w500${mPosterUrl}`;
        }
        return {
          ...mData,
          id: row.movie_id ?? mData.id,
          tmdbId: Number(row.movie_id ?? mData.tmdbId ?? mData.id) || row.movie_id,
          title: row.title || mData.title || mData.name || 'Untitled Film',
          posterUrl: mPosterUrl || posterUrl,
          poster_path: row.poster_path || mData.poster_path || '',
          releaseDate: row.release_date || mData.releaseDate || mData.release_date || '',
          release_date: row.release_date || mData.release_date || mData.releaseDate || '',
          vote_average: Number(row.vote_average ?? mData.vote_average ?? 0),
          watchlistRowId: row.id
        };
      }

      // Otherwise build fallback movie structure matching Watchlist UI expectations
      const voteAvg = Number(row.vote_average) || null;
      return {
        id: row.movie_id,
        tmdbId: Number(row.movie_id) || row.movie_id,
        title: row.title || 'Untitled Film',
        posterUrl,
        poster_path: row.poster_path || '',
        releaseDate: row.release_date || '',
        release_date: row.release_date || '',
        synopsis: row.overview || '',
        genres: Array.isArray(row.genres) ? row.genres : ['Film'],
        ratings: { 
          imdb: { score: row.imdb_rating || (voteAvg ? voteAvg.toFixed(1) : null) },
          tmdb: { score: voteAvg ? voteAvg.toFixed(1) : null }
        },
        vote_average: voteAvg || 0,
        watchlistRowId: row.id
      };
    });
  } catch (err) {
    console.error('[watchlistService] getUserWatchlist error:', err.message || err);
    return [];
  }
}

/**
 * Check if a movie is already in user's Supabase watchlist
 */
export async function checkIfInWatchlist(userId, tmdbMovieId) {
  if (!userId || !tmdbMovieId) return false;

  const rawId = tmdbMovieId;
  const numId = !isNaN(Number(rawId)) ? Number(rawId) : rawId;
  const strId = String(rawId);

  try {
    let { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', numId)
      .maybeSingle();

    if (error && (error.code === '22P02' || error.message?.includes('invalid input syntax'))) {
      const retry = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', userId)
        .eq('movie_id', strId)
        .maybeSingle();
      if (!retry.error) return Boolean(retry.data);
    }

    if (error) {
      console.warn('[watchlistService] checkIfInWatchlist warning:', error.message);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error('[watchlistService] checkIfInWatchlist exception:', err.message || err);
    return false;
  }
}

import React, { useState } from 'react';
import { 
  Play, Sparkles, Film, Star, Info, ArrowRight, Bookmark, 
  RotateCw, SlidersHorizontal, Globe 
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { formatCurrency } from '../services/financialUtils';
import { COUNTRY_OPTIONS } from '../data/mockMovies';
import { resolveMoviePoster, resolveMovieBackdrop } from '../services/mediaResolver';
import { matchesGenreChoice } from '../services/genreEngine';

export default function HomePage({ 
  movies = [], 
  onSelectMovie, 
  watchlist = [], 
  onToggleWatchlist, 
  onPlayTrailer, 
  currentCountry = 'US',
  onCountryChange,
  tasteProfile,
  onOpenTasteModal,
  onRefreshMovies
}) {
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('gross');

  const activeCountryObj = COUNTRY_OPTIONS.find(c => c.code === currentCountry) || COUNTRY_OPTIONS[0];

  // Dynamic hero movie
  const heroMovie = movies[0];

  const allGenres = ['ALL', ...Array.from(new Set(movies.flatMap(m => m.genres || [])))];

  // 1. Filtered General Movies
  const filteredMovies = (movies || []).filter(movie => {
    return selectedGenre === 'ALL' || movie.genres?.includes(selectedGenre);
  }).sort((a, b) => {
    if (sortBy === 'gross') {
      return (b.financials?.worldwideGross || 0) - (a.financials?.worldwideGross || 0);
    }
    if (sortBy === 'rating') {
      return (b.ratings?.imdb?.score || 0) - (a.ratings?.imdb?.score || 0);
    }
    if (sortBy === 'year') {
      return (b.releaseDate || '').localeCompare(a.releaseDate || '');
    }
    return 0;
  });

  // 2. Regional Films — movies PRODUCED in the selected country (originCountry).
  // For 'ALL', show the full catalog. Falls back to regionAffinity if no origin match.
  const regionalMoviesRaw = currentCountry === 'ALL'
    ? movies
    : (movies || []).filter(m => m.originCountry?.includes(currentCountry));
  // Graceful fallback: if no films were made there, show ones available there
  const regionalMovies = regionalMoviesRaw.length > 0
    ? regionalMoviesRaw
    : (movies || []).filter(m => m.regionAffinity?.includes(currentCountry));


  // 3. User's Personalized Curated Cinema Archive (Strict requirement fulfillment)
  const curatedArchiveMovies = (movies || []).filter(m => {
    if (!tasteProfile?.genres || tasteProfile.genres.length === 0) return true;
    return matchesGenreChoice(m, tasteProfile.genres);
  });

  const isHeroWatchlisted = heroMovie && watchlist.some(m => m.id === heroMovie.id);

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* Cinematic Hero Section */}
      {heroMovie && (
        <div className="relative w-full rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[540px] flex items-end border border-white/10 shadow-2xl">
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-[#0e121c]">
            <img 
              src={heroMovie.backdropUrl || heroMovie.posterUrl} 
              alt={heroMovie.title}
              onError={async (e) => {
                e.target.onerror = null;
                try {
                  const dynamicBackdrop = await resolveMovieBackdrop(heroMovie.title, heroMovie.genres);
                  if (dynamicBackdrop) {
                    e.target.src = dynamicBackdrop;
                    return;
                  }
                } catch {}
                e.target.src = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80";
              }}
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-105"
            />
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Featured Spotlight
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-slate-200 border border-white/15">
                {heroMovie.financials?.verdict || 'Featured'}
              </span>
              <span className="text-xs text-slate-300">
                Premiere: {heroMovie.premiereDate || heroMovie.releaseDate || 'N/A'} • Release Date: {heroMovie.releaseDate || 'N/A'} • {heroMovie.runtimeMinutes ? `${heroMovie.runtimeMinutes} min` : 'Runtime N/A'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none font-heading">
              {heroMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-2xl font-normal">
              {heroMovie.synopsis}
            </p>

            {/* Financial & Critical Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Worldwide Box Office</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-heading">
                  {formatCurrency(
                    heroMovie.financials?.worldwideGross || heroMovie.financials?.worldwideGrossRaw, 
                    currentCountry, 
                    { nativeInrCrores: heroMovie.financials?.grossInrCrores }
                  )}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical Consensus</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold text-white font-heading">{heroMovie.ratings?.imdb?.score || 'N/A'}</span>
                  <span className="text-xs text-slate-400">/10 IMDb</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Director</span>
                <span className="text-sm font-bold text-white">{heroMovie.director}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onSelectMovie(heroMovie)}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm shadow-xl shadow-black/40 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Explore Dossier & Theatrical Run</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onPlayTrailer(heroMovie)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(heroMovie)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-all border cursor-pointer ${
                  isHeroWatchlisted 
                    ? 'bg-amber-400 border-amber-400 text-black shadow-lg shadow-black/30' 
                    : 'bg-black/50 border-white/15 text-white hover:bg-black/70'
                }`}
                title="Save to Watchlist"
              >
                <Bookmark className={`w-4 h-4 ${isHeroWatchlisted ? 'fill-black' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Section 1: Curated Cinema Archive Banner */}
      {tasteProfile ? (
        <div className="rounded-2xl p-6 sm:p-7 bg-[#121622] border border-amber-500/30 glass-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
                <Film className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Your Curated Cinema Archive
                </h3>
                <p className="text-xs text-slate-400">
                  Filtered by your selected genres: <span className="text-slate-200 font-medium">{tasteProfile.genres?.join(', ')}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onOpenTasteModal}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Re-Tune Cinema</span>
            </button>
          </div>

          {/* Curated Archive Preview Reel */}
          {curatedArchiveMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {curatedArchiveMovies.slice(0, 4).map(movie => (
                <div 
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="group p-3 rounded-2xl bg-[#0e121c] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all flex flex-col justify-between space-y-2 shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-900">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      onError={async (e) => {
                        e.target.onerror = null;
                        try {
                          const dynamicPoster = await resolveMoviePoster(movie.title);
                          if (dynamicPoster) {
                            e.target.src = dynamicPoster;
                            return;
                          }
                        } catch {}
                        e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black shadow">
                      {movie.genres?.[0] || 'Curated'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300">{movie.title}</h4>
                    <p className="text-[10px] text-amber-300/80 truncate">{movie.genres?.slice(0, 2).join(' • ')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0a0d14] border border-white/5 text-center space-y-2">
              <p className="text-xs text-slate-300">
                No films in the vault currently match your exact selected genres.
              </p>
              <button
                onClick={onOpenTasteModal}
                className="px-4 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Select More Genres
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-6 sm:p-7 bg-[#121622] border border-amber-500/20 hover:border-amber-400/40 glass-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Film className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Personalized Curation
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                Build Your Personal Curated Cinema Archive
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Select your favorite cinema genres and narrative movements to generate a bespoke, personalized film vault.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTasteModal}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Curate Cinema Archive</span>
          </button>
        </div>
      )}

      {/* Feature Section 2: Regional Cinema Spotlight */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
                {currentCountry === 'ALL'
                  ? 'Global Cinema Vault'
                  : `Made in ${activeCountryObj.name}`}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentCountry === 'ALL'
                ? 'Films from every territory in our catalog'
                : regionalMoviesRaw.length > 0
                  ? `${regionalMovies.length} film${regionalMovies.length !== 1 ? 's' : ''} produced in ${activeCountryObj.name}`
                  : `No productions from ${activeCountryObj.name} yet — showing titles available there`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Switch Region:</span>
            <select
              value={currentCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="bg-[#121622] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {COUNTRY_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Regional Film Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {regionalMovies.slice(0, 4).map(movie => (
            <MovieCard
              key={`reg-${movie.id}`}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isWatchlisted={watchlist.some(w => w.id === movie.id)}
              onToggleWatchlist={onToggleWatchlist}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>
      </div>

      {/* Feature Section 3: Master Film Vault & Dynamic Rotation */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                Curated Cinema Archive
              </h2>
              <button
                onClick={onRefreshMovies}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Shuffle Film Vault with new titles"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Shuffle Titles</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">Audited box office collections, distributor splits & global streaming rights</p>
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121622] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="gross">Worldwide Gross</option>
              <option value="rating">IMDb Rating</option>
              <option value="year">Release Year</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-[#121622] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {genre === 'ALL' ? 'All Genres' : genre}
            </button>
          ))}
        </div>

        {/* Master Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isWatchlisted={watchlist.some(w => w.id === movie.id)}
              onToggleWatchlist={onToggleWatchlist}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

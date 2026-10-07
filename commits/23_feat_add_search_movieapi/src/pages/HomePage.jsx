import React, { useState } from 'react';
import { 
  Play, Sparkles, Film, Star, Info, ArrowRight, Bookmark, 
  RotateCw, SlidersHorizontal, Globe 
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { formatRegionCurrency } from '../utils/currencyFormatter';
import { COUNTRY_OPTIONS } from '../data/mockMovies';
import { matchesGenreChoice } from '../services/genreEngine';

const BACKDROP_FALLBACK = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80";

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

  const heroMovie = movies[0];
  const allGenres = ['ALL', ...Array.from(new Set(movies.flatMap(m => m.genres || [])))];

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

  const regionalMoviesRaw = currentCountry === 'ALL'
    ? movies
    : (movies || []).filter(m => m.originCountry?.includes(currentCountry));

  const regionalMovies = regionalMoviesRaw.length > 0
    ? regionalMoviesRaw
    : (movies || []).filter(m => m.regionAffinity?.includes(currentCountry));

  const curatedArchiveMovies = (movies || []).filter(m => {
    if (!tasteProfile?.genres || tasteProfile.genres.length === 0) return true;
    return matchesGenreChoice(m, tasteProfile.genres);
  });

  const isHeroWatchlisted = heroMovie && watchlist.some(m => m.id === heroMovie.id);

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {heroMovie && (
        <div className="relative w-full rounded-[4px] overflow-hidden min-h-[500px] sm:min-h-[540px] flex items-end border border-[#262522] bg-[#121210] shadow-2xl">
          <div className="absolute inset-0 bg-[#121210]">
            <img 
              src={heroMovie.backdropUrl || heroMovie.posterUrl} 
              alt={heroMovie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = BACKDROP_FALLBACK;
              }}
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A09] via-[#0A0A09]/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30">
                Archival Spotlight
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-black/80 backdrop-blur-sm text-[#F4F0EA] border border-white/10">
                {heroMovie.financials?.verdict || 'Archived'}
              </span>
              <span className="font-mono text-xs text-[#8C877E]">
                Release: {heroMovie.releaseDate || 'N/A'} • {heroMovie.runtimeMinutes ? `${heroMovie.runtimeMinutes}m` : 'Runtime N/A'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F0EA] tracking-tight leading-none">
              {heroMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-[#8C877E] line-clamp-3 leading-relaxed max-w-2xl font-sans">
              {heroMovie.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-[#262522]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block">Worldwide Box Office</span>
                <span className="text-xl sm:text-2xl font-mono text-[#D9C39A] tabular-nums font-medium">
                  {formatRegionCurrency(
                    heroMovie.financials?.worldwideGross || heroMovie.financials?.worldwideGrossRaw, 
                    currentCountry, 
                    { nativeInrCrores: heroMovie.financials?.grossInrCrores }
                  )}
                </span>
              </div>
              <div className="h-8 w-px bg-[#262522] hidden sm:block" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block">Critical Consensus</span>
                <div className="flex items-center gap-1.5 font-mono text-lg text-[#F4F0EA] tabular-nums">
                  <span className="text-[#D9C39A]">★ {heroMovie.ratings?.imdb?.score || 'N/A'}</span>
                  <span className="text-xs text-[#8C877E]">/10 IMDb</span>
                </div>
              </div>
              <div className="h-8 w-px bg-[#262522] hidden sm:block" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block">Director</span>
                <span className="text-sm font-medium text-[#F4F0EA] font-sans">{heroMovie.director}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onSelectMovie(heroMovie)}
                className="px-5 py-2.5 rounded-[2px] bg-[#E03C31] hover:bg-[#C83228] text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 group cursor-pointer shadow-md"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Examine Ledger & Run</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onPlayTrailer(heroMovie)}
                className="px-4 py-2.5 rounded-[2px] bg-[#121210] hover:bg-[#181816] text-[#F4F0EA] font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-[#262522] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>35mm Trailer</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(heroMovie)}
                className={`p-2.5 rounded-[2px] transition-all border cursor-pointer ${
                  isHeroWatchlisted 
                    ? 'bg-[#E03C31] border-[#E03C31] text-white shadow' 
                    : 'bg-[#121210] border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] hover:bg-[#181816]'
                }`}
                title="Save to Watchlist"
              >
                <Bookmark className={`w-4 h-4 ${isHeroWatchlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Section: Regional Cinema Spotlight */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262522] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D9C39A]" />
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F0EA]">
                {currentCountry === 'ALL'
                  ? 'Global Cinema Vault'
                  : `Made in ${activeCountryObj.name}`}
              </h2>
            </div>
            <p className="text-xs text-[#8C877E] mt-1">
              Regional cinema selections from our audited catalog
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#8C877E] uppercase">Territory:</span>
            <select
              value={currentCountry}
              onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
              className="bg-[#121210] border border-[#262522] rounded-[2px] px-3 py-1.5 text-xs font-mono text-[#F4F0EA] focus:outline-none focus:border-[#D9C39A] cursor-pointer"
            >
              {COUNTRY_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

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

      {/* Feature Section: Master Film Vault */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F0EA] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#D9C39A]" />
                Curated Cinema Archive
              </h2>
              {onRefreshMovies && (
                <button
                  onClick={onRefreshMovies}
                  className="p-1.5 rounded-[2px] bg-[#121210] hover:bg-[#181816] border border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                  title="Shuffle Film Vault with new titles"
                >
                  <RotateCw className="w-3 h-3 text-[#D9C39A]" />
                  <span className="hidden sm:inline text-[10px] uppercase">Rotate Titles</span>
                </button>
              )}
            </div>
            <p className="text-xs text-[#8C877E]">Audited box office collections, distributor splits & global distribution rights</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#8C877E] uppercase">Sort Ledger:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121210] border border-[#262522] rounded-[2px] px-3 py-1.5 text-xs font-mono text-[#F4F0EA] focus:outline-none focus:border-[#D9C39A] cursor-pointer"
            >
              <option value="gross">Worldwide Gross</option>
              <option value="rating">IMDb Rating</option>
              <option value="year">Release Year</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[#181816] text-[#F4F0EA] border border-[#D9C39A]/60 font-medium'
                  : 'bg-[#121210] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522]'
              }`}
            >
              {genre === 'ALL' ? 'All Genres' : genre}
            </button>
          ))}
        </div>

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

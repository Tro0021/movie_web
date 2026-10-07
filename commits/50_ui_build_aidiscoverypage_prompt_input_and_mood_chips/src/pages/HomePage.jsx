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
        <div className="relative w-full rounded-[4px] overflow-hidden min-h-[500px] sm:min-h-[540px] flex items-end border border-[#262522] bg-[#121210] shadow-2xl">
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-[#121210]">
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
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-105"
            />
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A09] via-[#0A0A09]/80 to-transparent" />
          </div>

          {/* Hero Content */}
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

            {/* Financial & Critical Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-[#262522]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block">Worldwide Box Office</span>
                <span className="text-xl sm:text-2xl font-mono text-[#D9C39A] tabular-nums font-medium">
                  {formatCurrency(
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onSelectMovie(heroMovie)}
                className="px-5 py-2.5 rounded-[2px] bg-[#E03C31] hover:bg-[#C83228] text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 group cursor-pointer shadow-md"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Examine Ledger &amp; Run</span>
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

      {/* Feature Section 1: Curated Cinema Archive Banner */}
      {tasteProfile ? (
        <div className="rounded-[4px] p-6 sm:p-7 bg-[#121210] border border-[#262522] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[2px] bg-[#181816] border border-[#262522] text-[#D9C39A] flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F4F0EA]">
                  Your Curated Cinema Vault
                </h3>
                <p className="text-xs text-[#8C877E]">
                  Calibrated to your selected genres: <span className="text-[#D9C39A] font-mono">{tasteProfile.genres?.join(', ')}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onOpenTasteModal}
              className="px-3.5 py-1.5 rounded-[2px] bg-[#181816] hover:bg-[#201F1D] border border-[#262522] text-[#F4F0EA] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D9C39A]" />
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
                  className="group p-2.5 rounded-[4px] bg-[#121210] border border-[#262522] hover:border-[#D9C39A]/40 cursor-pointer transition-all flex flex-col justify-between space-y-2 hover:-translate-y-1"
                >
                  <div className="relative aspect-[2/3] rounded-[2px] overflow-hidden bg-[#181816] border border-white/10">
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
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] uppercase bg-black/80 text-[#D9C39A] border border-[#D9C39A]/30">
                      {movie.genres?.[0] || 'Curated'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#F4F0EA] truncate group-hover:text-[#D9C39A]">{movie.title}</h4>
                    <p className="font-mono text-[10px] text-[#8C877E] truncate">{movie.genres?.slice(0, 2).join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-[4px] bg-[#181816] border border-[#262522] text-center space-y-2">
              <p className="text-xs text-[#8C877E]">
                No films in the vault currently match your exact selected genres.
              </p>
              <button
                onClick={onOpenTasteModal}
                className="px-4 py-1.5 rounded-[2px] bg-[#121210] hover:bg-[#201F1D] border border-[#262522] text-[#D9C39A] font-mono text-xs uppercase transition-colors cursor-pointer"
              >
                Expand Genre Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[4px] p-6 sm:p-7 bg-[#121210] border border-[#262522] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[2px] bg-[#181816] border border-[#262522] flex items-center justify-center text-[#D9C39A] flex-shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9C39A] block">
                Personalized Archival Curation
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#F4F0EA]">
                Build Your Personal Curated Cinema Vault
              </h3>
              <p className="text-xs text-[#8C877E] max-w-xl">
                Select your preferred cinema genres and narrative traditions to tune an authentic, bespoke film ledger.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTasteModal}
            className="px-5 py-2.5 rounded-[2px] bg-[#E03C31] hover:bg-[#C83228] text-white font-mono text-xs uppercase tracking-widest transition-all shadow flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calibrate Vault</span>
          </button>
        </div>
      )}

      {/* Feature Section 2: Regional Cinema Spotlight */}
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
              {currentCountry === 'ALL'
                ? 'Films from every territory in our audited catalog'
                : regionalMoviesRaw.length > 0
                  ? `${regionalMovies.length} title${regionalMovies.length !== 1 ? 's' : ''} produced in ${activeCountryObj.name}`
                  : `No productions from ${activeCountryObj.name} yet — showing titles available there`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#8C877E] uppercase">Territory:</span>
            <select
              value={currentCountry}
              onChange={(e) => onCountryChange(e.target.value)}
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
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F0EA] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#D9C39A]" />
                Curated Cinema Archive
              </h2>
              <button
                onClick={onRefreshMovies}
                className="p-1.5 rounded-[2px] bg-[#121210] hover:bg-[#181816] border border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                title="Shuffle Film Vault with new titles"
              >
                <RotateCw className="w-3 h-3 text-[#D9C39A]" />
                <span className="hidden sm:inline text-[10px] uppercase">Rotate Titles</span>
              </button>
            </div>
            <p className="text-xs text-[#8C877E]">Audited box office collections, distributor splits &amp; global distribution rights</p>
          </div>

          {/* Sorter */}
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

        {/* Genre Pill Filters -> Sharp Architectural Tabs */}
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

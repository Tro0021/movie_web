import React, { useState } from 'react';
import { 
  ArrowLeft, Play, Bookmark, Star, 
  Share2, Check, Cloud, Calendar
} from 'lucide-react';
import { resolveMoviePoster, resolveMovieBackdrop } from '../services/mediaResolver';
import { useRegion } from '../context/RegionContext';
import { formatRegionCurrency } from '../utils/currencyFormatter';

export default function MovieDetailsPage({ 
  movie, 
  onBack, 
  watchlist = [], 
  onToggleWatchlist, 
  onPlayTrailer, 
  currentCountry, 
  user, 
  onOpenAuth
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const regionContext = useRegion();
  const activeRegion = currentCountry || regionContext?.selectedRegion || 'IN';

  if (!movie) return null;

  const currentMovieId = String(movie.tmdbId || movie.id);
  const isWatchlisted = watchlist.some(m => 
    String(m.id) === currentMovieId || 
    String(m.tmdbId) === currentMovieId ||
    String(m.id) === String(movie.id)
  );

  const handleWatchlistClick = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
    } else if (onToggleWatchlist) {
      onToggleWatchlist(movie);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in font-sans">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#262522] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#181816] border border-[#262522] text-xs font-mono text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E03C31]" />
          <span>RETURN TO VAULT</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#181816] border border-[#262522] text-xs font-mono text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#8C877E]" />}
            <span>{copiedLink ? 'COPIED' : 'SHARE'}</span>
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] text-xs font-mono font-medium transition-all cursor-pointer ${
              isWatchlisted
                ? 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40'
                : 'bg-[#121210] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522] hover:border-[#8C877E]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#D9C39A] text-[#D9C39A]' : 'text-[#8C877E]'}`} />
            <span>{isWatchlisted ? 'ARCHIVED' : 'ARCHIVE ENTRY'}</span>
            {user && (
              <Cloud className="w-3 h-3 text-[#D9C39A] opacity-80" />
            )}
          </button>
        </div>
      </div>

      {/* Cinematic Hero Header */}
      <div className="relative rounded-[4px] overflow-hidden border border-[#262522] bg-[#121210] shadow-2xl">
        <div className="absolute inset-0 h-96 sm:h-[450px] bg-[#0A0A09]">
          <img 
            src={movie.backdropUrl || movie.posterUrl} 
            alt={movie.title}
            onError={async (e) => {
              e.target.onerror = null;
              try {
                const dynamicBackdrop = await resolveMovieBackdrop(movie.title, movie.genres);
                if (dynamicBackdrop) {
                  e.target.src = dynamicBackdrop;
                  return;
                }
              } catch {}
              e.target.src = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80";
            }}
            className="w-full h-full object-cover object-center filter brightness-40 contrast-125 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121210] via-[#121210]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 pt-28 sm:pt-40 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Column */}
          <div className="w-44 sm:w-56 md:w-64 flex-shrink-0 mx-auto md:mx-0 rounded-[4px] overflow-hidden border border-white/15 relative group bg-[#181816] shadow-2xl">
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
              className="w-full aspect-[2/3] object-cover"
            />
            {movie.youtubeTrailerId && (
              <button
                onClick={() => onPlayTrailer && onPlayTrailer(movie)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-[4px] bg-[#E03C31] text-white flex items-center justify-center hover:bg-[#c83228] transition-all cursor-pointer shadow-lg"
                title="Play Trailer"
              >
                <Play className="w-5 h-5 ml-0.5 fill-white" />
              </button>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30">
                {movie.financials?.verdict || 'FEATURED ARCHIVE'}
              </span>
              <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#181816] text-[#8C877E] border border-[#262522]">
                PREMIERE: {movie.premiereDate || movie.releaseDate || 'TBA'}
              </span>
              <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#181816] text-[#8C877E] border border-[#262522]">
                RUNTIME: {movie.runtimeMinutes ? `${movie.runtimeMinutes}M` : 'N/A'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F4F0EA] tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base italic font-serif text-[#D9C39A]/90">
                "{movie.tagline}"
              </p>
            )}

            <p className="text-sm text-[#8C877E] leading-relaxed max-w-3xl">
              {movie.synopsis}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#262522]">
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">Director</span>
                <span className="text-xs font-semibold text-[#F4F0EA] truncate block">{movie.director}</span>
              </div>
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">Worldwide Gross</span>
                <span className="text-xs font-mono font-semibold tabular-nums text-[#D9C39A]">
                  {formatRegionCurrency(
                    movie.financials?.worldwideGross || movie.financials?.worldwideGrossRaw, 
                    activeRegion, 
                    { nativeInrCrores: movie.financials?.grossInrCrores, compact: true }
                  )}
                </span>
              </div>
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">Production Budget</span>
                <span className="text-xs font-mono font-semibold tabular-nums text-[#F4F0EA]">
                  {formatRegionCurrency(
                    movie.financials?.budget || movie.financials?.budgetRaw, 
                    activeRegion, 
                    { nativeInrCrores: movie.financials?.budgetInrCrores, compact: true }
                  )}
                </span>
              </div>
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">IMDb Consensus</span>
                <div className="flex items-center gap-1 text-xs font-mono font-semibold tabular-nums text-[#D9C39A]">
                  <Star className="w-3 h-3 fill-[#D9C39A] text-[#D9C39A]" />
                  <span>{movie.ratings?.imdb?.score || 'N/A'} / 10</span>
                </div>
              </div>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {movie.genres?.map((genre, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase bg-[#181816] text-[#8C877E] border border-[#262522]">
                  {genre}
                </span>
              ))}
            </div>

            {/* Trailer & Watchlist Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {movie.youtubeTrailerId && (
                <button
                  onClick={() => onPlayTrailer && onPlayTrailer(movie)}
                  className="px-4 py-2 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>35mm Trailer Projection</span>
                </button>
              )}

              <button
                onClick={handleWatchlistClick}
                className={`px-4 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                  isWatchlisted
                    ? 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40'
                    : 'bg-[#181816] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] hover:border-[#8C877E]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#D9C39A] text-[#D9C39A]' : 'text-[#8C877E]'}`} />
                <span>{isWatchlisted ? 'Archived to Vault' : 'Add to Ledger Vault'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

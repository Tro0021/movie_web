import React, { useState } from 'react';
import { 
  ArrowLeft, Play, Bookmark, Star, 
  DollarSign, Tv, Globe, Share2, 
  Check, Cloud, Award, Users, Film, Calendar
} from 'lucide-react';
import FinancialsHub from '../components/FinancialsHub';
import StreamingTicketing from '../components/StreamingTicketing';
import GlobalContextSection from '../components/GlobalContextModal';
import ReviewAggregator from '../components/ReviewAggregator';
import MovieCard from '../components/MovieCard';
import { resolveMoviePoster, resolveMovieBackdrop } from '../services/mediaResolver';
import { MOCK_MOVIES } from '../data/mockMovies';
import { useRegion } from '../context/RegionContext';
import { formatRegionCurrency } from '../utils/currencyFormatter';

export default function MovieDetailsPage({ 
  movie, 
  onBack, 
  watchlist = [], 
  onToggleWatchlist, 
  onPlayTrailer, 
  allMovies = [], 
  onSelectMovie, 
  currentCountry, 
  onCountryChange,
  user,
  onOpenAuth,
  apiKey = ''
}) {
  const [activeTab, setActiveTab] = useState('financials');
  const [copiedLink, setCopiedLink] = useState(false);
  const regionContext = useRegion();
  const activeRegion = currentCountry || regionContext?.selectedRegion || 'IN';

  if (!movie) return null;

  // Detect upcoming/unreleased status
  const UPCOMING_TMDB_STATUSES = ['Upcoming', 'In Production', 'Planned', 'Post Production'];
  const isUpcoming = movie.isUpcoming === true ||
    UPCOMING_TMDB_STATUSES.includes(movie.tmdbStatus) ||
    (movie.releaseDate && new Date(movie.releaseDate) > new Date());

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

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

  const similarMovies = (allMovies || []).filter(
    m => m && m.id !== movie.id && (
      movie.similarMovieIds?.includes(m.id) ||
      m.genres?.some(g => movie.genres?.includes(g)) ||
      (m.director && m.director === movie.director)
    )
  );

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
            title={!user ? "Sign in to save movies to your cloud watchlist" : isWatchlisted ? "In Watchlist" : "Save to Watchlist"}
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
        {/* Backdrop Image */}
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

        {/* Content Container */}
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
                onClick={() => onPlayTrailer(movie)}
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
              {/* Verdict / Status Badge */}
              {isUpcoming ? (
                <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-[#181816] text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {movie.tmdbStatus === 'In Production' ? 'IN PRODUCTION'
                    : movie.tmdbStatus === 'Post Production' ? 'POST PRODUCTION'
                    : movie.tmdbStatus === 'Planned' ? 'PLANNED'
                    : 'UPCOMING'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30">
                  {movie.financials?.verdict || 'FEATURED ARCHIVE'}
                </span>
              )}
              {isUpcoming && movie.releaseDate && (
                <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#181816] text-[#8C877E] border border-[#262522] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#E03C31]" /> DUE: {formatReleaseDate(movie.releaseDate)}
                </span>
              )}
              {!isUpcoming && (
                <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#181816] text-[#8C877E] border border-[#262522]">
                  PREMIERE: {movie.premiereDate || movie.releaseDate}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#181816] text-[#8C877E] border border-[#262522]">
                RUNTIME: {movie.runtimeMinutes ? `${movie.runtimeMinutes}M` : isUpcoming ? 'TBA' : 'N/A'}
              </span>
              {(() => {
                const badgeCert = isUpcoming ? 'TBA'
                  : (movie.primaryCertification || 
                     movie.certification || 
                     movie.globalContext?.primaryCertification || 
                     movie.globalContext?.certifications?.[0]?.rating || 
                     'NR');
                return (
                  <span className="px-1.5 py-0.5 rounded-[2px] font-mono text-[10px] font-semibold border tracking-wider bg-[#181816] text-[#D9C39A] border-[#262522]">
                    {badgeCert}
                  </span>
                );
              })()}
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

            {/* Quick Metrics Bar / Trade Ledger Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#262522]">
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">Director</span>
                <span className="text-xs font-semibold text-[#F4F0EA] truncate block">{movie.director}</span>
              </div>
              <div className="bg-[#181816] p-2.5 rounded-[4px] border border-[#262522]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block tracking-wider">Worldwide Gross</span>
                <span className="text-xs font-mono font-semibold tabular-nums text-[#D9C39A]">
                  {isUpcoming
                    ? <span className="text-sky-400">Unreleased</span>
                    : formatRegionCurrency(
                        movie.financials?.worldwideGross || movie.financials?.worldwideGrossRaw, 
                        activeRegion, 
                        { nativeInrCrores: movie.financials?.grossInrCrores, compact: true }
                      )
                  }
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
                  {isUpcoming ? (
                    <span className="text-sky-400 text-[10px]">Unreleased</span>
                  ) : (
                    <>
                      <Star className="w-3 h-3 fill-[#D9C39A] text-[#D9C39A]" />
                      <span>{movie.ratings?.imdb?.score || 'N/A'} / 10</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Genre & Curator Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {movie.genres?.map((genre, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase bg-[#181816] text-[#8C877E] border border-[#262522]">
                  {genre}
                </span>
              ))}
              {movie.aiTags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/20 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#E03C31]" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Trailer & Watchlist Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {movie.youtubeTrailerId && (
                <button
                  onClick={() => onPlayTrailer(movie)}
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
                title={!user ? "Sign in to save movies to your cloud watchlist" : isWatchlisted ? "Saved in Watchlist" : "Save to Watchlist"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#D9C39A] text-[#D9C39A]' : 'text-[#8C877E]'}`} />
                <span>{isWatchlisted ? 'Archived to Vault' : 'Add to Ledger Vault'}</span>
                {user && (
                  <Cloud className="w-3 h-3 text-[#D9C39A] opacity-80" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Module Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#262522] overflow-x-auto pb-px">
        {[
          { id: 'financials', label: 'Financial Ledger', icon: DollarSign },
          { id: 'streaming', label: 'Exhibition & OTT', icon: Tv },
          { id: 'global', label: 'Territories & Censors', icon: Globe },
          { id: 'reviews', label: 'Critical Consensus', icon: Award },
          { id: 'cast', label: 'Personnel & Auteurs', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-t-[4px] border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#F4F0EA] border-[#E03C31] bg-[#121210]'
                  : 'text-[#8C877E] hover:text-[#F4F0EA] border-transparent hover:bg-[#121210]/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E03C31]' : 'text-[#8C877E]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'financials' && (
          <div className="animate-fade-in">
            <FinancialsHub 
              financials={movie.financials} 
              movieTitle={movie.title} 
              currentCountry={activeRegion}
              isUpcoming={isUpcoming}
              releaseDate={movie.releaseDate}
              tmdbStatus={movie.tmdbStatus}
            />
          </div>
        )}

        {activeTab === 'streaming' && (
          <div className="animate-fade-in">
            <StreamingTicketing
              streamingData={movie.streamingByCountry}
              premiereDate={movie.premiereDate}
              releaseDate={movie.releaseDate}
              currentCountry={currentCountry}
              onCountryChange={onCountryChange}
              tmdbId={movie.tmdbId || movie.id}
              movieTitle={movie.title}
              apiKey={apiKey}
            />
          </div>
        )}

        {activeTab === 'global' && (
          <div className="animate-fade-in">
            <GlobalContextSection globalContext={movie.globalContext} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <ReviewAggregator 
              ratings={movie.ratings} 
              movieId={movie.id} 
              movieTitle={movie.title} 
            />
          </div>
        )}

        {activeTab === 'cast' && (
          <div className="space-y-6 animate-fade-in">
            {/* Cast Grid */}
            <div className="rounded-[4px] p-6 border border-[#262522] bg-[#121210] space-y-4">
              {(() => {
                const matchedMock = MOCK_MOVIES.find(m => 
                  m.id === movie.id || 
                  String(m.tmdbId) === String(movie.tmdbId) || 
                  (m.title && movie.title && m.title.toLowerCase() === movie.title.toLowerCase())
                );
                const displayCast = (movie.cast && movie.cast.length > 0)
                  ? movie.cast
                  : (matchedMock?.cast && matchedMock.cast.length > 0)
                    ? matchedMock.cast
                    : [
                        { name: movie.director ? `${movie.director} Ensemble` : 'Lead Cast', character: 'Principal Cast' },
                        { name: 'Featured Performers', character: 'Theatrical Ensemble' }
                      ];

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-[#262522] pb-3">
                      <h3 className="text-lg font-serif text-[#F4F0EA]">Principal Cast & Characters</h3>
                      <span className="font-mono text-[11px] text-[#8C877E]">{displayCast.length} ENSEMBLE ROLES</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {displayCast.map((actor, idx) => (
                        <div key={idx} className="p-3 rounded-[4px] bg-[#181816] border border-[#262522] hover:border-[#8C877E] transition-all flex items-start gap-3">
                          <div className="w-8 h-8 rounded-[2px] bg-[#262522] text-[#D9C39A] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {actor.name ? actor.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'EN'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-medium text-[#F4F0EA] truncate">{actor.name}</h4>
                            <p className="text-[11px] font-mono text-[#8C877E] truncate mt-0.5">as {actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Director & Production Houses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[4px] p-6 border border-[#262522] bg-[#121210] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Direction & Vision</span>
                <div className="flex items-start gap-3.5 p-4 rounded-[4px] bg-[#181816] border border-[#262522]">
                  <div className="w-9 h-9 rounded-[2px] bg-[#262522] border border-[#262522] flex items-center justify-center text-lg shrink-0">
                    🎬
                  </div>
                  <div>
                    <h4 className="text-sm font-serif text-[#F4F0EA]">{movie.director || 'Director Unavailable'}</h4>
                    <span className="inline-block text-[10px] font-mono uppercase text-[#D9C39A] mt-0.5">Auteur / Director</span>
                    <p className="text-xs text-[#8C877E] mt-1.5 leading-relaxed">{movie.directorBio || 'Visionary auteur director.'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[4px] p-6 border border-[#262522] bg-[#121210] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Production Houses</span>
                {movie.productionCompanies && movie.productionCompanies.length > 0 ? (
                  <div className="space-y-2">
                    {movie.productionCompanies.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-[4px] bg-[#181816] border border-[#262522]">
                        <span className="text-base">{prod.logo || '📽️'}</span>
                        <span className="text-xs font-mono text-[#F4F0EA]">{prod.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-[#8C877E]">Independent Studio / Production Ledger Undisclosed</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* "More Like This" Recommendations */}
      {similarMovies.length > 0 && (
        <div className="pt-8 space-y-4 border-t border-[#262522]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-[#F4F0EA] flex items-center gap-2">
              <Film className="w-5 h-5 text-[#E03C31]" />
              Related Cinema & Affinities
            </h3>
            <span className="text-xs font-mono text-[#8C877E]">CURATED TONAL AFFINITIES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarMovies.slice(0, 4).map(sim => (
              <MovieCard
                key={sim.id}
                movie={sim}
                onSelectMovie={onSelectMovie}
                isWatchlisted={watchlist.some(w => w.id === sim.id)}
                onToggleWatchlist={onToggleWatchlist}
                onPlayTrailer={onPlayTrailer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

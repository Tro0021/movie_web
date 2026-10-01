import React, { useState } from 'react';
import { 
  ArrowLeft, Play, Bookmark, Star, 
  DollarSign, Tv, Globe, Share2, 
  Sparkles, Check, Cloud, Award, Users, Film, Calendar
} from 'lucide-react';
import FinancialsHub from '../components/FinancialsHub';
import StreamingTicketing from '../components/StreamingTicketing';
import GlobalContextSection from '../components/GlobalContextModal';
import ReviewAggregator from '../components/ReviewAggregator';
import MovieCard from '../components/MovieCard';
import { formatCurrency } from '../services/financialUtils';
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
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
  };


  const currentMovieId = String(movie.tmdbId || movie.id);
  const isWatchlisted = watchlist.some(m => 
    String(m.id) === currentMovieId || 
    String(m.tmdbId) === currentMovieId ||
    String(m.id) === String(movie.id)
  );

  // If unauthenticated, trigger auth modal; otherwise toggle watchlist in Supabase
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

  // Find similar movies safely
  const similarMovies = (allMovies || []).filter(
    m => m && m.id !== movie.id && (
      movie.similarMovieIds?.includes(m.id) ||
      m.genres?.some(g => movie.genres?.includes(g)) ||
      (m.director && m.director === movie.director)
    )
  );

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Film Vault</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isWatchlisted
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={!user ? "Sign in to save movies to your cloud watchlist" : isWatchlisted ? "In Watchlist" : "Save to Watchlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-black' : ''}`} />
            <span>{isWatchlisted ? 'In Watchlist' : 'Save to Watchlist'}</span>
            {user && (
              <Cloud className="w-3 h-3 text-emerald-400 opacity-80" />
            )}
          </button>
        </div>
      </div>

      {/* Cinematic Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-card bg-[#090d18] shadow-2xl">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-96 sm:h-[450px] bg-[#090d18]">
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
            className="w-full h-full object-cover object-center filter brightness-50 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-[#090d18]/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 pt-32 sm:pt-48 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Column */}
          <div className="w-44 sm:w-56 md:w-64 flex-shrink-0 mx-auto md:mx-0 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/20 relative group bg-slate-900">
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
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-glow-crimson group-hover:scale-110 transition-transform"
                title="Play Trailer"
              >
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              </button>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Verdict / Status Badge */}
              {isUpcoming ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {movie.tmdbStatus === 'In Production' ? 'In Production'
                    : movie.tmdbStatus === 'Post Production' ? 'Post Production'
                    : movie.tmdbStatus === 'Planned' ? 'Planned'
                    : 'Upcoming'}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {movie.financials?.verdict || 'Featured'}
                </span>
              )}
              {isUpcoming && movie.releaseDate && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-400/10 text-sky-200 border border-sky-400/25 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Releases: {formatReleaseDate(movie.releaseDate)}
                </span>
              )}
              {!isUpcoming && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  Premiere: {movie.premiereDate || movie.releaseDate}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/10">
                Release Date: {movie.releaseDate || 'TBA'}
              </span>
              <span className="text-xs text-slate-300">
                {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : isUpcoming ? 'Runtime: TBA' : 'Runtime N/A'}
              </span>
              {(() => {
                // Certification badge: TBA for upcoming, otherwise real cert
                const badgeCert = isUpcoming ? 'TBA'
                  : (movie.primaryCertification || 
                     movie.certification || 
                     movie.globalContext?.primaryCertification || 
                     movie.globalContext?.certifications?.[0]?.rating || 
                     'Not Rated');
                const badgeClass = isUpcoming
                  ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                  : 'bg-white/10 text-white border-white/10';
                return (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border tracking-wide ${badgeClass}`}>
                    {badgeCert}
                  </span>
                );
              })()}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base italic text-amber-200/90 font-medium">
                "{movie.tagline}"
              </p>
            )}

            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {movie.synopsis}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Director</span>
                <span className="text-sm font-bold text-white">{movie.director}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Worldwide Gross</span>
                <span className="text-sm font-bold text-emerald-400 font-heading">
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
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Budget</span>
                <span className="text-sm font-bold text-slate-200 font-heading">
                  {formatRegionCurrency(
                    movie.financials?.budget || movie.financials?.budgetRaw, 
                    activeRegion, 
                    { nativeInrCrores: movie.financials?.budgetInrCrores, compact: true }
                  )}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">IMDb Rating</span>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                  {isUpcoming ? (
                    <span className="text-sky-400 font-semibold text-xs">Unreleased</span>
                  ) : (
                    <>
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{movie.ratings?.imdb?.score || 'N/A'} / 10</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Genre & Curator Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {movie.genres?.map((genre, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  {genre}
                </span>
              ))}
              {movie.aiTags?.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-200/90 border border-amber-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Trailer & Watchlist Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {movie.youtubeTrailerId && (
                <button
                  onClick={() => onPlayTrailer(movie)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-black/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={handleWatchlistClick}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  isWatchlisted
                    ? 'bg-amber-400 text-black shadow-lg shadow-black/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
                title={!user ? "Sign in to save movies to your cloud watchlist" : isWatchlisted ? "Saved in Watchlist" : "Save to Watchlist"}
              >
                <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-black' : ''}`} />
                <span>{isWatchlisted ? 'Saved in Watchlist' : 'Save to Watchlist'}</span>
                {user && (
                  <Cloud className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Module Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-white/10 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'financials'
              ? 'text-amber-300 border-b-2 border-amber-400 bg-white/[0.04]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financials Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('streaming')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'streaming'
              ? 'text-amber-300 border-b-2 border-amber-400 bg-white/[0.04]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Streaming & Theaters</span>
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'global'
              ? 'text-amber-300 border-b-2 border-amber-400 bg-white/[0.04]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Global Certifications</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews'
              ? 'text-amber-300 border-b-2 border-amber-400 bg-white/[0.04]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Critical Consensus</span>
        </button>

        <button
          onClick={() => setActiveTab('cast')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'cast'
              ? 'text-amber-300 border-b-2 border-amber-400 bg-white/[0.04]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Cast & Production</span>
        </button>
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
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
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
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-heading">Key Cast & Characters</h3>
                        <span className="text-xs text-slate-400 font-medium">{displayCast.length} Actors Listed</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                        {displayCast.map((actor, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/20 transition-all flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                              {actor.name ? actor.name.split(' ').map(n => n[0]).slice(0, 2).join('') : '🎭'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-bold text-white truncate">{actor.name}</h4>
                              <p className="text-xs text-amber-400 font-medium truncate mt-0.5">as {actor.character}</p>
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
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Direction & Vision</span>
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                    🎬
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{movie.director || 'Director Unavailable'}</h4>
                    <span className="inline-block text-[11px] font-semibold text-amber-400 mt-0.5">Director</span>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{movie.directorBio || 'Visionary auteur director.'}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Production Companies</span>
                {movie.productionCompanies && movie.productionCompanies.length > 0 ? (
                  <div className="space-y-2">
                    {movie.productionCompanies.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                        <span className="text-xl">{prod.logo || '🎬'}</span>
                        <span className="text-xs font-bold text-white">{prod.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Independent Studio / Production Not Disclosed</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* "More Like This" Algorithmic Recommendations */}
      {similarMovies.length > 0 && (
        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              Related Cinema & Works
            </h3>
            <span className="text-xs text-slate-400">Curated tonal & directorial affinities</span>
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

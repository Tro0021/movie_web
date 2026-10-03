import React from 'react';
import { Bookmark, Star, Play } from 'lucide-react';
import { formatCurrency } from '../services/financialUtils';
import { resolveMoviePoster } from '../services/mediaResolver';
import { useRegion } from '../context/RegionContext';

export default function MovieCard({ 
  movie, 
  onSelectMovie, 
  isWatchlisted, 
  onToggleWatchlist, 
  onPlayTrailer 
}) {
  const { selectedRegion } = useRegion();

  const grossAmount = (
    movie.financials?.worldwideGross ||
    movie.financials?.worldwideGrossRaw ||
    movie.worldwideGross ||
    movie.revenue ||
    movie.financials?.grossInrCrores ||
    movie.grossInrCrores
  );

  const nativeCrores = movie.financials?.grossInrCrores ?? movie.grossInrCrores;

  return (
    <div 
      onClick={() => onSelectMovie(movie)}
      className="group relative rounded-[4px] overflow-hidden bg-[#121210] border border-[#262522] hover:border-[#D9C39A]/40 cursor-pointer flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/80"
    >
      {/* Poster Image Container with crisp cinema framing */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#181816]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
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
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 border border-white/[0.12]"
        />

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121210] via-transparent to-black/50 opacity-75 group-hover:opacity-50 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
          {movie.financials?.verdict ? (
            <span className="font-mono text-[10px] uppercase tracking-wider bg-black/80 text-[#D9C39A] border border-[#D9C39A]/30 px-2 py-0.5 rounded-[2px] backdrop-blur-sm">
              {movie.financials.verdict}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider bg-black/80 text-[#8C877E] border border-white/10 px-2 py-0.5 rounded-[2px] backdrop-blur-sm">
              Archived
            </span>
          )}

          {/* Understated Dark Glass Bookmark Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            className={`pointer-events-auto p-1.5 rounded-[3px] border backdrop-blur-md transition-colors cursor-pointer ${
              isWatchlisted
                ? 'bg-[#E03C31] border-[#E03C31] text-white shadow'
                : 'bg-black/75 border-white/15 text-[#F4F0EA] hover:bg-[#E03C31] hover:border-[#E03C31]'
            }`}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Trailer Play Button */}
        {movie.youtubeTrailerId && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-11 h-11 rounded-[3px] bg-[#121210]/90 border border-white/20 hover:bg-[#E03C31] hover:border-[#E03C31] text-[#F4F0EA] flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-xl pointer-events-auto cursor-pointer"
            title="Watch Official Trailer"
          >
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          </button>
        )}
      </div>

      {/* Editorial Ledger Bar Below Poster */}
      <div className="p-3 bg-[#121210] flex-1 flex flex-col justify-between space-y-1.5 border-t border-[#262522]">
        {/* Top Row: Title + Box Office Gross */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-medium text-[#F4F0EA] group-hover:text-[#D9C39A] transition-colors truncate">
            {movie.title}
          </h3>
          {Boolean(grossAmount) && (
            <span className="font-mono text-[11px] sm:text-xs font-medium text-[#D9C39A] flex-shrink-0 tabular-nums">
              {formatCurrency(
                grossAmount, 
                selectedRegion, 
                { nativeInrCrores: nativeCrores, compact: true }
              )}
            </span>
          )}
        </div>

        {/* Bottom Row: Director + Year · Runtime · ★ Rating */}
        <div className="flex items-center justify-between text-[11px] text-[#8C877E] pt-0.5">
          <span className="truncate max-w-[50%] text-[#8C877E]">
            {movie.director || 'Director Unavailable'}
          </span>
          <div className="font-mono text-[11px] text-[#8C877E] flex items-center gap-1.5 flex-shrink-0 tabular-nums">
            <span>{movie.releaseDate?.slice(0, 4) || 'N/A'}</span>
            <span>·</span>
            <span>{movie.runtimeMinutes ? `${movie.runtimeMinutes}m` : 'N/A'}</span>
            {movie.ratings?.imdb?.score && (
              <>
                <span>·</span>
                <span className="text-[#D9C39A] font-medium">★ {movie.ratings.imdb.score}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

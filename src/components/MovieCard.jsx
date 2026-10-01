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
  return (
    <div 
      onClick={() => onSelectMovie(movie)}
      className="group relative rounded-2xl overflow-hidden bg-[#121622] border border-white/[0.08] hover:border-amber-400/35 cursor-pointer flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
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
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {movie.financials?.verdict ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/25">
              {movie.financials.verdict}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
              Featured
            </span>
          )}

          {/* Watchlist Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              isWatchlisted
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
            }`}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-black' : ''}`} />
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
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-black/80 pointer-events-auto cursor-pointer"
            title="Watch Official Trailer"
          >
            <Play className="w-5 h-5 ml-0.5 fill-black" />
          </button>
        )}

        {/* Bottom Poster Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{movie.ratings?.imdb?.score || 'N/A'}</span>
          </div>

          {Boolean(
            movie.financials?.worldwideGross ||
            movie.financials?.worldwideGrossRaw ||
            movie.financials?.grossInrCrores ||
            movie.worldwideGross ||
            movie.revenue ||
            movie.grossInrCrores
          ) && (
            <div className="text-[11px] font-semibold text-emerald-300 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-emerald-500/20">
              {formatCurrency(
                movie.financials?.worldwideGross ||
                movie.worldwideGross ||
                movie.revenue ||
                movie.financials?.worldwideGrossRaw, 
                selectedRegion, 
                { 
                  nativeInrCrores: movie.financials?.grossInrCrores ?? movie.grossInrCrores, 
                  compact: true 
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{movie.releaseDate?.slice(0, 4) || 'N/A'}</span>
            <span>{movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : 'N/A'}</span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-heading">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{movie.director || 'Director Unavailable'}</p>
        </div>

        {/* Genres Pill Row */}
        <div className="flex flex-wrap gap-1 pt-1">
          {movie.genres?.slice(0, 2).map((g, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

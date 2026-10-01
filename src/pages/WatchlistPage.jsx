import React, { useState } from 'react';
import { 
  Bookmark, ArrowRight, Tv, 
  LogIn, Cloud, Loader2, Sparkles 
} from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function WatchlistPage({ 
  watchlist = [], 
  onSelectMovie, 
  onToggleWatchlist, 
  onPlayTrailer, 
  onNavigateHome,
  currentCountry,
  user,
  onOpenAuth,
  isLoadingWatchlist
}) {
  const [filterStreamingOnly, setFilterStreamingOnly] = useState(false);

  const displayedMovies = filterStreamingOnly 
    ? watchlist.filter(m => {
        const countryStream = m.streamingByCountry?.[currentCountry] || m.streamingByCountry?.['US'];
        return countryStream?.flatrate && countryStream.flatrate.length > 0;
      })
    : watchlist;

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
              <Bookmark className="w-8 h-8 text-amber-400 fill-amber-400" />
              Your Watchlist ({watchlist.length})
            </h1>
            {user ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cloud className="w-3 h-3" /> Cloud Synced
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-slate-400 border border-white/10">
                Local Device Vault
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {user 
              ? `Connected to ${user.email} — accessible across all your devices`
              : 'Save films you admire. Sign in to sync your archive across devices.'}
          </p>
        </div>

        {/* Filter & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {!user && (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Sync</span>
            </button>
          )}

          {watchlist.length > 0 && (
            <button
              onClick={() => setFilterStreamingOnly(!filterStreamingOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterStreamingOnly
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-[#121622] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Streaming Now ({currentCountry})</span>
            </button>
          )}
        </div>
      </div>

      {/* Cloud Account Callout Card */}
      {!user && (
        <div className="rounded-2xl p-5 bg-[#121622] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sync Watchlist Across Devices</h4>
              <p className="text-xs text-slate-400">Sign in with email to save your personal film collection permanently in your Kinova account.</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingWatchlist && (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="text-xs font-medium">Syncing with cloud library...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingWatchlist && watchlist.length === 0 && (
        <div className="bg-[#121622] rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore our curated catalog or use Curator mode to discover and save movies to your personal library.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Films</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Saved Movies */}
      {!isLoadingWatchlist && watchlist.length > 0 && (
        displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                isWatchlisted={true}
                onToggleWatchlist={onToggleWatchlist}
                onPlayTrailer={onPlayTrailer}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#121622] rounded-3xl p-10 text-center max-w-md mx-auto space-y-3 border border-white/10 shadow-2xl">
            <Tv className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white font-heading">No Saved Films Streaming in {currentCountry}</h4>
            <p className="text-xs text-slate-400">
              None of your watchlisted films are currently streaming on subscription services in this region. You can check digital rental or purchase options in film details.
            </p>
            <button
              onClick={() => setFilterStreamingOnly(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Show All Saved Films
            </button>
          </div>
        )
      )}
    </div>
  );
}

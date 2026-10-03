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
    <div className="space-y-8 pb-20 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262522] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#F4F0EA] flex items-center gap-3">
              <Bookmark className="w-7 h-7 text-[#E03C31] fill-[#E03C31]" />
              Personal Archive & Watchlist
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#262522] tabular-nums">
              {watchlist.length} TITLES
            </span>
            {user ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase bg-[#181816] text-emerald-400 border border-emerald-500/20">
                <Cloud className="w-3 h-3" /> Cloud Synced
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase bg-[#181816] text-[#8C877E] border border-[#262522]">
                Local Ledger
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#8C877E] mt-1.5 font-sans">
            {user 
              ? `Ledger linked to ${user.email} — continuous cloud sync across exhibition terminals`
              : 'Archived cinema collection. Authenticate to sync your ledger across archival terminals.'}
          </p>
        </div>

        {/* Filter & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {!user && (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Sync</span>
            </button>
          )}

          {watchlist.length > 0 && (
            <button
              onClick={() => setFilterStreamingOnly(!filterStreamingOnly)}
              className={`px-3.5 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                filterStreamingOnly
                  ? 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40'
                  : 'bg-[#121210] hover:bg-[#181816] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522]'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Streaming ({currentCountry})</span>
            </button>
          )}
        </div>
      </div>

      {/* Cloud Account Callout Card */}
      {!user && (
        <div className="rounded-[4px] p-5 bg-[#121210] border border-[#262522] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#262522] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#E03C31]" />
            </div>
            <div>
              <h4 className="text-sm font-serif text-[#F4F0EA]">Sync Your Film Archive Across Devices</h4>
              <p className="text-xs text-[#8C877E]">Authenticate with your email to preserve your trade logs, custom ratings, and curated vault permanently.</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-[4px] bg-[#181816] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] hover:border-[#8C877E] text-xs font-mono uppercase tracking-wider font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            Authenticate Account
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingWatchlist && (
        <div className="py-12 text-center text-[#8C877E] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#D9C39A] animate-spin" />
          <span className="text-xs font-mono uppercase tracking-wider">Syncing with archival repository...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingWatchlist && watchlist.length === 0 && (
        <div className="bg-[#121210] rounded-[4px] p-12 text-center max-w-md mx-auto space-y-4 border border-[#262522] shadow-2xl">
          <div className="w-14 h-14 rounded-[2px] bg-[#181816] text-[#8C877E] border border-[#262522] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6 text-[#E03C31]" />
          </div>
          <h3 className="text-2xl font-serif text-[#F4F0EA]">Ledger Archive is Empty</h3>
          <p className="text-xs text-[#8C877E] leading-relaxed">
            Examine our historical box office index or consult the Curatorial Intelligence engine to log films to your personal archive.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Explore Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="bg-[#121210] rounded-[4px] p-10 text-center max-w-md mx-auto space-y-3 border border-[#262522] shadow-2xl">
            <Tv className="w-8 h-8 text-[#D9C39A] mx-auto" />
            <h4 className="text-xl font-serif text-[#F4F0EA]">No Archived Films Streaming in {currentCountry}</h4>
            <p className="text-xs text-[#8C877E]">
              None of your saved titles are currently distributed on flatrate subscription platforms in this territory. Check digital rental/purchase ledgers in film details.
            </p>
            <button
              onClick={() => setFilterStreamingOnly(false)}
              className="px-4 py-2 rounded-[4px] bg-[#181816] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              Display All Archived Titles
            </button>
          </div>
        )
      )}
    </div>
  );
}

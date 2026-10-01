import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Search, Bookmark, X, Loader2, User, SlidersHorizontal, Check, Globe 
} from 'lucide-react';
import { COUNTRY_OPTIONS } from '../data/mockMovies';
import { searchMovies } from '../services/movieApi';
import { useRegion } from '../context/RegionContext';
import { EXCHANGE_RATES } from '../utils/currencyFormatter';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onSelectMovie, 
  movies, 
  watchlistCount, 
  currentCountry, 
  onCountryChange,
  onOpenSidebar,
  user,
  onOpenAuth,
  apiKeys
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const regionMenuRef = useRef(null);

  const { setSelectedRegion } = useRegion();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMovies(searchQuery, apiKeys?.tmdb);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, movies, apiKeys?.tmdb]);

  // Click outside to close search and region dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (regionMenuRef.current && !regionMenuRef.current.contains(e.target)) {
        setIsRegionMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCountryObj = COUNTRY_OPTIONS.find(c => c.code === currentCountry) || COUNTRY_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0d14]/92 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Kinova Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-105 transition-transform text-black">
              <Film className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider text-white">
                  KINOVA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block tracking-wide">Cinema Archive & Box Office Intelligence</p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative flex-1 max-w-lg hidden md:block" ref={searchRef}>
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              )}
              <input
                type="text"
                placeholder={apiKeys?.tmdb ? "Search global TMDB catalog or film title..." : "Search films, directors, or blockbusters..."}
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#121622] border border-white/10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121622] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2.5 border-b border-white/5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Results ({searchResults.length})</span>
                  {apiKeys?.tmdb && <span className="text-amber-400 text-[10px]">Live Catalog</span>}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {searchResults.map(movie => (
                    <div
                      key={movie.id || movie.tmdbId}
                      onClick={() => {
                        onSelectMovie(movie);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-10 h-14 object-cover rounded shadow-md flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-semibold text-white truncate">{movie.title}</h4>
                          {/* Upcoming badge — visually distinguishes unreleased from released same-name movies */}
                          {movie.isUpcoming && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider flex-shrink-0">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          {/* Year */}
                          {movie.releaseYear && (
                            <span className="font-semibold text-slate-300">{movie.releaseYear}</span>
                          )}
                          {/* Language badge for non-English films */}
                          {movie.languageLabel && movie.languageLabel !== 'EN' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                              {movie.languageLabel}
                            </span>
                          )}
                          {movie.director ? `• ${movie.director}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {movie.ratings?.imdb?.score && movie.ratings.imdb.score !== 'N/A' ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                              ★ {movie.ratings.imdb.score} IMDb
                            </span>
                          ) : movie.ratings?.tmdb?.score ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">
                              ★ {movie.ratings.tmdb.score} TMDB
                            </span>
                          ) : null}
                          {movie.genres?.length > 0 && (
                            <span className="text-[10px] text-slate-400 truncate">
                              {movie.genres.slice(0, 2).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Cluster: Uncluttered & Direct */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Regional Pill Button & Dropdown */}
            <div className="relative" ref={regionMenuRef}>
              <button
                onClick={() => setIsRegionMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#181f30] border border-white/10 hover:border-amber-400/40 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
                title={`Active region & currency: ${activeCountryObj.name}. Click to switch.`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-amber-300">
                  {activeCountryObj.code} ({(EXCHANGE_RATES[activeCountryObj.code] || EXCHANGE_RATES.US).symbol})
                </span>
              </button>

              {isRegionMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f1422] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-amber-400" />
                      Territory & Currency
                    </span>
                    <span className="text-amber-400 font-mono text-[9px]">LIVE RATES</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                    {COUNTRY_OPTIONS.map(c => {
                      const curr = EXCHANGE_RATES[c.code] || EXCHANGE_RATES.US;
                      const isSelected = (currentCountry || 'IN') === c.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            if (onCountryChange) onCountryChange(c.code);
                            setSelectedRegion(c.code);
                            setIsRegionMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                            isSelected 
                              ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30' 
                              : 'text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-amber-300 border border-white/10">
                              {c.code}
                            </span>
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-300 flex-shrink-0 ml-2">
                            {curr.symbol} {curr.currency}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Watchlist Quick Button */}
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`p-2 rounded-xl text-slate-300 hover:text-white transition-colors relative cursor-pointer ${
                activeTab === 'watchlist' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'hover:bg-white/5'
              }`}
              title={`Watchlist (${watchlistCount} items)`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black shadow">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={onOpenAuth}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
              title={user ? `Signed in as ${user.email}` : "Sign In to Kinova"}
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {user ? user.email.split('@')[0] : 'Sign In'}
              </span>
            </button>

            {/* Sidebar Drawer Trigger (Arrow/Hub Bar Button) */}
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-lg shadow-black/40 transition-all cursor-pointer select-none"
              title="Open Navigation Drawer & Tools"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline font-extrabold uppercase tracking-wider text-[11px]">Hub</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

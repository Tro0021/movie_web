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
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#262522] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Kinova Bespoke 35mm Film-Gate Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-[4px] bg-[#121210] border border-[#262522] flex items-center justify-center group-hover:border-[#E03C31]/60 transition-colors shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#F4F0EA]">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="7.5" x2="21" y2="7.5" stroke="#262522" strokeWidth="1" />
                <line x1="3" y1="16.5" x2="21" y2="16.5" stroke="#262522" strokeWidth="1" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
                <circle cx="15.5" cy="8.5" r="1.1" fill="#E03C31" />
              </svg>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="tracking-[0.22em] font-semibold text-[#F4F0EA] text-base sm:text-lg">
                KINOVA
              </span>
              <div className="h-3.5 w-px bg-[#262522] hidden sm:block" />
              <span className="font-mono text-[10px] text-[#8C877E] tracking-widest hidden sm:block uppercase">
                ARCHIVE & BOX OFFICE
              </span>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative flex-1 max-w-lg hidden md:block" ref={searchRef}>
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9C39A] animate-spin" />
              ) : (
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C877E]" />
              )}
              <input
                type="text"
                placeholder={apiKeys?.tmdb ? "Search global TMDB catalog or film title..." : "Search films, directors, or box office records..."}
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-[4px] bg-[#121210] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31]/70 focus:ring-1 focus:ring-[#E03C31]/40 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C877E] hover:text-[#F4F0EA]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121210] border border-[#262522] rounded-[4px] shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2.5 border-b border-[#262522] text-[10px] font-mono uppercase tracking-wider text-[#8C877E] flex items-center justify-between">
                  <span>Results ({searchResults.length})</span>
                  {apiKeys?.tmdb && <span className="text-[#D9C39A]">Live TMDB Catalog</span>}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#262522]">
                  {searchResults.map(movie => (
                    <div
                      key={movie.id || movie.tmdbId}
                      onClick={() => {
                        onSelectMovie(movie);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-[#181816] cursor-pointer transition-colors"
                    >
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-10 h-14 object-cover rounded-[2px] border border-white/10 shadow-sm flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-medium text-[#F4F0EA] truncate">{movie.title}</h4>
                          {movie.isUpcoming && (
                            <span className="px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] uppercase tracking-wider bg-[#181816] text-[#709CA8] border border-[#709CA8]/30 flex-shrink-0">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8C877E] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          {movie.releaseYear && (
                            <span className="font-mono text-[#F4F0EA]">{movie.releaseYear}</span>
                          )}
                          {movie.languageLabel && movie.languageLabel !== 'EN' && (
                            <span className="px-1.5 py-0.2 rounded-[2px] font-mono text-[9px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/20">
                              {movie.languageLabel}
                            </span>
                          )}
                          {movie.director ? `• ${movie.director}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {movie.ratings?.imdb?.score && movie.ratings.imdb.score !== 'N/A' ? (
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/25">
                              ★ {movie.ratings.imdb.score} IMDb
                            </span>
                          ) : movie.ratings?.tmdb?.score ? (
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] bg-[#181816] text-[#709CA8] border border-[#709CA8]/25">
                              ★ {movie.ratings.tmdb.score} TMDB
                            </span>
                          ) : null}
                          {movie.genres?.length > 0 && (
                            <span className="text-[10px] text-[#8C877E] truncate font-sans">
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

          {/* Right Action Cluster: Architectural Rectangular Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Regional Button & Dropdown */}
            <div className="relative" ref={regionMenuRef}>
              <button
                onClick={() => setIsRegionMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#1A1917] border border-[#262522] hover:border-[#D9C39A]/40 text-xs font-mono text-[#F4F0EA] transition-all cursor-pointer shadow-sm"
                title={`Active region & currency: ${activeCountryObj.name}. Click to switch.`}
              >
                <Globe className="w-3.5 h-3.5 text-[#8C877E] flex-shrink-0" />
                <span className="text-[11px] font-mono text-[#D9C39A]">
                  {activeCountryObj.code} ({(EXCHANGE_RATES[activeCountryObj.code] || EXCHANGE_RATES.US).symbol})
                </span>
              </button>

              {isRegionMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-[4px] bg-[#121210] border border-[#262522] shadow-2xl p-2 z-50 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#262522] text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#D9C39A]" />
                      Territory & Currency
                    </span>
                    <span className="text-[#D9C39A] font-mono text-[9px]">LIVE RATES</span>
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-sans transition-colors cursor-pointer text-left ${
                            isSelected 
                              ? 'bg-[#181816] text-[#D9C39A] font-medium border border-[#D9C39A]/30' 
                              : 'text-[#F4F0EA] hover:bg-[#181816]'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono font-medium bg-[#181816] text-[#D9C39A] border border-[#262522]">
                              {c.code}
                            </span>
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="text-[11px] font-mono text-[#8C877E] flex-shrink-0 ml-2">
                            {curr.symbol} {curr.currency}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Watchlist Button */}
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`p-2 rounded-[4px] border transition-colors relative cursor-pointer ${
                activeTab === 'watchlist' 
                  ? 'bg-[#181816] text-[#E03C31] border-[#E03C31]/50' 
                  : 'bg-[#121210] hover:bg-[#1A1917] border-[#262522] text-[#8C877E] hover:text-[#F4F0EA]'
              }`}
              title={`Watchlist (${watchlistCount} items)`}
            >
              <Bookmark className={`w-4 h-4 ${activeTab === 'watchlist' ? 'text-[#E03C31]' : 'text-[#8C877E]'}`} />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-[2px] bg-[#E03C31] text-white text-[9px] font-mono font-semibold">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={onOpenAuth}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono transition-all cursor-pointer ${
                user
                  ? 'bg-[#121210] hover:bg-[#1A1917] text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#121210] hover:bg-[#1A1917] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522]'
              }`}
              title={user ? `Signed in as ${user.email}` : "Sign In to Kinova"}
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {user ? user.email.split('@')[0] : 'Sign In'}
              </span>
            </button>

            {/* Sidebar Drawer Trigger */}
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#1A1917] border border-[#262522] hover:border-[#E03C31]/50 text-[#F4F0EA] text-xs font-mono transition-all cursor-pointer select-none"
              title="Open Navigation Drawer & Tools"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E03C31]" />
              <span className="hidden sm:inline uppercase tracking-widest text-[10px] text-[#8C877E]">Hub</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

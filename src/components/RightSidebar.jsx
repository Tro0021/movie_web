import React from 'react';
import { 
  ChevronLeft, ChevronRight, X, Film, TrendingUp, Sparkles, 
  Bookmark, Globe, User, LogIn, LogOut, Check, 
  RotateCw, Sliders, Tv, SlidersHorizontal
} from 'lucide-react';
import { COUNTRY_OPTIONS } from '../data/mockMovies';

export default function RightSidebar({
  isOpen,
  onToggle,
  onClose,
  activeTab,
  setActiveTab,
  watchlistCount = 0,
  currentCountry = 'US',
  onCountryChange,
  user,
  onOpenAuth,
  onOpenTasteModal,
  tasteProfile,
  onRefreshMovies
}) {
  const activeCountryObj = COUNTRY_OPTIONS.find(c => c.code === currentCountry) || COUNTRY_OPTIONS[0];

  return (
    <>
      {/* 1. Collapsed Floating Arrow Bar Handle (Visible when sidebar is closed) */}
      {!isOpen && (
        <aside 
          aria-label="Sidebar quick access"
          onClick={onToggle}
          className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex items-center group cursor-pointer select-none"
          title="Open Kinova Navigation & Regional Hub"
        >
          <div className="flex items-center gap-1.5 py-4 px-2 rounded-l-2xl bg-[#121622]/90 hover:bg-[#181f30] backdrop-blur-md border-l border-y border-amber-400/30 text-amber-300 shadow-2xl transition-all duration-300 group-hover:-translate-x-1">
            <ChevronLeft className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[12px]">{activeCountryObj.flag}</span>
              <span 
                className="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-amber-300 transition-colors"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                KINOVA HUB
              </span>
              {watchlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-extrabold flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* 2. Backdrop Overlay when open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        />
      )}

      {/* 3. Sliding Drawer Panel (from right) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-[#0e121c]/98 backdrop-blur-2xl border-l border-white/10 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-bold">
              <Film className="w-4 h-4 fill-black text-black" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-heading tracking-wider">
                KINOVA TERMINAL
              </h3>
              <p className="text-[10px] text-slate-400">Navigation, Regions & Taste Profile</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Main Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Navigation
            </span>

            <button
              onClick={() => { setActiveTab('home'); onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>Film Vault & Spotlight</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('boxoffice'); onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'boxoffice'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span>Box Office Leaderboard</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('ai-discovery'); onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ai-discovery'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Curator Recommender</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('watchlist'); onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4" />
                <span>Saved Watchlist</span>
              </div>
              {watchlistCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'watchlist' ? 'bg-black text-amber-400' : 'bg-amber-400 text-black'
                }`}>
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Regional Cinema & Distribution Hub */}
          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Regional Territory
              </span>
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                {activeCountryObj.flag} {activeCountryObj.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {COUNTRY_OPTIONS.map(c => (
                <button
                  key={c.code}
                  onClick={() => onCountryChange(c.code)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all cursor-pointer ${
                    currentCountry === c.code
                      ? 'bg-amber-400/20 text-amber-200 border-amber-400/40 shadow-sm'
                      : 'bg-[#121622] text-slate-300 border-white/5 hover:border-white/15'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{c.flag}</span>
                    <span className="truncate">{c.code}</span>
                  </span>
                  {currentCountry === c.code && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 px-2 leading-relaxed">
              Leading OTTs in {activeCountryObj.name}: <span className="text-slate-300">{activeCountryObj.ottLeading}</span>
            </p>
          </div>

          {/* User Account & Curated Cinema Preferences */}
          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Curated Cinema Preferences
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/10 space-y-3">
              {user ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      <span className="text-[10px] text-emerald-400 font-medium">Cloud Synced Member</span>
                    </div>
                  </div>

                  {tasteProfile ? (
                    <div className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-white/5">
                      <p><strong>Selected Genres:</strong> {tasteProfile.genres?.slice(0, 3).join(', ') || 'Sci-Fi, Thriller'}</p>
                    </div>
                  ) : null}

                  <button
                    onClick={() => { onOpenTasteModal(); onClose(); }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{tasteProfile ? 'Re-Tune Cinema' : 'Curate Cinema Archive'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Create an account to unlock your personalized Curated Archive and sync watchlists across devices.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => { onOpenAuth(); onClose(); }}
                      className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => { onOpenTasteModal(); onClose(); }}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dynamic Actions */}
          <div className="space-y-2 pt-3 border-t border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Quick Actions
            </span>

            <button
              onClick={() => {
                if (onRefreshMovies) onRefreshMovies();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#121622] hover:bg-[#181f30] text-slate-200 border border-white/5 text-xs font-semibold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Shuffle Film Vault (New Titles)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0b0e16] text-[10px] text-slate-500 text-center">
          Kinova Cinema Terminal • Auto-Hiding Taskbar Ready
        </div>
      </aside>
    </>
  );
}

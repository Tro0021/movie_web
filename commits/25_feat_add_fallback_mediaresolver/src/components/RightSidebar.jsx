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
      {/* 1. Collapsed Floating Handle */}
      {!isOpen && (
        <aside 
          aria-label="Sidebar quick access"
          onClick={onToggle}
          className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex items-center group cursor-pointer select-none"
          title="Open Kinova Terminal & Archival Hub"
        >
          <div className="flex items-center gap-1.5 py-3.5 px-2 rounded-l-[4px] bg-[#121210]/95 hover:bg-[#181816] backdrop-blur-md border-l border-y border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] shadow-2xl transition-all duration-200">
            <ChevronLeft className="w-3.5 h-3.5 text-[#E03C31]" />
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#D9C39A]" />
              <span 
                className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#8C877E] group-hover:text-[#F4F0EA] transition-colors"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                KINOVA HUB
              </span>
              {watchlistCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#E03C31] text-white text-[9px] font-mono font-bold flex items-center justify-center">
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
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 animate-fade-in"
        />
      )}

      {/* 3. Sliding Drawer Panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-[#121210] border-l border-[#262522] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out font-sans ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#262522] flex items-center justify-between bg-[#181816]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[2px] bg-[#262522] border border-white/10 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#E03C31]" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-semibold text-[#F4F0EA] tracking-[0.2em] uppercase">
                KINOVA TERMINAL
              </h3>
              <p className="text-[10px] font-mono text-[#8C877E]">NAVIGATION & REGIONAL CONTROL</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1 rounded-[2px] hover:bg-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] px-2 block">
              Ledger Sections
            </span>

            {[
              { id: 'home', label: 'Film Vault & Spotlight', icon: Film },
              { id: 'boxoffice', label: 'Box Office Leaderboard', icon: TrendingUp },
              { id: 'ai-discovery', label: 'Curator Recommender', icon: Sparkles },
              { id: 'watchlist', label: 'Personal Archive', icon: Bookmark, badge: watchlistCount },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => { setActiveTab(nav.id); onClose(); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#181816] text-[#F4F0EA] border border-[#E03C31]'
                      : 'text-[#8C877E] hover:text-[#F4F0EA] hover:bg-[#181816] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E03C31]' : 'text-[#8C877E]'}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono tabular-nums bg-[#181816] text-[#D9C39A] border border-[#262522]">
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Regional Cinema & Distribution Hub */}
          <div className="space-y-2.5 pt-3 border-t border-[#262522]">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E03C31]" />
                Territory
              </span>
              <span className="text-[10px] font-mono text-[#D9C39A]">
                {activeCountryObj.name} ({activeCountryObj.code})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {COUNTRY_OPTIONS.map(c => (
                <button
                  key={c.code}
                  onClick={() => onCountryChange(c.code)}
                  className={`px-2 py-1.5 rounded-[2px] text-xs font-mono text-left flex items-center justify-between border transition-colors cursor-pointer ${
                    currentCountry === c.code
                      ? 'bg-[#181816] text-[#D9C39A] border-[#D9C39A]/40'
                      : 'bg-[#181816]/60 text-[#8C877E] hover:text-[#F4F0EA] border-[#262522] hover:border-[#8C877E]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="px-1 py-0.2 rounded-[2px] text-[9px] font-mono font-semibold bg-[#262522] text-[#D9C39A]">
                      {c.code}
                    </span>
                    <span className="truncate text-xs">{c.name}</span>
                  </span>
                  {currentCountry === c.code && <Check className="w-3 h-3 text-[#E03C31] flex-shrink-0" />}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-[#8C877E] px-1 leading-relaxed">
              Leading OTTs: <span className="text-[#F4F0EA]">{activeCountryObj.ottLeading}</span>
            </p>
          </div>

          {/* User Account & Curated Cinema Preferences */}
          <div className="space-y-2.5 pt-3 border-t border-[#262522]">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#E03C31]" />
                Archival Profile
              </span>
            </div>

            <div className="p-3.5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-2.5">
              {user ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-[2px] bg-[#262522] text-[#D9C39A] font-mono text-xs font-bold flex items-center justify-center">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-[#F4F0EA] truncate">{user.email}</p>
                      <span className="text-[9px] font-mono uppercase text-emerald-400">Authenticated Member</span>
                    </div>
                  </div>

                  {tasteProfile ? (
                    <div className="text-[10px] font-mono text-[#8C877E] pt-2 border-t border-[#262522]">
                      <p>Affinities: {tasteProfile.genres?.slice(0, 3).join(', ') || 'Sci-Fi, Thriller'}</p>
                    </div>
                  ) : null}

                  <button
                    onClick={() => { onOpenTasteModal(); onClose(); }}
                    className="w-full mt-2.5 py-1.5 px-3 rounded-[4px] bg-[#121210] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] hover:border-[#8C877E] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#E03C31]" />
                    <span>{tasteProfile ? 'Re-Tune Affinities' : 'Configure Taste Profile'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-[#8C877E] leading-relaxed">
                    Authenticate to unlock continuous cloud sync for your personal watchlist and custom ratings.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => { onOpenAuth(); onClose(); }}
                      className="py-1.5 px-2.5 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => { onOpenTasteModal(); onClose(); }}
                      className="py-1.5 px-2.5 rounded-[4px] bg-[#121210] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-[#D9C39A]" />
                      <span>Affinities</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dynamic Actions */}
          <div className="space-y-2 pt-3 border-t border-[#262522]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] px-1 block">
              Ledger Actions
            </span>

            <button
              onClick={() => {
                if (onRefreshMovies) onRefreshMovies();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] bg-[#181816] hover:bg-[#20201d] text-[#F4F0EA] border border-[#262522] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-[#E03C31]" />
                <span>Shuffle Archive Titles</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#262522] bg-[#181816] text-[10px] font-mono text-[#8C877E] text-center tracking-wider">
          KINOVA ARCHIVE TERMINAL • V2.4
        </div>
      </aside>
    </>
  );
}

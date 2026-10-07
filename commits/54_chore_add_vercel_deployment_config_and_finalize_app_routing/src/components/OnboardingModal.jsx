import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CINEMA_GENRES, sanitizeGenres } from '../services/genreEngine';

export default function OnboardingModal({ isOpen, onClose, onSaveProfile, initialProfile }) {
  const [selectedGenres, setSelectedGenres] = useState(() =>
    sanitizeGenres(initialProfile?.genres)
  );
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Keep selectedGenres in sync whenever modal opens or initialProfile changes
  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(sanitizeGenres(initialProfile?.genres));
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const toggleGenre = (genreName) => {
    setSelectedGenres(prev => 
      prev.includes(genreName)
        ? prev.filter(g => g !== genreName)
        : [...prev, genreName]
    );
  };

  const selectAll = () => {
    setSelectedGenres(CINEMA_GENRES.map(g => g.name));
  };

  const clearAll = () => {
    setSelectedGenres([]);
  };

  const handleFinish = (e) => {
    e?.preventDefault();
    const profile = {
      genres: selectedGenres,
      createdAt: new Date().toISOString()
    };

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    onSaveProfile(profile);
    onClose();
  };

  const displayedGenres = CINEMA_GENRES.filter(g => {
    if (filterCategory === "MAJOR") return g.category === "Major Genre";
    if (filterCategory === "NOTABLE") return g.category === "Notable Category";
    return true;
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-[#121210] border border-[#262522] rounded-[4px] p-5 sm:p-7 shadow-2xl space-y-5 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between border-b border-[#262522] pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#181816] border border-[#262522] text-[#F4F0EA] flex items-center justify-center flex-shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#F4F0EA] tracking-wide">
                Calibrate Cinema Vault Preferences
              </h3>
              <p className="text-xs text-[#8C877E]">
                Select favored narrative traditions. Your archival vault and ledger metrics will align to these movements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[2px] bg-[#181816] hover:bg-[#262522] border border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters & Selection Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-[2px] bg-[#0A0A09] border border-[#262522] text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => setFilterCategory("ALL")}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer ${
                filterCategory === "ALL"
                  ? "bg-[#181816] text-[#F4F0EA] border border-[#262522]"
                  : "text-[#8C877E] hover:text-[#F4F0EA]"
              }`}
            >
              All Movements ({CINEMA_GENRES.length})
            </button>
            <button
              onClick={() => setFilterCategory("MAJOR")}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer ${
                filterCategory === "MAJOR"
                  ? "bg-[#181816] text-[#F4F0EA] border border-[#262522]"
                  : "text-[#8C877E] hover:text-[#F4F0EA]"
              }`}
            >
              Major (10)
            </button>
            <button
              onClick={() => setFilterCategory("NOTABLE")}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer ${
                filterCategory === "NOTABLE"
                  ? "bg-[#181816] text-[#F4F0EA] border border-[#262522]"
                  : "text-[#8C877E] hover:text-[#F4F0EA]"
              }`}
            >
              Notable (5)
            </button>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={selectAll}
              className="text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer hover:underline"
            >
              SELECT ALL
            </button>
            <span className="text-[#262522]">•</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-[#8C877E] hover:text-[#E03C31] transition-colors cursor-pointer hover:underline"
            >
              CLEAR
            </button>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/20 ml-1">
              {selectedGenres.length} ACTIVE
            </span>
          </div>
        </div>

        {/* Visual Genre Selection Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedGenres.map(genre => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <div
                key={genre.id}
                onClick={() => toggleGenre(genre.name)}
                className={`group relative rounded-[4px] overflow-hidden cursor-pointer border transition-all duration-200 min-h-[140px] flex flex-col justify-end p-4 select-none ${
                  isSelected
                    ? "border-[#E03C31] ring-1 ring-[#E03C31]/40"
                    : "border-[#262522] hover:border-[#D9C39A]/40 bg-[#121210]"
                }`}
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter ${
                      isSelected ? "brightness-[0.4] contrast-110" : "brightness-[0.3] grayscale-[30%]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121210] via-[#121210]/75 to-black/40" />
                </div>

                {/* Top Badge: Selection State & Category */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-auto pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-black/80 text-[#8C877E] border border-white/10">
                    {genre.category}
                  </span>

                  <div className={`w-4 h-4 rounded-[2px] flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-[#E03C31] border-[#E03C31] text-white"
                      : "border-white/20 bg-black/60 text-transparent"
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Genre Title & Key Subgenres */}
                <div className="relative z-10 space-y-0.5">
                  <h4 className={`text-base font-serif transition-colors tracking-wide ${
                    isSelected ? "text-[#D9C39A]" : "text-[#F4F0EA] group-hover:text-[#D9C39A]"
                  }`}>
                    {genre.name}
                  </h4>
                  <p className="text-[11px] text-[#8C877E] line-clamp-1 leading-tight font-sans">
                    {genre.description}
                  </p>
                  <p className="font-mono text-[10px] text-[#D9C39A]/80 truncate pt-0.5">
                    {genre.subgenres}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-[#262522] flex-shrink-0 gap-4">
          <p className="font-mono text-xs text-[#8C877E] max-w-xl truncate">
            {selectedGenres.length > 0 ? (
              <>ACTIVE: <span className="text-[#F4F0EA]">{selectedGenres.join(', ')}</span></>
            ) : (
              <span className="text-[#D9C39A]">All genres unfiltered (broad catalog vault mode)</span>
            )}
          </p>

          <button
            type="button"
            onClick={handleFinish}
            className="px-5 py-2.5 rounded-[2px] bg-[#E03C31] hover:bg-[#C83228] text-white text-xs font-mono uppercase tracking-widest transition-all shadow flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commit Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}

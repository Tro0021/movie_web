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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-[#101420] border border-amber-500/25 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <Sliders className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                Re-Tune Cinema Preferences
              </h3>
              <p className="text-xs text-slate-400">
                Select your preferred genres. Only films fulfilling these genres will be curated in your vault.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters & Selection Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs">
            <button
              onClick={() => setFilterCategory("ALL")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterCategory === "ALL"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Genres ({CINEMA_GENRES.length})
            </button>
            <button
              onClick={() => setFilterCategory("MAJOR")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterCategory === "MAJOR"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Major Genres (10)
            </button>
            <button
              onClick={() => setFilterCategory("NOTABLE")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterCategory === "NOTABLE"
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Other Categories (5)
            </button>
          </div>

          {/* Quick Controls: Select All / Clear All */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-slate-300 hover:text-white font-medium transition-colors cursor-pointer hover:underline"
            >
              Select All
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors cursor-pointer hover:underline"
            >
              Clear All
            </button>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20 ml-1">
              {selectedGenres.length} {selectedGenres.length === 1 ? 'genre' : 'genres'} active
            </span>
          </div>
        </div>

        {/* Visual Genre Selection Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedGenres.map(genre => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <div
                key={genre.id}
                onClick={() => toggleGenre(genre.name)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 min-h-[145px] flex flex-col justify-end p-4 shadow-lg select-none ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10 scale-[1.01]"
                    : "border-white/10 hover:border-white/25 bg-[#141824]"
                }`}
              >
                {/* Dedicated Pure Genre Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter ${
                      isSelected ? "brightness-[0.45] contrast-110" : "brightness-[0.35] grayscale-[20%]"
                    }`}
                  />
                  {/* Subtle Gradient Overlays for readable typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/70 to-black/30" />
                </div>

                {/* Top Badge: Selection State & Category */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-auto pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                    {genre.category}
                  </span>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-amber-400 border-amber-400 text-black shadow-glow-gold"
                      : "border-white/30 bg-black/40 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Genre Title & Key Subgenres */}
                <div className="relative z-10 space-y-1">
                  <h4 className={`text-base font-bold font-heading transition-colors ${
                    isSelected ? "text-amber-300" : "text-white group-hover:text-amber-200"
                  }`}>
                    {genre.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1 leading-tight font-normal">
                    {genre.description}
                  </p>
                  <p className="text-[10px] text-amber-300/80 font-medium truncate pt-0.5">
                    Subgenres: {genre.subgenres}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-shrink-0 gap-4">
          <p className="text-xs text-slate-400 max-w-xl truncate">
            {selectedGenres.length > 0 ? (
              <>Selected ({selectedGenres.length}): <span className="text-white font-medium">{selectedGenres.join(', ')}</span></>
            ) : (
              <span className="text-amber-400 font-medium">All genres toggled off (archive will display all cinema)</span>
            )}
          </p>

          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Update Curated Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}

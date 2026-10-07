import React, { useState } from 'react';
import { 
  Sparkles, Film, Check, Sliders, MessageSquare, Compass 
} from 'lucide-react';

export default function AiDiscoveryPage({ 
  allMovies = [], 
  onSelectMovie, 
  apiKeys, 
  onPlayTrailer 
}) {
  const [selectedMovies, setSelectedMovies] = useState([allMovies[0], allMovies[1]].filter(Boolean));
  const [preferredPacing, setPreferredPacing] = useState('Deliberate & Atmospheric');
  const [customVibe, setCustomVibe] = useState('Grand scale, profound philosophical themes, and breathtaking Roger Deakins-style cinematography');
  const [isLoading, setIsLoading] = useState(false);

  const PACING_OPTIONS = [
    'Deliberate & Atmospheric (Slow Burn)',
    'Relentless Kinetic Adrenaline',
    'Intellectual & Cerebral Non-Linear',
    'Fast-Paced Dialogue & High Stakes'
  ];

  const VIBE_PRESETS = [
    { label: 'Cosmic Scale & Physics', prompt: 'Cosmic scale, theoretical physics, awe-inspiring vistas, and emotional family ties' },
    { label: 'Deakins/Fraser Neo-Noir', prompt: 'Heavy shadow contrast, rainy brutalist architecture, neon silhouettes, and philosophical crime' },
    { label: 'A24 Multiverse & Absurdism', prompt: 'Philosophical nihilism reconciled with intimate family love, surreal comedy, and visual fireworks' },
    { label: 'High Stakes Political Intrigue', prompt: 'Boardroom depositions, atomic politics, high intellectual tension, and relentless dialogue' }
  ];

  const toggleMovieSelection = (movie) => {
    if (selectedMovies.some(m => m.id === movie.id)) {
      if (selectedMovies.length > 1) {
        setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
      }
    } else {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleGenerate = () => {
    setIsLoading(true);
    // Results view and Gemini API integration wired in next iteration
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in font-sans">
      {/* Curator Hero Banner */}
      <div className="relative rounded-[4px] overflow-hidden p-6 sm:p-8 border border-[#262522] bg-[#121210] shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E03C31]" />
              Kinova Curatorial Intelligence
            </span>
            <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1 bg-[#181816] px-2 py-0.5 rounded-[2px] border border-emerald-500/20">
              <Check className="w-3 h-3" /> Auteur Reasoning Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F4F0EA] tracking-tight leading-tight">
            Thematic & Auteur Film Discovery
          </h1>

          <p className="text-sm text-[#8C877E] leading-relaxed">
            Move beyond algorithmically blunt genre tags. Kinova examines directorial pacing, cinematographic lighting ratios, sound architecture, and thematic motifs to uncover your next cinematic obsession.
          </p>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Preferences & Movie Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Select Films You Loved */}
          <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262522] pb-3">
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-[#E03C31]" />
                  1. Anchor Cinema ({selectedMovies.length} Selected)
                </h3>
                <p className="text-xs text-[#8C877E]">Select titles that embody the cadence and visual language you are seeking</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {allMovies.map(movie => {
                const isSelected = selectedMovies.some(m => m.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    onClick={() => toggleMovieSelection(movie)}
                    className={`relative rounded-[2px] p-2 cursor-pointer transition-colors border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#181816] border-[#D9C39A]/60'
                        : 'bg-[#181816]/50 border-[#262522] hover:border-[#8C877E]'
                    }`}
                  >
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-8 h-12 object-cover rounded-[2px] flex-shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-serif text-[#F4F0EA] truncate">{movie.title}</h4>
                      <p className="text-[10px] font-mono text-[#8C877E] truncate">{movie.director}</p>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-[#D9C39A] flex items-center gap-0.5 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#E03C31]" /> ANCHOR
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Pacing & Tone Nuance */}
          <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2 border-b border-[#262522] pb-3">
              <Sliders className="w-3.5 h-3.5 text-[#E03C31]" />
              2. Preferred Directorial Cadence & Pacing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PACING_OPTIONS.map(pacing => (
                <button
                  key={pacing}
                  type="button"
                  onClick={() => setPreferredPacing(pacing)}
                  className={`p-3 rounded-[2px] text-left text-xs font-mono transition-colors border cursor-pointer ${
                    preferredPacing === pacing
                      ? 'bg-[#181816] text-[#D9C39A] border-[#D9C39A]/40'
                      : 'bg-[#181816]/50 text-[#8C877E] border-[#262522] hover:text-[#F4F0EA] hover:border-[#8C877E]'
                  }`}
                >
                  {pacing}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Vibe / Prompt */}
          <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2 border-b border-[#262522] pb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[#E03C31]" />
              3. Desired Atmosphere & Cinematographic Motifs
            </h3>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {VIBE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomVibe(preset.prompt)}
                  className="px-2.5 py-1 rounded-[2px] text-[10px] font-mono uppercase bg-[#181816] hover:bg-[#22221f] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={customVibe}
              onChange={(e) => setCustomVibe(e.target.value)}
              placeholder="Describe specific themes, cinematography style, or musical vibes..."
              className="w-full p-3 rounded-[4px] bg-[#181816] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31]"
            />
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || selectedMovies.length === 0}
              className={`w-full py-3.5 rounded-[4px] font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isLoading 
                  ? 'bg-[#181816] text-[#8C877E] border border-[#262522] cursor-wait' 
                  : 'bg-[#E03C31] hover:bg-[#c83228] text-white shadow-lg'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Cinematic Affinities...' : 'Consult Curatorial Recommender'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Curatorial Methodology */}
        <div className="space-y-6">
          <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F0EA] flex items-center gap-2 border-b border-[#262522] pb-3">
              <Compass className="w-3.5 h-3.5 text-[#E03C31]" />
              Curatorial Methodology
            </h3>
            
            <ul className="text-xs text-[#8C877E] space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31] mt-1.5 flex-shrink-0" />
                <span><strong className="text-[#F4F0EA]">Visual Syntax:</strong> Evaluates aspect ratios, lighting contrast ratios, and cinematographer pedigree.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31] mt-1.5 flex-shrink-0" />
                <span><strong className="text-[#F4F0EA]">Thematic Motifs:</strong> Matches core existential tensions, moral ambiguity, and narrative structure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31] mt-1.5 flex-shrink-0" />
                <span><strong className="text-[#F4F0EA]">Archival Verification:</strong> Cross-checks every recommendation against real-time streaming exhibition windows.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-[4px] bg-[#121210] border border-[#262522] space-y-1 text-center">
            <span className="text-xl font-serif text-[#D9C39A]">Auteur Affinity Matrix</span>
            <p className="text-[11px] font-mono text-[#8C877E]">Architectural curation driven by cinematic craft</p>
          </div>
        </div>
      </div>
    </div>
  );
}

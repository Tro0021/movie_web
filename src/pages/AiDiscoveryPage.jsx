import React, { useState } from 'react';
import { 
  Sparkles, Film, Check, ExternalLink, 
  RotateCcw, Sliders, MessageSquare, Tv, Compass 
} from 'lucide-react';
import { generateCinephileRecommendations } from '../services/geminiApi';

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
  const [recommendations, setRecommendations] = useState(null);

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

  const handleGenerate = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const results = await generateCinephileRecommendations({
        selectedMovies,
        customVibe,
        preferredPacing,
        apiKey: apiKeys?.gemini
      });
      setRecommendations(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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

      {/* Recommendations Output Area */}
      {isLoading && (
        <div className="p-12 text-center space-y-3 bg-[#121210] rounded-[4px] border border-[#262522] animate-pulse">
          <Sparkles className="w-8 h-8 text-[#D9C39A] animate-spin mx-auto" />
          <h3 className="text-xl font-serif text-[#F4F0EA]">
            Analyzing Narrative Arcs & Auteur Stylistics...
          </h3>
          <p className="text-xs font-mono text-[#8C877E] max-w-md mx-auto">
            Examining pacing, color temperature, score composition, and cross-referencing global streaming deep-links.
          </p>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex items-center justify-between border-b border-[#262522] pb-4">
            <div>
              <h2 className="text-2xl font-serif text-[#F4F0EA] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E03C31]" />
                Curatorial Ledger Recommendations
              </h2>
              <p className="text-xs font-mono text-[#8C877E]">
                Generated from anchor cinema ({selectedMovies.map(m => m.title).join(', ')})
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-3 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#181816] border border-[#262522] text-xs font-mono uppercase text-[#8C877E] hover:text-[#F4F0EA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="bg-[#121210] rounded-[4px] p-5 border border-[#262522] space-y-4 flex flex-col justify-between hover:border-[#8C877E] transition-colors shadow-xl"
              >
                <div className="space-y-3">
                  {/* Top Bar with Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      {rec.poster ? (
                        <img 
                          src={rec.poster} 
                          alt={rec.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                          }}
                          className="w-14 h-20 object-cover rounded-[2px] shadow-lg border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-20 rounded-[2px] bg-[#181816] border border-[#262522] flex items-center justify-center text-[#D9C39A] flex-shrink-0">
                          <Film className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-serif text-[#F4F0EA]">{rec.title}</h3>
                          <span className="text-xs font-mono text-[#8C877E]">({rec.year})</span>
                        </div>
                        <p className="text-xs font-mono text-[#D9C39A]">Dir. {rec.director || 'Director Unavailable'}</p>
                        {rec.cinematographer && (
                          <p className="text-[10px] font-mono text-[#8C877E]">DP: {rec.cinematographer}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {rec.genres?.map((g, gIdx) => (
                            <span key={gIdx} className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-[#181816] text-[#8C877E] border border-[#262522]">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30 text-xs font-mono font-semibold tabular-nums text-center flex-shrink-0">
                      {rec.matchScore}% MATCH
                    </div>
                  </div>

                  {/* Curatorial Rationale */}
                  <div className="p-3 rounded-[2px] bg-[#181816] border border-[#262522] space-y-1">
                    <span className="text-[9px] font-mono font-semibold text-[#D9C39A] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#E03C31]" />
                      Curatorial Affinity
                    </span>
                    <p className="text-xs text-[#8C877E] leading-relaxed italic font-serif">
                      "{rec.explanation}"
                    </p>
                  </div>
                </div>

                {/* Direct OTT Streaming Links */}
                <div className="pt-3 border-t border-[#262522] space-y-2">
                  <span className="text-[10px] uppercase font-mono text-[#8C877E] tracking-wider flex items-center gap-1">
                    <Tv className="w-3 h-3 text-[#E03C31]" />
                    Exhibition Windows:
                  </span>
                  
                  {rec.streaming && rec.streaming.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {rec.streaming.map((st, sIdx) => (
                        <a
                          key={sIdx}
                          href={st.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-[2px] bg-[#181816] hover:bg-[#20201d] border border-[#262522] text-xs font-mono text-[#F4F0EA] transition-colors flex items-center gap-1.5"
                        >
                          <span>{st.provider}</span>
                          <span className="text-[10px] text-emerald-400">({st.type})</span>
                          <ExternalLink className="w-3 h-3 text-[#8C877E]" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-[#8C877E]">Exhibition details being indexed for this territory.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

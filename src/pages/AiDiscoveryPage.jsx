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
    { label: 'Epic Cosmic Physics & Scale', prompt: 'Cosmic scale, theoretical physics, awe-inspiring vistas, and emotional family ties' },
    { label: 'Deakins/Fraser Neo-Noir Shadows', prompt: 'Heavy shadow contrast, rainy brutalist architecture, neon silhouettes, and philosophical crime' },
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
    <div className="space-y-10 pb-20 animate-fade-in">
      {/* Curator Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-amber-500/25 bg-[#121622] shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Kinova Curatorial Intelligence
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Check className="w-3 h-3" /> Curatorial Reasoning Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            Thematic Film Discovery
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Move beyond algorithmically blunt genre tags. Kinova examines directorial pacing, cinematographic lighting, audio architecture, and thematic motifs to find your next cinematic obsession.
          </p>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Preferences & Movie Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Select Films You Loved */}
          <div className="bg-[#121622] rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  1. Anchor Films ({selectedMovies.length} Selected)
                </h3>
                <p className="text-xs text-slate-400">Select films that embody the style and tone you are seeking</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allMovies.map(movie => {
                const isSelected = selectedMovies.some(m => m.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    onClick={() => toggleMovieSelection(movie)}
                    className={`relative rounded-xl p-2 cursor-pointer transition-all border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/60 shadow-md'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{movie.director}</p>
                      {isSelected && (
                        <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5 mt-1">
                          <Check className="w-2.5 h-2.5" /> Anchor
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Pacing & Tone Nuance */}
          <div className="bg-[#121622] rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              2. Preferred Directorial Pacing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PACING_OPTIONS.map(pacing => (
                <button
                  key={pacing}
                  type="button"
                  onClick={() => setPreferredPacing(pacing)}
                  className={`p-3 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                    preferredPacing === pacing
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {pacing}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Vibe / Prompt */}
          <div className="bg-[#121622] rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              3. Desired Atmosphere & Cinematic Motifs
            </h3>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {VIBE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomVibe(preset.prompt)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
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
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || selectedMovies.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                isLoading 
                  ? 'bg-slate-800 text-slate-400 cursor-wait' 
                  : 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-black/50'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Cinematic Affinity...' : 'Consult Curator Recommender'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Curatorial Methodology */}
        <div className="space-y-6">
          <div className="bg-[#121622] rounded-2xl p-6 border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Curatorial Methodology
            </h3>
            
            <ul className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>Visual Syntax:</strong> Evaluates aspect ratios, lighting contrast, color palettes, and director of photography pedigree.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>Thematic Motifs:</strong> Matches core existential questions, moral dilemmas, and narrative structures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span><strong>Distribution Verification:</strong> Cross-checks every recommendation against real-time streaming availability.</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats Pill */}
          <div className="p-4 rounded-2xl bg-[#0e121c] border border-white/5 space-y-1 text-center">
            <span className="text-2xl font-extrabold text-amber-300 font-heading">Auteur Affinity</span>
            <p className="text-xs text-slate-400">Curated match-making driven by authentic cinematic craft</p>
          </div>
        </div>
      </div>

      {/* Recommendations Output Area */}
      {isLoading && (
        <div className="p-12 text-center space-y-4 bg-[#121622] rounded-3xl border border-amber-500/20 animate-pulse">
          <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">
            Analyzing Narrative Arcs & Auteur Stylistics...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Examining pacing, color temperature, score composition, and cross-referencing global streaming deep-links.
          </p>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Curator Recommendations
              </h2>
              <p className="text-xs text-slate-400">
                Generated from your selected anchor films ({selectedMovies.map(m => m.title).join(', ')})
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="bg-[#121622] rounded-2xl p-6 border border-white/[0.08] space-y-4 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-xl"
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
                          className="w-16 h-24 object-cover rounded-xl shadow-lg border border-white/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-24 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                          <Film className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white font-heading">{rec.title}</h3>
                          <span className="text-xs text-slate-400">({rec.year})</span>
                        </div>
                        <p className="text-xs text-amber-300/90 font-medium">Dir. {rec.director || 'Director Unavailable'}</p>
                        {rec.cinematographer && (
                          <p className="text-[11px] text-slate-400">Cinematography: {rec.cinematographer}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {rec.genres?.map((g, gIdx) => (
                            <span key={gIdx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold font-heading text-center flex-shrink-0">
                      {rec.matchScore}% Match
                    </div>
                  </div>

                  {/* Curatorial Rationale */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Curatorial Affinity
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{rec.explanation}"
                    </p>
                  </div>
                </div>

                {/* Direct OTT Streaming Links */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Tv className="w-3 h-3 text-amber-400" />
                    Instant Streaming Options:
                  </span>
                  
                  {rec.streaming && rec.streaming.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {rec.streaming.map((st, sIdx) => (
                        <a
                          key={sIdx}
                          href={st.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                        >
                          <span>{st.provider}</span>
                          <span className="text-[10px] text-emerald-400">({st.type})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Streaming availability being updated for this title.</p>
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

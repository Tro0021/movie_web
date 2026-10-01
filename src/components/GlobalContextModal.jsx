import React, { useState } from 'react';
import { Globe2, ShieldCheck, Languages, Building, CheckCircle2 } from 'lucide-react';
import { COUNTRY_AUTHORITY_MAP } from '../services/movieApi';

export default function GlobalContextSection({ globalContext }) {
  const [activeTab, setActiveTab] = useState('certifications');

  if (!globalContext) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            Global Release & Distribution Context
          </h3>
          <p className="text-xs text-slate-400">Territorial certifications, distributors, and localization footprints</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'certifications'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Age Ratings ({globalContext.certifications?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'distribution'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Distributors
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'languages'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Localization
          </button>
        </div>
      </div>

      {/* Tab: Certifications */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
          {(!globalContext.certifications || globalContext.certifications.length === 0) ? (
            <div className="col-span-full py-8 text-center text-slate-400 text-sm">
              No regional age certifications published yet.
            </div>
          ) : (
            globalContext.certifications.map((c, idx) => {
              const countryCode = c.code || 'INT';
              const authority = c.authority || 'Official';
              const formattedHeader = `${countryCode} (${authority})`;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-400/20 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200 tracking-wide font-mono">
                      {formattedHeader}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {c.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="truncate">{c.country || countryCode}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{c.note || `${authority} Rating`}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Distributors */}
      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
          {globalContext.distributionByRegion?.map((dist, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  {dist.distributor}
                </div>
                <span className="text-[11px] text-slate-400">{dist.region}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                {dist.rightsType}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Languages */}
      {activeTab === 'languages' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Original Audio Release
              </span>
              <span className="text-sm font-semibold text-white">{globalContext.languages?.original}</span>
            </div>

            {globalContext.languages?.fictionalDialects?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Constructed Dialects / Worldbuilding
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {globalContext.languages.fictionalDialects.map((d, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Major Dubbed Theatrical & OTT Tracks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {globalContext.languages?.dubbed?.map((lang, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Subtitle Coverage
              </span>
              <p className="text-xs text-slate-300">{globalContext.languages?.subtitles?.[0]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

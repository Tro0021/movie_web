import React, { useState } from 'react';
import { Globe2, ShieldCheck, Languages, Building, CheckCircle2 } from 'lucide-react';
import { COUNTRY_AUTHORITY_MAP } from '../services/movieApi';

export default function GlobalContextSection({ globalContext }) {
  const [activeTab, setActiveTab] = useState('certifications');

  if (!globalContext) return null;

  return (
    <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262522] pb-4">
        <div>
          <h3 className="font-serif text-xl font-normal text-[#F4F0EA] flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#D9C39A]" />
            Global Release & Distribution Ledger
          </h3>
          <p className="text-xs text-[#8C877E] font-sans">Territorial certifications, distributors, and localization footprints</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-[#0A0A09] p-1 rounded-[2px] border border-[#262522]">
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-[#181816] text-[#F4F0EA] border border-[#262522]'
                : 'text-[#8C877E] hover:text-[#F4F0EA]'
            }`}
          >
            Age Ratings ({globalContext.certifications?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'distribution'
                ? 'bg-[#181816] text-[#F4F0EA] border border-[#262522]'
                : 'text-[#8C877E] hover:text-[#F4F0EA]'
            }`}
          >
            Distributors
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'languages'
                ? 'bg-[#181816] text-[#F4F0EA] border border-[#262522]'
                : 'text-[#8C877E] hover:text-[#F4F0EA]'
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
            <div className="col-span-full py-8 text-center text-[#8C877E] font-mono text-xs">
              No regional age certifications recorded for this release.
            </div>
          ) : (
            globalContext.certifications.map((c, idx) => {
              const countryCode = c.code || 'INT';
              const authority = c.authority || 'Official';
              const formattedHeader = `${countryCode} (${authority})`;
              return (
                <div key={idx} className="p-3.5 rounded-[2px] bg-[#181816] border border-[#262522]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-medium text-[#F4F0EA] tracking-wide">
                      {formattedHeader}
                    </span>
                    <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase bg-[#121210] text-[#709CA8] border border-[#709CA8]/30">
                      {c.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8C877E] mt-1">
                    <span className="truncate">{c.country || countryCode}</span>
                    <span className="text-[10px] text-[#8C877E] truncate max-w-[120px] font-mono">{c.note || `${authority} Rating`}</span>
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
            <div key={idx} className="p-3.5 rounded-[2px] bg-[#181816] border border-[#262522] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#F4F0EA]">
                  <Building className="w-3.5 h-3.5 text-[#D9C39A]" />
                  {dist.distributor}
                </div>
                <span className="text-[11px] text-[#8C877E]">{dist.region}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-[#121210] text-[#D9C39A] border border-[#262522]">
                {dist.rightsType}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Languages */}
      {activeTab === 'languages' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-[2px] bg-[#181816] border border-[#262522] space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block mb-1">
                Original Audio Master
              </span>
              <span className="text-sm font-medium text-[#F4F0EA]">{globalContext.languages?.original}</span>
            </div>

            {globalContext.languages?.fictionalDialects?.length > 0 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block mb-1">
                  Constructed Dialects / Worldbuilding
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {globalContext.languages.fictionalDialects.map((d, idx) => (
                    <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded-[2px] bg-[#121210] text-[#D9C39A] border border-[#262522]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block mb-1">
                Theatrical &amp; OTT Dub Tracks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {globalContext.languages?.dubbed?.map((lang, idx) => (
                  <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded-[2px] bg-[#121210] text-[#8C877E] border border-[#262522]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E] block mb-1">
                Subtitle Archive
              </span>
              <p className="text-xs text-[#8C877E]">{globalContext.languages?.subtitles?.[0]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

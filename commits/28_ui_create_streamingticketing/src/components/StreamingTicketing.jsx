import React, { useState } from 'react';
import { 
  Tv, ExternalLink, Calendar, MapPin
} from 'lucide-react';
import { COUNTRY_OPTIONS } from '../data/mockMovies';

export default function StreamingTicketing({
  streamingData = {},
  premiereDate,
  releaseDate,
  currentCountry = 'US',
  onCountryChange,
  movieTitle = '',
}) {
  const activeCountryObj = COUNTRY_OPTIONS.find((c) => c.code === currentCountry) || COUNTRY_OPTIONS[0];
  const countryStream = streamingData?.[currentCountry];
  const flatrate = countryStream?.flatrate || [];

  return (
    <div className="space-y-6 font-sans">
      {/* Theatrical Premiere & Release Date Bar */}
      <div className="rounded-[4px] p-5 border border-[#262522] bg-[#121210]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#181816] border border-[#262522] text-[#D9C39A] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-[#E03C31]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#8C877E] tracking-wider">Theatrical Calendar</span>
              <h4 className="text-base font-serif text-[#F4F0EA]">Premiere: {premiereDate || releaseDate || 'TBA'}</h4>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#8C877E] border-t sm:border-t-0 border-[#262522] pt-3 sm:pt-0 font-mono">
            <div>
              <span className="text-[#8C877E] block text-[10px] uppercase tracking-wider">Premiere</span>
              <span className="font-semibold text-[#D9C39A]">{premiereDate || releaseDate || 'TBA'}</span>
            </div>
            <div className="h-6 w-px bg-[#262522]" />
            <div>
              <span className="text-[#8C877E] block text-[10px] uppercase tracking-wider">Wide Release</span>
              <span className="font-semibold text-[#F4F0EA]">{releaseDate || 'TBA'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[4px] bg-[#121210] border border-[#262522]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8C877E]">
          <MapPin className="w-3.5 h-3.5 text-[#E03C31]" />
          <span>TERRITORY AVAILABILITY:</span>
          <span className="text-[#F4F0EA] font-semibold">{activeCountryObj.name} ({activeCountryObj.code})</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {COUNTRY_OPTIONS.map((c) => (
            <button
              key={c.code}
              onClick={() => onCountryChange && onCountryChange(c.code)}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-mono transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer ${
                currentCountry === c.code
                  ? 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40'
                  : 'bg-[#181816]/50 text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522]'
              }`}
            >
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Streaming / OTT Providers ("Watch Now") */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-[#E03C31]" />
          <h4 className="text-xl font-serif text-[#F4F0EA]">
            Subscription Exhibition — {activeCountryObj.name}
          </h4>
        </div>

        {flatrate.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {flatrate.map((provider, idx) => (
              <a
                key={idx}
                href={provider.url || `https://www.justwatch.com/search?q=${encodeURIComponent(movieTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-[4px] border border-[#262522] bg-[#121210] hover:border-[#8C877E] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={provider.provider}
                      className="w-10 h-10 rounded-[2px] object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-[2px] bg-[#181816] border border-[#262522] flex items-center justify-center text-sm">
                      📺
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-serif text-[#F4F0EA] group-hover:text-[#D9C39A] transition-colors flex items-center gap-1.5">
                      {provider.provider}
                      <ExternalLink className="w-3 h-3 text-[#8C877E]" />
                    </h5>
                    <span className="text-[10px] font-mono text-emerald-400">Included with Plan</span>
                    <p className="text-[10px] font-mono text-[#8C877E] mt-0.5">{provider.quality || '4K UHD'}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors">
                  Exhibition
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-[4px] bg-[#121210] border border-[#262522] text-xs font-mono text-[#8C877E]">
            Subscription exhibition platforms currently pending for {activeCountryObj.name}.
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, ExternalLink, Calendar,
  MapPin, AlertCircle, Loader2
} from 'lucide-react';
import { COUNTRY_OPTIONS } from '../data/mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Regional ticketing partners — mirrors movieApi.js
const REGIONAL_TICKETING_MAP = {
  US: [
    { name: 'Fandango', url: 'https://www.fandango.com/search?q=', formats: ['Standard', 'IMAX', 'Dolby Cinema'] },
    { name: 'AMC Theatres', url: 'https://www.amctheatres.com/search?q=', formats: ['IMAX 70mm', 'Dolby Cinema', 'Prime'] },
  ],
  IN: [
    { name: 'BookMyShow', url: 'https://in.bookmyshow.com/explore/movies?q=', formats: ['IMAX with Laser', '4DX', 'PXL'] },
    { name: 'PVR INOX', url: 'https://www.pvrcinemas.com/movies?q=', formats: ['PVR ICE', 'IMAX', '4DX'] },
  ],
  GB: [
    { name: 'Odeon Cinemas', url: 'https://www.odeon.co.uk/films/', formats: ['iSense', 'Dolby Cinema'] },
    { name: 'Cineworld', url: 'https://www.cineworld.co.uk/search#/', formats: ['IMAX', 'Superscreen', '4DX'] },
  ],
  FR: [
    { name: 'UGC Cinémas', url: 'https://www.ugc.fr/recherche?q=', formats: ['IMAX', 'Dolby Atmos'] },
    { name: 'Pathé', url: 'https://www.pathe.fr/recherche?q=', formats: ['4DX', 'IMAX'] },
  ],
  JP: [
    { name: 'Toho Cinemas', url: 'https://www.tohotheater.jp/search?q=', formats: ['IMAX', 'TCX', 'Dolby Cinema'] },
    { name: 'United Cinemas', url: 'https://www.unitedcinemas.jp/search?q=', formats: ['4DX', 'IMAX'] },
  ],
  ALL: [],
};

/**
 * Fetch and parse TMDB watch providers for a given country.
 * Returns { flatrate, rent, buy } arrays.
 */
async function fetchRegionalProviders(tmdbId, countryCode, apiKey, movieTitle) {
  if (!tmdbId || countryCode === 'ALL') return { flatrate: [], rent: [], buy: [] };

  const isBearer = apiKey && apiKey.length > 50;
  const url = isBearer
    ? `${TMDB_BASE_URL}/movie/${tmdbId}/watch/providers`
    : `${TMDB_BASE_URL}/movie/${tmdbId}/watch/providers?api_key=${apiKey}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(isBearer ? { Authorization: `Bearer ${apiKey}` } : {}),
  };

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const json = await res.json();

  const providerData = json?.results?.[countryCode];
  if (!providerData) return { flatrate: [], rent: [], buy: [] };

  const justWatchUrl =
    providerData.link ||
    `https://www.justwatch.com/search?q=${encodeURIComponent(movieTitle || '')}`;

  const mapProvider = (p) => ({
    provider: p.provider_name,
    logo: p.logo_path
      ? `${TMDB_IMAGE_BASE}/w154${p.logo_path}`
      : null,
    url: justWatchUrl,
    quality: '4K UHD • HDR',
  });

  return {
    flatrate: (providerData.flatrate || []).map(mapProvider),
    rent: (providerData.rent || []).map((p) => ({
      ...mapProvider(p),
      price: '$3.99 – $5.99',
    })),
    buy: (providerData.buy || []).map((p) => ({
      ...mapProvider(p),
      price: '$14.99 – $19.99',
    })),
  };
}

export default function StreamingTicketing({
  streamingData,   // pre-fetched country map
  premiereDate,
  releaseDate,
  currentCountry,
  onCountryChange,
  tmdbId,          // needed for live re-fetching on country change
  movieTitle,      // for JustWatch fallback URLs
  apiKey,          // TMDB key passed from App
}) {
  const [liveStream, setLiveStream] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current = false;
    const localAlive = { current: true };
    abortRef.current = localAlive;

    async function load() {
      if (streamingData?.[currentCountry]) {
        setLiveStream(streamingData[currentCountry]);
        return;
      }

      if (tmdbId && apiKey) {
        setIsFetching(true);
        try {
          const result = await fetchRegionalProviders(tmdbId, currentCountry, apiKey, movieTitle);
          if (localAlive.current) setLiveStream(result);
        } catch {
          if (localAlive.current) setLiveStream(null);
        } finally {
          if (localAlive.current) setIsFetching(false);
        }
        return;
      }

      setLiveStream(null);
    }

    load();

    return () => { localAlive.current = false; };
  }, [currentCountry, tmdbId, apiKey, streamingData, movieTitle]);

  const countryTicketing = REGIONAL_TICKETING_MAP[currentCountry] || REGIONAL_TICKETING_MAP['US'];
  const activeCountryObj = COUNTRY_OPTIONS.find((c) => c.code === currentCountry) || COUNTRY_OPTIONS[0];

  const flatrate = liveStream?.flatrate || [];
  const rent     = liveStream?.rent     || [];
  const buy      = liveStream?.buy      || [];

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
              onClick={() => onCountryChange(c.code)}
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

      {/* Loading indicator */}
      {isFetching && (
        <div className="flex items-center gap-2 text-xs font-mono text-[#8C877E] px-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9C39A]" />
          <span>Verifying exhibition ledgers for {activeCountryObj.name}…</span>
        </div>
      )}

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
                href={provider.url}
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
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
                    <p className="text-[10px] font-mono text-[#8C877E] mt-0.5">{provider.quality}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-[4px] bg-[#E03C31] hover:bg-[#c83228] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors">
                  Exhibition
                </div>
              </a>
            ))}
          </div>
        ) : (
          !isFetching && (
            <div className="p-3.5 rounded-[4px] bg-[#121210] border border-[#262522] text-xs font-mono text-[#8C877E] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#D9C39A] flex-shrink-0" />
              <span>
                Not currently streaming on subscription services in {activeCountryObj.name}.
                {currentCountry !== 'ALL' && ' Check digital transaction windows below.'}
              </span>
            </div>
          )
        )}
      </div>

      {/* Digital Rent & Buy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rent */}
        <div className="rounded-[4px] p-5 border border-[#262522] bg-[#121210] space-y-3">
          <div className="flex items-center justify-between border-b border-[#262522] pb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Digital Rental Window</span>
            <span className="text-[10px] font-mono text-[#8C877E]">{activeCountryObj.name} Stores</span>
          </div>

          {rent.length > 0 ? (
            <div className="space-y-2">
              {rent.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-[2px] bg-[#181816] hover:bg-[#20201d] border border-[#262522] transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.provider}
                        className="w-6 h-6 rounded-[2px] object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-[2px] bg-[#262522] flex items-center justify-center text-xs">🎬</div>
                    )}
                    <div>
                      <span className="font-serif text-[#F4F0EA] block">{item.provider}</span>
                      <span className="text-[9px] font-mono text-[#8C877E]">{item.quality}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#D9C39A] bg-[#121210] px-2 py-0.5 rounded-[2px] border border-[#262522]">
                    {item.price}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-[#8C877E]">No rental transaction ledgers listed in {activeCountryObj.name}.</p>
          )}
        </div>

        {/* Buy */}
        <div className="rounded-[4px] p-5 border border-[#262522] bg-[#121210] space-y-3">
          <div className="flex items-center justify-between border-b border-[#262522] pb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Digital Purchase (Permanent)</span>
            <span className="text-[10px] font-mono text-[#8C877E]">{activeCountryObj.name} Stores</span>
          </div>

          {buy.length > 0 ? (
            <div className="space-y-2">
              {buy.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-[2px] bg-[#181816] hover:bg-[#20201d] border border-[#262522] transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.provider}
                        className="w-6 h-6 rounded-[2px] object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-[2px] bg-[#262522] flex items-center justify-center text-xs">🎬</div>
                    )}
                    <div>
                      <span className="font-serif text-[#F4F0EA] block">{item.provider}</span>
                      <span className="text-[9px] font-mono text-[#8C877E]">{item.quality}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-emerald-400 bg-[#121210] px-2 py-0.5 rounded-[2px] border border-[#262522]">
                    {item.price}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-[#8C877E]">No digital purchase options in {activeCountryObj.name}.</p>
          )}
        </div>
      </div>
    </div>
  );
}

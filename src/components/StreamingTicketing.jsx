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
  streamingData,   // pre-fetched country map (may be sparse / undefined for mock movies)
  premiereDate,
  releaseDate,
  currentCountry,
  onCountryChange,
  tmdbId,          // needed for live re-fetching on country change
  movieTitle,      // for JustWatch fallback URLs
  apiKey,          // TMDB key passed from App
}) {
  // Live providers fetched for the active country
  const [liveStream, setLiveStream] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    // Cancel any in-flight request from previous country
    if (abortRef.current) abortRef.current = false;
    const localAlive = { current: true };
    abortRef.current = localAlive;

    async function load() {
      // 1. Try pre-fetched data first (instant, no network)
      if (streamingData?.[currentCountry]) {
        setLiveStream(streamingData[currentCountry]);
        return;
      }

      // 2. If we have a tmdbId + apiKey, fetch live from TMDB
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

      // 3. No API key and no cached data — clear so "not available" message shows
      setLiveStream(null);
    }

    load();

    return () => { localAlive.current = false; };
  }, [currentCountry, tmdbId, apiKey, streamingData, movieTitle]);

  // Merge live TMDB data with regional ticketing partners
  const countryTicketing = REGIONAL_TICKETING_MAP[currentCountry] || REGIONAL_TICKETING_MAP['US'];
  const activeCountryObj = COUNTRY_OPTIONS.find((c) => c.code === currentCountry) || COUNTRY_OPTIONS[0];

  const flatrate = liveStream?.flatrate || [];
  const rent     = liveStream?.rent     || [];
  const buy      = liveStream?.buy      || [];

  return (
    <div className="space-y-6">
      {/* Theatrical Premiere & Release Date Bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-800/50 to-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Theatrical Calendar</span>
              <h4 className="text-base font-bold text-white font-heading">Premiere: {premiereDate || releaseDate || 'N/A'}</h4>
            </div>
          </div>

          <div className="flex items-center gap-8 text-xs text-slate-300 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Premiere</span>
              <span className="font-bold text-amber-300 text-sm">{premiereDate || releaseDate || 'N/A'}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Release Date</span>
              <span className="font-bold text-white text-sm">{releaseDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0b0f19] border border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Regional Availability:</span>
          <span className="text-white font-bold">{activeCountryObj.name} ({activeCountryObj.code})</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {COUNTRY_OPTIONS.map((c) => (
            <button
              key={c.code}
              onClick={() => onCountryChange(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                currentCountry === c.code
                  ? 'bg-rose-600 text-white shadow-glow-crimson'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
          <span>Fetching availability for {activeCountryObj.name}…</span>
        </div>
      )}

      {/* Streaming / OTT Providers ("Watch Now") */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-rose-500" />
          <h4 className="text-lg font-bold text-white font-heading">
            Stream Online — {activeCountryObj.name}
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
                className="p-4 rounded-2xl glass-card glass-card-hover border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-slate-900/90 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={provider.provider}
                      className="w-12 h-12 rounded-xl object-cover shadow-md border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl">
                      📺
                    </div>
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                      {provider.provider}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </h5>
                    <span className="text-[11px] text-emerald-400 font-medium">Included with Plan</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{provider.quality}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-glow-crimson">
                  Watch
                </div>
              </a>
            ))}
          </div>
        ) : (
          !isFetching && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Not currently streaming on subscription services in {activeCountryObj.name}.
                {currentCountry !== 'ALL' && ' Check rent/buy options below.'}
              </span>
            </div>
          )
        )}
      </div>

      {/* Digital Rent & Buy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rent */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Rent Digital (48h Window)</span>
            <span className="text-xs text-slate-500">{activeCountryObj.name} Stores</span>
          </div>

          {rent.length > 0 ? (
            <div className="space-y-2">
              {rent.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-white/10 border border-white/5 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.provider}
                        className="w-7 h-7 rounded-lg object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm">🎬</div>
                    )}
                    <div>
                      <span className="font-semibold text-white block">{item.provider}</span>
                      <span className="text-[10px] text-slate-400">{item.quality}</span>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    {item.price}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No rent options listed in {activeCountryObj.name}.</p>
          )}
        </div>

        {/* Buy */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Buy & Keep Forever</span>
            <span className="text-xs text-slate-500">{activeCountryObj.name} Stores</span>
          </div>

          {buy.length > 0 ? (
            <div className="space-y-2">
              {buy.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-white/10 border border-white/5 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.provider}
                        className="w-7 h-7 rounded-lg object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm">🎬</div>
                    )}
                    <div>
                      <span className="font-semibold text-white block">{item.provider}</span>
                      <span className="text-[10px] text-slate-400">{item.quality}</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                    {item.price}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No digital purchase options in {activeCountryObj.name}.</p>
          )}
        </div>
      </div>
    </div>
  );
}

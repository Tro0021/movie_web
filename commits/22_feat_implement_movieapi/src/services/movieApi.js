/**
 * CinePulse Movie Data Aggregation Service (movieApi.js)
 * 
 * Aggregates core movie information, financials, global release certifications, 
 * and JustWatch OTT/ticketing availability from TMDB, plus granular Box Office Mojo
 * scraped financial & distribution data into a normalized single JSON object.
 */

import { formatCurrency } from './financialUtils.js';
import { MOCK_MOVIES } from '../data/mockMovies.js';

const TMDB_BASE_URL = 'https://api.tmdb.org/3';
const TMDB_FALLBACK_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Standard ticketing partners mapping by country code
const REGIONAL_TICKETING_MAP = {
  US: [
    { name: 'Fandango', url: 'https://www.fandango.com/search?q=', formats: ['Standard', 'IMAX', 'Dolby Cinema'] },
    { name: 'AMC Theatres', url: 'https://www.amctheatres.com/search?q=', formats: ['IMAX 70mm', 'Dolby Cinema', 'Prime'] },
    { name: 'Regal Cinemas', url: 'https://www.regmovies.com/search?query=', formats: ['RPX', '4DX', 'ScreenX'] }
  ],
  IN: [
    { name: 'BookMyShow', url: 'https://in.bookmyshow.com/explore/movies?q=', formats: ['IMAX with Laser', '4DX', 'PXL'] },
    { name: 'PVR INOX', url: 'https://www.pvrcinemas.com/movies?q=', formats: ['PVR ICE', 'IMAX', '4DX'] }
  ],
  GB: [
    { name: 'Odeon Cinemas', url: 'https://www.odeon.co.uk/films/', formats: ['iSense', 'Dolby Cinema'] },
    { name: 'Cineworld', url: 'https://www.cineworld.co.uk/search#/', formats: ['IMAX', 'Superscreen', '4DX'] },
    { name: 'Vue Cinemas', url: 'https://www.myvue.com/film/', formats: ['Sony 4K', 'VueX'] }
  ],
  CA: [
    { name: 'Cineplex', url: 'https://www.cineplex.com/search?q=', formats: ['UltraAVX', 'IMAX', 'VIP'] },
    { name: 'Landmark Cinemas', url: 'https://www.landmarkcinemas.com/search?q=', formats: ['Laser Ultra', 'Premiere'] }
  ],
  AU: [
    { name: 'Event Cinemas', url: 'https://www.eventcinemas.com.au/Movies?q=', formats: ['V-Max', 'Gold Class', '4DX'] },
    { name: 'Hoyts', url: 'https://www.hoyts.com.au/movies?q=', formats: ['Xtremescreen', 'D-BOX'] }
  ],
  DE: [
    { name: 'Cinestar', url: 'https://www.cinestar.de/kino-programm', formats: ['CineStar IMAX', 'Dolby Atmos'] },
    { name: 'UCI Kinowelt', url: 'https://www.uci-kinowelt.de/', formats: ['iSense', 'Luxe'] }
  ]
};

// Major countries mapping for certification translation
export const COUNTRY_NAME_MAP = {
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  AU: 'Australia',
  CA: 'Canada',
  KR: 'South Korea',
  BR: 'Brazil',
  IE: 'Ireland',
  SG: 'Singapore',
  MY: 'Malaysia',
  NZ: 'New Zealand',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  HK: 'Hong Kong',
  PH: 'Philippines',
  ZA: 'South Africa',
  AE: 'United Arab Emirates',
  AR: 'Argentina',
  SE: 'Sweden',
  NO: 'Norway',
  FI: 'Finland',
  DK: 'Denmark'
};

// Regulatory rating authorities by country
export const COUNTRY_AUTHORITY_MAP = {
  IN: 'CBFC',
  US: 'MPAA',
  GB: 'BBFC',
  AU: 'ACB',
  CA: 'CHVRS',
  DE: 'FSK',
  FR: 'CNC',
  IE: 'IFCO',
  JP: 'EIRIN',
  KR: 'KMRB',
  SG: 'IMDA',
  MY: 'LPF',
  NZ: 'OFLC',
  NL: 'Kijkwijzer',
  BR: 'ClassInd',
  IT: 'MiC',
  ES: 'ICAA',
  HK: 'OFNAA',
  PH: 'MTRCB',
  ZA: 'FPB',
  AE: 'NMC',
  AR: 'INCAA',
  SE: 'Statens medieråd',
  NO: 'Medietilsynet',
  FI: 'KAVI',
  DK: 'Medierådet'
};

/**
 * Fetch granular Box Office Mojo data from our backend microservice
 */
export async function fetchBoxOfficeMojoFinancials(imdbId) {
  if (!imdbId) return null;
  try {
    const res = await fetch(`/api/financials/${imdbId}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.warn(`[movieApi] Box Office Mojo microservice fetch note: ${err.message}`);
    return null;
  }
}

/**
 * Task 4: Geo-location parser
 * Detects user country or falls back to stored preference / 'US'
 */
export async function detectUserCountry(fallback = 'US') {
  if (typeof window !== 'undefined') {
    const cachedCountry = localStorage.getItem('cinepulse_country');
    if (cachedCountry && cachedCountry.length === 2) {
      return cachedCountry.toUpperCase();
    }
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata')) return 'IN';
    if (timeZone.includes('London')) return 'GB';
    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver')) return 'CA';
    if (timeZone.includes('Sydney') || timeZone.includes('Melbourne')) return 'AU';
    if (timeZone.includes('Berlin')) return 'DE';
    if (timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago')) return 'US';
  } catch (e) {}

  return fallback;
}

/**
 * Task 1 & 2: TMDB Fetcher helper
 */
async function tmdbFetch(endpoint, apiKey) {
  if (!apiKey) {
    throw new Error('TMDB API Key or Access Token is missing. Provide a key in API Settings.');
  }

  const isBearer = apiKey.length > 50;
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}language=en-US`;

  const headers = {
    'Content-Type': 'application/json',
    ...(isBearer ? { Authorization: `Bearer ${apiKey}` } : {})
  };

  const finalUrl = isBearer ? url : `${url}&api_key=${apiKey}`;

  let res;
  try {
    res = await fetch(finalUrl, { headers });
  } catch (err) {
    const fallbackFinalUrl = isBearer ? `${TMDB_FALLBACK_URL}${endpoint}${separator}language=en-US` : `${TMDB_FALLBACK_URL}${endpoint}${separator}language=en-US&api_key=${apiKey}`;
    res = await fetch(fallbackFinalUrl, { headers });
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`TMDB HTTP Error ${res.status}: ${errorText || res.statusText}`);
  }
  return await res.json();
}

/**
 * Extract region-specific age certifications and release lifecycle dates.
 * Filters empty certifications, prioritizes Theatrical (type 3) then Digital/Premiere (type 4/2),
 * merges Wikipedia/IMDb backend fallbacks, and strictly selects primary certification by:
 * 1. Movie's Origin Country (e.g. 'IN' for Indian movies, 'US' for Hollywood)
 * 2. User's local country ('IN')
 * 3. 'US' (MPAA) or 'GB' (BBFC)
 * 4. "Not Rated" fallback (zero fake +16 or PG-13 generation)
 */
export function parseReleaseDatesAndCertifications(
  releaseDatesResults = [],
  originCountry = 'US',
  userCountry = 'IN',
  scrapedCertifications = []
) {
  if (!Array.isArray(releaseDatesResults)) {
    releaseDatesResults = [];
  }

  const allCertificationsMap = new Map();
  let theatricalDate = null;
  let digitalDate = null;

  // 1. Process TMDB release_dates entries per country
  for (const countryObj of releaseDatesResults) {
    const countryCode = countryObj.iso_3166_1?.toUpperCase();
    if (!countryCode) continue;

    const dates = countryObj.release_dates || [];

    // Filter out any entries where certification is empty or whitespace
    const validCerts = dates.filter(d => d.certification && typeof d.certification === 'string' && d.certification.trim().length > 0);

    if (validCerts.length > 0) {
      // Prioritize Theatrical releases (type === 3), followed by Digital/Premiere (type === 4 or type === 2), then others
      validCerts.sort((a, b) => {
        const typePriority = (t) => {
          if (t === 3) return 1; // Theatrical
          if (t === 4 || t === 2) return 2; // Digital / Premiere
          return 3;
        };
        return typePriority(a.type) - typePriority(b.type);
      });

      const bestItem = validCerts[0];
      // Do NOT strip letters or slashes - preserve full official ratings like U/A 16+, PG-13, 12A
      const rating = bestItem.certification.trim();
      const countryName = COUNTRY_NAME_MAP[countryCode] || countryCode;
      const authority = COUNTRY_AUTHORITY_MAP[countryCode] || 'Official';

      allCertificationsMap.set(countryCode, {
        country: countryName,
        code: countryCode,
        authority,
        rating,
        label: `${countryCode} (${authority}): ${rating}`,
        note: bestItem.note || `${authority} Official Certification`,
        type: bestItem.type
      });
    }

    // Capture lifecycle theatrical and digital dates
    const theaterItem = dates.find(d => d.type === 3) || dates.find(d => d.type === 2);
    if (theaterItem && (countryCode === originCountry || countryCode === userCountry || !theatricalDate)) {
      theatricalDate = theaterItem.release_date ? theaterItem.release_date.split('T')[0] : null;
    }

    const digitalItem = dates.find(d => d.type === 4 || d.type === 5);
    if (digitalItem && (countryCode === originCountry || countryCode === userCountry || !digitalDate)) {
      digitalDate = digitalItem.release_date ? digitalItem.release_date.split('T')[0] : null;
    }
  }

  // 2. Merge backend scraped certifications from Wikipedia & IMDb
  if (Array.isArray(scrapedCertifications)) {
    for (const scraped of scrapedCertifications) {
      if (!scraped || !scraped.code || !scraped.rating) continue;
      const code = scraped.code.toUpperCase();
      const existing = allCertificationsMap.get(code);

      if (!existing) {
        allCertificationsMap.set(code, {
          country: scraped.country || COUNTRY_NAME_MAP[code] || code,
          code,
          authority: scraped.authority || COUNTRY_AUTHORITY_MAP[code] || 'Official',
          rating: scraped.rating,
          label: scraped.label || `${code} (${scraped.authority || COUNTRY_AUTHORITY_MAP[code] || 'Official'}): ${scraped.rating}`,
          note: scraped.note || 'Audited Censor Certification'
        });
      } else {
        // If Wikipedia specifically verified an official censor board rating (e.g. BBFC '12A' for GB where TMDB had generic '15'), update it
        if (code === 'GB' && scraped.authority === 'BBFC' && scraped.rating === '12A') {
          existing.rating = '12A';
          existing.authority = 'BBFC';
          existing.label = `GB (BBFC): 12A`;
          existing.note = 'British Board of Film Classification';
        }
      }
    }
  }

  // 3. Assemble and sort all certifications
  // Prioritize Origin Country, User Local Country ('IN'), US, GB, then other countries alphabetically
  const primaryKeys = [originCountry, userCountry, 'US', 'GB'].filter(Boolean);
  const allCertifications = Array.from(allCertificationsMap.values()).sort((a, b) => {
    const aPri = primaryKeys.indexOf(a.code);
    const bPri = primaryKeys.indexOf(b.code);
    if (aPri !== -1 && bPri !== -1) return aPri - bPri;
    if (aPri !== -1) return -1;
    if (bPri !== -1) return 1;
    return a.country.localeCompare(b.country);
  });

  // 4. Primary Header Certification Badge Selection
  // Exact Priority Order:
  // 1. Origin Country (data.origin_country?.[0] or data.production_countries?.[0]?.iso_3166_1)
  // 2. User's local country ('IN')
  // 3. 'US' (MPAA) or 'GB' (BBFC)
  // 4. If none, "Not Rated"
  let primaryCert = null;

  if (originCountry && allCertificationsMap.has(originCountry)) {
    const cert = allCertificationsMap.get(originCountry)?.rating;
    if (cert && cert !== 'NR' && cert !== 'Not Rated') {
      primaryCert = cert;
    }
  }

  if (!primaryCert && userCountry && allCertificationsMap.has(userCountry)) {
    const cert = allCertificationsMap.get(userCountry)?.rating;
    if (cert && cert !== 'NR' && cert !== 'Not Rated') {
      primaryCert = cert;
    }
  }

  if (!primaryCert && allCertificationsMap.has('US')) {
    const cert = allCertificationsMap.get('US')?.rating;
    if (cert && cert !== 'NR' && cert !== 'Not Rated') {
      primaryCert = cert;
    }
  }

  if (!primaryCert && allCertificationsMap.has('GB')) {
    const cert = allCertificationsMap.get('GB')?.rating;
    if (cert && cert !== 'NR' && cert !== 'Not Rated') {
      primaryCert = cert;
    }
  }

  if (!primaryCert) {
    primaryCert = 'Not Rated';
  }

  // 5. Theatrical lifespans
  let daysInTheaters = 120;
  let theatricalStatus = 'Theatrical Run Concluded';
  if (theatricalDate) {
    const tStart = new Date(theatricalDate);
    const tEnd = digitalDate ? new Date(digitalDate) : new Date(tStart.getTime() + (90 * 86400000));
    const now = new Date();

    const diffDays = Math.max(1, Math.round((tEnd - tStart) / 86400000));
    daysInTheaters = diffDays;

    if (now >= tStart && now <= tEnd) {
      const dayCount = Math.round((now - tStart) / 86400000);
      theatricalStatus = `Currently In Theaters (Day ${Math.max(1, dayCount)})`;
    } else if (now < tStart) {
      theatricalStatus = `Upcoming Theatrical Premiere: ${theatricalDate}`;
    } else {
      theatricalStatus = `Theatrical Run Concluded (${diffDays} Days in Cinemas)`;
    }
  }

  return {
    primaryCertification: primaryCert,
    allCertifications,
    theatricalReleaseDate: theatricalDate,
    theatricalClosingDate: digitalDate,
    theatricalStatus,
    daysInTheaters
  };
}

/**
 * Parse Watch Providers (JustWatch) and filter for user's country
 */
function parseWatchProviders(watchProvidersResults, targetCountry = 'US', movieTitle = '') {
  const results = watchProvidersResults?.results || {};
  const formattedByCountry = {};

  for (const [countryCode, providerData] of Object.entries(results)) {
    const justWatchWebUrl = providerData.link || `https://www.justwatch.com/us/search?q=${encodeURIComponent(movieTitle)}`;

    const flatrate = (providerData.flatrate || []).map(p => ({
      provider: p.provider_name,
      logo: p.logo_path ? `${TMDB_IMAGE_BASE}/w154${p.logo_path}` : 'https://images.justwatch.com/icon/207360008/s100/netflix.webp',
      url: justWatchWebUrl,
      quality: '4K UHD • HDR'
    }));

    const rent = (providerData.rent || []).map(p => ({
      provider: p.provider_name,
      logo: p.logo_path ? `${TMDB_IMAGE_BASE}/w154${p.logo_path}` : 'https://images.justwatch.com/icon/190848813/s100/apple-tv.webp',
      price: '$3.99 - $5.99',
      url: justWatchWebUrl,
      quality: '4K UHD'
    }));

    const buy = (providerData.buy || []).map(p => ({
      provider: p.provider_name,
      logo: p.logo_path ? `${TMDB_IMAGE_BASE}/w154${p.logo_path}` : 'https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp',
      price: '$14.99 - $19.99',
      url: justWatchWebUrl,
      quality: '4K UHD'
    }));

    const ticketingPartners = REGIONAL_TICKETING_MAP[countryCode] || REGIONAL_TICKETING_MAP['US'];
    const formattedTheaters = ticketingPartners.map(t => ({
      name: t.name,
      url: `${t.url}${encodeURIComponent(movieTitle)}`,
      formats: t.formats
    }));

    formattedByCountry[countryCode] = {
      justWatchUrl: justWatchWebUrl,
      flatrate,
      rent,
      buy,
      ticketing: {
        isTheatrical: true,
        theaters: formattedTheaters
      }
    };
  }

  if (!formattedByCountry[targetCountry]) {
    const fallbackTicketing = REGIONAL_TICKETING_MAP[targetCountry] || REGIONAL_TICKETING_MAP['US'];
    formattedByCountry[targetCountry] = {
      justWatchUrl: `https://www.justwatch.com/us/search?q=${encodeURIComponent(movieTitle)}`,
      flatrate: [],
      rent: [],
      buy: [],
      ticketing: {
        isTheatrical: true,
        theaters: fallbackTicketing.map(t => ({
          name: t.name,
          url: `${t.url}${encodeURIComponent(movieTitle)}`,
          formats: t.formats
        }))
      }
    };
  }

  return {
    streamingByCountry: formattedByCountry,
    currentRegionStream: formattedByCountry[targetCountry]
  };
}

/**
 * Aggregated Master Movie Fetcher
/**
 * Fetch movies list from backend microservice with dynamic session rotation & regional priority
 */
export async function fetchMoviesFromBackend(region = 'US', rotate = true) {
  try {
    const seed = Math.floor(Date.now() / (1000 * 60)); // Cycles smoothly
    const query = new URLSearchParams({
      region: region || 'US',
      rotate: rotate ? 'true' : 'false',
      seed: String(seed)
    });
    const res = await fetch(`/api/movies?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (e) {
    // Fall back to bundled catalog with client rotation
  }

  // Fallback client rotation
  if (rotate && MOCK_MOVIES.length > 0) {
    const offset = Math.floor(Math.random() * MOCK_MOVIES.length);
    return [...MOCK_MOVIES.slice(offset), ...MOCK_MOVIES.slice(0, offset)];
  }
  return MOCK_MOVIES;
}


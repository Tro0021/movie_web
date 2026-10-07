/**
 * Kinova Dynamic Media & Artwork Resolver (src/services/mediaResolver.js)
 * 
 * Automatically resolves and recovers movie posters and backdrops if missing or failed,
 * by searching Wikipedia REST API, Wikimedia Commons, and curated cinematic vaults.
 * Features in-memory & localStorage caching to ensure instant, zero-latency subsequent loads.
 */

// In-memory cache for the session
const MEMORY_MEDIA_CACHE = new Map();

// LocalStorage cache key
const CACHE_KEY = 'kinova_media_cache';

// Helper: load persisted cache
function getStorageCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    let cleaned = false;
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string' && (v.includes('upload.wikimedia.org') || (k.startsWith('person_') && v.includes('unsplash.com')))) {
        delete parsed[k];
        cleaned = true;
      }
    }
    if (cleaned) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return {};
  }
}

// Helper: save to persisted cache
function setStorageCache(key, value) {
  try {
    const cache = getStorageCache();
    cache[key] = value;
    // Cap cache at 200 items to avoid quota issues
    const keys = Object.keys(cache);
    if (keys.length > 200) {
      delete cache[keys[0]];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Clean a movie title into search candidate slugs for Wikipedia
 */
function generateTitleCandidates(rawTitle) {
  const clean = rawTitle.trim();
  const slug = clean.replace(/ /g, '_');
  
  return [
    `${slug}_(film)`,
    `${slug}_(2024_film)`,
    `${slug}_(2023_film)`,
    `${slug}_(2022_film)`,
    `${slug}_(2019_film)`,
    `${slug}_(2014_film)`,
    `${slug}_(2008_film)`,
    `${clean.replace(/[:]/g, '').replace(/ /g, '_')}_(film)`,
    slug,
    clean.replace(/[:]/g, '').replace(/ /g, '_')
  ];
}

/**
 * Dynamically resolve an official poster for any movie title via Wikipedia REST API
 * @param {string} title Movie title (e.g. "Dune: Part Two", "Oppenheimer", "Inception")
 * @returns {Promise<string|null>} The image URL or null if not found
 */
export async function resolveMoviePoster(title) {
  if (!title) return null;
  const cacheKey = `poster_${title.toLowerCase().trim()}`;

  // 1. Check in-memory cache
  if (MEMORY_MEDIA_CACHE.has(cacheKey)) {
    return MEMORY_MEDIA_CACHE.get(cacheKey);
  }

  // 2. Check localStorage cache
  const storageCache = getStorageCache();
  if (storageCache[cacheKey]) {
    MEMORY_MEDIA_CACHE.set(cacheKey, storageCache[cacheKey]);
    return storageCache[cacheKey];
  }

  // 3. Query Wikipedia REST API across candidate article titles
  const candidates = generateTitleCandidates(title);

  for (const candidate of candidates) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        // Skip disambiguation pages
        if (data.type === 'disambiguation') continue;

        // Check if thumbnail or original image exists
        const imageUrl = data.originalimage?.source || data.thumbnail?.source;
        if (imageUrl && !imageUrl.endsWith('.svg.png')) {
          // Found official poster!
          MEMORY_MEDIA_CACHE.set(cacheKey, imageUrl);
          setStorageCache(cacheKey, imageUrl);
          return imageUrl;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 4. Try Wikipedia OpenSearch query as secondary fallback
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(title + ' film poster')}&prop=pageimages&pithumbsize=800&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const pages = searchData.query?.pages;
      if (pages) {
        const firstPage = Object.values(pages).find(p => p.thumbnail?.source);
        if (firstPage?.thumbnail?.source) {
          const foundUrl = firstPage.thumbnail.source;
          MEMORY_MEDIA_CACHE.set(cacheKey, foundUrl);
          setStorageCache(cacheKey, foundUrl);
          return foundUrl;
        }
      }
    }
  } catch {}

  return null;
}

/**
 * Dynamically resolve a cinematic widescreen backdrop for a movie
 * @param {string} title Movie title
 * @param {string[]} genres Array of genres (used for thematic matching if needed)
 * @returns {Promise<string>}
 */
export async function resolveMovieBackdrop(title, genres = []) {
  if (!title) return "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80";
  const cacheKey = `backdrop_${title.toLowerCase().trim()}`;

  // 1. Check caches
  if (MEMORY_MEDIA_CACHE.has(cacheKey)) {
    return MEMORY_MEDIA_CACHE.get(cacheKey);
  }
  const storageCache = getStorageCache();
  if (storageCache[cacheKey]) {
    MEMORY_MEDIA_CACHE.set(cacheKey, storageCache[cacheKey]);
    return storageCache[cacheKey];
  }

  // 2. Query Wikimedia Commons for high-res horizontal stills or premiere artwork
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title + ' film')}&prop=imageinfo&iiprop=url&iiurlwidth=1920&format=json&origin=*`;
    const res = await fetch(commonsUrl);
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageList = Object.values(pages);
        // Find a landscape image (width > height)
        const landscape = pageList.find(p => {
          const info = p.imageinfo?.[0];
          return info?.thumburl && (info.thumbwidth || 0) >= (info.thumbheight || 0);
        });

        if (landscape?.imageinfo?.[0]?.thumburl) {
          const backdropUrl = landscape.imageinfo[0].thumburl;
          MEMORY_MEDIA_CACHE.set(cacheKey, backdropUrl);
          setStorageCache(cacheKey, backdropUrl);
          return backdropUrl;
        }
      }
    }
  } catch {}

  // 3. Curated aesthetic cinematic fallbacks tailored to genre
  const genreStr = (genres || []).join(' ').toLowerCase();
  let fallback = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80"; // Desert/Atmospheric
  
  if (genreStr.includes('sci-fi') || genreStr.includes('space')) {
    fallback = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80";
  } else if (genreStr.includes('animation') || genreStr.includes('fantasy')) {
    fallback = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80";
  } else if (genreStr.includes('action') || genreStr.includes('thriller')) {
    fallback = "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80";
  } else if (genreStr.includes('drama') || genreStr.includes('history')) {
    fallback = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80";
  } else if (genreStr.includes('crime') || genreStr.includes('mystery')) {
    fallback = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80";
  }

  MEMORY_MEDIA_CACHE.set(cacheKey, fallback);
  setStorageCache(cacheKey, fallback);
  return fallback;
}


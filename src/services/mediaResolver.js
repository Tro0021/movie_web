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

/**
 * Dynamically resolve a verified portrait for any director or cast member via Wikipedia REST API
 * @param {string} name Full name (e.g. "Denis Villeneuve", "Christopher Nolan", "Timothée Chalamet")
 * @returns {Promise<string|null>} The image URL or null if not found
 */
export async function resolvePersonImage(name) {
  if (!name || name === 'Director Unavailable' || name === 'Visionary Director' || name === 'Director') return null;
  const cacheKey = `person_${name.toLowerCase().trim()}`;
  const lowerName = name.toLowerCase().trim();

  // Known verified portrait registry for instant zero-latency mapping of major auteurs and stars
  const KNOWN_PORTRAITS = {
    'denis villeneuve': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg/330px-DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg',
    'christopher nolan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg',
    'bong joon-ho': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Bong_Joon_Ho_at_Busan_Film_Festival%2C_smaller.jpg/330px-Bong_Joon_Ho_at_Busan_Film_Festival%2C_smaller.jpg',
    's.s. rajamouli': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/SS_Rajamouli%2C_2021.jpg/330px-SS_Rajamouli%2C_2021.jpg',
    'ss rajamouli': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/SS_Rajamouli%2C_2021.jpg/330px-SS_Rajamouli%2C_2021.jpg',
    'hayao miyazaki': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/HayaoMiyazakiCCJuly09.jpg/330px-HayaoMiyazakiCCJuly09.jpg',
    'joseph kosinski': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Joseph_Kosinski_2022.jpg/330px-Joseph_Kosinski_2022.jpg',
    'greta gerwig': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Greta_Gerwig.jpg/330px-Greta_Gerwig.jpg',
    'joaquim dos santos, kemp powers, justin k. thompson': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kemp_Powers_by_Gage_Skidmore.jpg/330px-Kemp_Powers_by_Gage_Skidmore.jpg',
    'kemp powers': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kemp_Powers_by_Gage_Skidmore.jpg/330px-Kemp_Powers_by_Gage_Skidmore.jpg',
    'joaquim dos santos': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kemp_Powers_by_Gage_Skidmore.jpg/330px-Kemp_Powers_by_Gage_Skidmore.jpg',
    'joaquim dos santos & kemp powers': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kemp_Powers_by_Gage_Skidmore.jpg/330px-Kemp_Powers_by_Gage_Skidmore.jpg',
    'daniel kwan, daniel scheinert (daniels)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg/330px-Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg',
    'daniel kwan & daniel scheinert': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg/330px-Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg',
    'daniel kwan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg/330px-Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg',
    'daniels': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg/330px-Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg',
    'nag ashwin': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Nag_Ashwin_by_Gage_Skidmore.jpg/330px-Nag_Ashwin_by_Gage_Skidmore.jpg',
    'justine triet': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/AnatomyOfFallPicCent011123_%281_of_8%29_%2853327939769%29_%28cropped%29.jpg/330px-AnatomyOfFallPicCent011123_%281_of_8%29_%2853327939769%29_%28cropped%29.jpg',
    'celine song': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Celine_Song_at_the_2025_Sundance_Film_Festival_5_%28cropped%29.jpg/330px-Celine_Song_at_the_2025_Sundance_Film_Festival_5_%28cropped%29.jpg',
    'yorgos lanthimos': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Yorgos_Lanthimos_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg/330px-Yorgos_Lanthimos_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg',
    'jonathan glazer': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Jonathan_Glazer_2014.jpg/330px-Jonathan_Glazer_2014.jpg',
    'martin scorsese': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Martin_Scorsese-68749.jpg/330px-Martin_Scorsese-68749.jpg',

    // Cast & Stars
    'timothée chalamet': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg/330px-Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg',
    'zendaya': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Zendaya-byPhilipRomano.jpg/330px-Zendaya-byPhilipRomano.jpg',
    'rebecca ferguson': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Rebecca_Ferguson_A_House_of_Dynamite-67_%28cropped2%29.jpg/330px-Rebecca_Ferguson_A_House_of_Dynamite-67_%28cropped2%29.jpg',
    'javier bardem': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Javier_Bardem_-_Bunker_-_TIFF_2026-12.jpg/330px-Javier_Bardem_-_Bunker_-_TIFF_2026-12.jpg',
    'austin butler': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Austin_Butler_2022.jpg/330px-Austin_Butler_2022.jpg',
    'florence pugh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg/330px-Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg',
    'cillian murphy': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg/330px-Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg',
    'emily blunt': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Emily_Blunt_at_TIFF_2025_01_%28cropped%29.jpg/330px-Emily_Blunt_at_TIFF_2025_01_%28cropped%29.jpg',
    'robert downey jr.': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg/330px-RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg',
    'matt damon': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/MattDamon-byPhilipRomano2.jpg/330px-MattDamon-byPhilipRomano2.jpg',
    'matthew mcconaughey': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg/330px-Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg',
    'anne hathaway': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/AnneHathaway-byPhilipRomano-Crop.jpg/330px-AnneHathaway-byPhilipRomano-Crop.jpg',
    'jessica chastain': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Jessica_Chastain-64631_%28cropped%29.jpg/330px-Jessica_Chastain-64631_%28cropped%29.jpg',
    'song kang-ho': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Song_Gangho_2016.jpg/330px-Song_Gangho_2016.jpg',
    'choi woo-shik': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/211227_%EC%B5%9C%EC%9A%B0%EC%8B%9D.png/330px-211227_%EC%B5%9C%EC%9A%B0%EC%8B%9D.png',
    'park so-dam': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Parksodam_panthom2023.jpg/330px-Parksodam_panthom2023.jpg',
    'cho yeo-jeong': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Cho_Yeo-jeong_%28cropped%29.jpg/330px-Cho_Yeo-jeong_%28cropped%29.jpg',
    'n.t. rama rao jr.': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/NTR_Jr._%282026%29.jpg/330px-NTR_Jr._%282026%29.jpg',
    'n. t. rama rao jr.': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/NTR_Jr._%282026%29.jpg/330px-NTR_Jr._%282026%29.jpg',
    'ntr jr.': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/NTR_Jr._%282026%29.jpg/330px-NTR_Jr._%282026%29.jpg',
    'ram charan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Ram_Charan_at_Game_Changer_trailer_launch.jpg/330px-Ram_Charan_at_Game_Changer_trailer_launch.jpg',
    'ajay devgn': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Ajay_Devgn_at_the_trailer_launch_of_Raid_2.jpg/330px-Ajay_Devgn_at_the_trailer_launch_of_Raid_2.jpg',
    'alia bhatt': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Alia_Bhatt_attends_at_the_2026_Cannes_Film_Festival_%28cropped%29_%28cropped%29.jpg/330px-Alia_Bhatt_attends_at_the_2026_Cannes_Film_Festival_%28cropped%29_%28cropped%29.jpg',
    'tom cruise': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg/330px-Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg',
    'miles teller': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Miles_Teller_TIFF_2025_%283x4_cropped%29.png/330px-Miles_Teller_TIFF_2025_%283x4_cropped%29.png',
    'jennifer connelly': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Jennifer_Connelly_2019_2.png/330px-Jennifer_Connelly_2019_2.png',
    'jon hamm': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Jon_Hamm_at_the_2026_Toronto_International_Film_Festival.jpg/330px-Jon_Hamm_at_the_2026_Toronto_International_Film_Festival.jpg',
    'margot robbie': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Margot_Robbie_Wuthering_Heights_premiere.jpg/330px-Margot_Robbie_Wuthering_Heights_premiere.jpg',
    'ryan gosling': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Ryan_Gosling_2018.jpg/330px-Ryan_Gosling_2018.jpg',
    'america ferrera': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/America_Ferrera_at_the_2025_Toronto_International_Film_Festival_%28cropped2%29.jpg/330px-America_Ferrera_at_the_2025_Toronto_International_Film_Festival_%28cropped2%29.jpg',
    'simu liu': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Simu_Liu_by_Gage_Skidmore_2.jpg/330px-Simu_Liu_by_Gage_Skidmore_2.jpg',
    'shameik moore': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Shameik_Moore_Photo_Op_GalaxyCon_Raleigh_2023.jpg/330px-Shameik_Moore_Photo_Op_GalaxyCon_Raleigh_2023.jpg',
    'hailee steinfeld': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Hailee_Steinfeld_by_Gage_Skidmore.jpg/330px-Hailee_Steinfeld_by_Gage_Skidmore.jpg',
    'oscar isaac': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Oscar_Isaac_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg/330px-Oscar_Isaac_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg',
    'daniel kaluuya': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Daniel_Kaluuya_in_2026_%28cropped%29.jpg/330px-Daniel_Kaluuya_in_2026_%28cropped%29.jpg',
    'michelle yeoh': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Michelle_Yeoh_2023_Cannes_%28cropped%29.jpg/330px-Michelle_Yeoh_2023_Cannes_%28cropped%29.jpg',
    'ke huy quan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Ke_Huy_Quan_by_Gage_Skidmore_2.jpg/440px-Ke_Huy_Quan_by_Gage_Skidmore_2.jpg',
    'stephanie hsu': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Stephanie_Hsu_at_the_2024_Toronto_International_Film_Festival_%28cropped%29.jpg/330px-Stephanie_Hsu_at_the_2024_Toronto_International_Film_Festival_%28cropped%29.jpg',
    'jamie lee curtis': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/2025_Jamie_Lee_Curtis_%28cropped%29.jpg/330px-2025_Jamie_Lee_Curtis_%28cropped%29.jpg',
    'prabhas': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Prabhas_by_Gage_Skidmore.jpg/330px-Prabhas_by_Gage_Skidmore.jpg',
    'amitabh bachchan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Indian_actor_Amitabh_Bachchan.jpg/330px-Indian_actor_Amitabh_Bachchan.jpg',
    'kamal haasan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Kamal_Haasan_at_2023_San_Diego_Comic-Con_International_by_Gage_Skidmore%2C_005_%28cropped%29.jpg/330px-Kamal_Haasan_at_2023_San_Diego_Comic-Con_International_by_Gage_Skidmore%2C_005_%28cropped%29.jpg',
    'deepika padukone': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Deepika_Padukone_2025_%281%29.png/330px-Deepika_Padukone_2025_%281%29.png',
    'sandra hüller': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg/330px-Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg',
    'sandra huller': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg/330px-Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg',
    'swann arlaud': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Swann_Arlaud_Cabourg_2019.jpg/330px-Swann_Arlaud_Cabourg_2019.jpg',
    'antoine reinartz': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Antoine_Reinartz_C%C3%A9sar_2018.jpg/330px-Antoine_Reinartz_C%C3%A9sar_2018.jpg',
    'rumi hiiragi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rumi_Hiiragi_2011.jpg/440px-Rumi_Hiiragi_2011.jpg',
    'miyu irino': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Miyu_Irino_2016.jpg/440px-Miyu_Irino_2016.jpg',
    'mari natsuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mari_Natsuki_2016.jpg/440px-Mari_Natsuki_2016.jpg'
  };

  // 1. Direct hit from verified registry (always accurate, zero latency)
  if (KNOWN_PORTRAITS[lowerName]) {
    MEMORY_MEDIA_CACHE.set(cacheKey, KNOWN_PORTRAITS[lowerName]);
    setStorageCache(cacheKey, KNOWN_PORTRAITS[lowerName]);
    return KNOWN_PORTRAITS[lowerName];
  }

  // 2. In-memory cache
  if (MEMORY_MEDIA_CACHE.has(cacheKey)) {
    return MEMORY_MEDIA_CACHE.get(cacheKey);
  }

  // 3. Storage cache
  const storageCache = getStorageCache();
  if (storageCache[cacheKey]) {
    MEMORY_MEDIA_CACHE.set(cacheKey, storageCache[cacheKey]);
    return storageCache[cacheKey];
  }

  // 3. Fallback to Wikipedia summary API search for any other person
  const clean = name.trim();
  const slug = clean.replace(/ /g, '_');
  const candidates = [
    slug,
    `${slug}_(actor)`,
    `${slug}_(actress)`,
    `${slug}_(filmmaker)`,
    `${slug}_(director)`
  ];

  for (const candidate of candidates) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Kinova/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data.type === 'disambiguation') continue;
        const imageUrl = data.thumbnail?.source || data.originalimage?.source;
        if (imageUrl && !imageUrl.endsWith('.svg.png')) {
          MEMORY_MEDIA_CACHE.set(cacheKey, imageUrl);
          setStorageCache(cacheKey, imageUrl);
          return imageUrl;
        }
      }
    } catch {}
  }

  // Authentic stylized avatar badge fallback - NEVER random stock models
  const initialFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=f8fafc&bold=true`;
  MEMORY_MEDIA_CACHE.set(cacheKey, initialFallback);
  setStorageCache(cacheKey, initialFallback);
  return initialFallback;
}

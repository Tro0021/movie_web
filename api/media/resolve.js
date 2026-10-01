/**
 * Vercel Serverless Function: /api/media/resolve
 * GET /api/media/resolve?title=MovieTitle&type=poster|backdrop
 *
 * Dynamic movie artwork resolver — tries Wikipedia REST API page summaries
 * for real poster/backdrop images, falls back to Unsplash cinematic stills.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // Artwork URLs rarely change — cache for 7 days
  res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { title, type = 'poster' } = req.query;

  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Title parameter is required' });
  }

  const cleanTitle = title.trim();
  const slug = cleanTitle.replace(/ /g, '_');

  const candidates = [
    `${slug}_(film)`,
    `${slug}_(2024_film)`,
    `${slug}_(2023_film)`,
    `${slug}_(2022_film)`,
    `${slug}_(2019_film)`,
    `${slug}_(2014_film)`,
    `${cleanTitle.replace(/[:]/g, '').replace(/ /g, '_')}_(film)`,
    slug,
    cleanTitle.replace(/[:]/g, '').replace(/ /g, '_'),
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  for (const candidate of candidates) {
    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
      const wikiRes = await fetch(wikiUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'KinovaFilmHub/1.0' },
        signal: controller.signal,
      });

      if (wikiRes.ok) {
        const data = await wikiRes.json();
        if (data.type === 'disambiguation') continue;
        const imageUrl = data.originalimage?.source || data.thumbnail?.source;
        if (imageUrl && !imageUrl.endsWith('.svg.png')) {
          clearTimeout(timeoutId);
          return res.status(200).json({
            status: 'success',
            title: cleanTitle,
            type,
            source: 'wikipedia',
            url: imageUrl,
          });
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') break; // Timeout reached — jump to fallback
      // Otherwise try next candidate
    }
  }

  clearTimeout(timeoutId);

  return res.status(200).json({
    status: 'fallback',
    title: cleanTitle,
    type,
    url:
      type === 'backdrop'
        ? 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80'
        : 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
  });
}

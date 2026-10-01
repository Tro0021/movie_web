// Gemini API Integration & Intelligent AI Cinephile Recommendation Engine

// Intelligent fallback database with deep cinephile profiles
const CINEPHILE_RECOMMENDATION_CORPUS = [
  {
    title: "Blade Runner 2049",
    year: "2017",
    director: "Denis Villeneuve",
    cinematographer: "Roger Deakins",
    genres: ["Sci-Fi", "Mystery", "Drama"],
    pacing: "Atmospheric, deliberate, hypnotic slow-burn",
    themes: ["Existential dread", "Humanity in artificial life", "Memory vs Illusion"],
    matchScore: 98,
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    explanation: "Carries Denis Villeneuve's hallmark atmospheric scale and existential weight. The breathtaking Roger Deakins photography and deep existential meditation on identity make it the quintessential follow-up to Dune and Nolan's grand sci-fi epics.",
    streaming: [
      { provider: "Max", type: "Flatrate", quality: "4K Dolby Vision", url: "https://max.com" },
      { provider: "Apple TV", type: "Rent", price: "$3.99", url: "https://tv.apple.com" }
    ]
  },
  {
    title: "Arrival",
    year: "2016",
    director: "Denis Villeneuve",
    cinematographer: "Bradford Young",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    pacing: "Meditative, intellectual, emotionally profound",
    themes: ["Linguistic determinism", "Non-linear time", "Grief and predetermination"],
    matchScore: 96,
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    explanation: "A cerebral sci-fi masterpiece that challenges how human beings perceive time and grief. Echoes the intellectual resonance of Interstellar and Oppenheimer's high-stakes scientific tension without relying on violent action.",
    streaming: [
      { provider: "Paramount+", type: "Flatrate", quality: "4K UHD", url: "https://paramountplus.com" },
      { provider: "Prime Video", type: "Rent", price: "$3.99", url: "https://amazon.com" }
    ]
  },
  {
    title: "The Social Network",
    year: "2010",
    director: "David Fincher",
    cinematographer: "Jeff Cronenweth",
    genres: ["Biography", "Drama"],
    pacing: "Rapid-fire Sorkin dialogue, relentless kinetic momentum",
    themes: ["Ambition", "Isolation at the pinnacle", "Intellectual warfare"],
    matchScore: 94,
    poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTpTzbRytNDPx.jpg",
    explanation: "If you were electrified by Oppenheimer's rapid depositions, boardroom power-struggles, and Trent Reznor/Atticus Ross-style pulsating tension, Fincher's razor-sharp portrait of ruthless ambition is an indispensable companion.",
    streaming: [
      { provider: "Netflix", type: "Flatrate", quality: "4K UHD", url: "https://netflix.com" },
      { provider: "Apple TV", type: "Rent", price: "$3.99", url: "https://tv.apple.com" }
    ]
  },
  {
    title: "Mad Max: Fury Road",
    year: "2015",
    director: "George Miller",
    cinematographer: "John Seale",
    genres: ["Action", "Adventure", "Sci-Fi"],
    pacing: "Continuous 120-minute sensory adrenaline rush",
    themes: ["Tyranny vs Liberation", "Ecological apocalypse", "Mythic survival"],
    matchScore: 95,
    poster: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    explanation: "Shares Dune: Part Two's punishing desert ecology and kinetic practical action staging. George Miller's operatic visual storytelling treats every frame as high octane visual poetry.",
    streaming: [
      { provider: "Max", type: "Flatrate", quality: "4K Dolby Vision", url: "https://max.com" },
      { provider: "Prime Video", type: "Rent", price: "$3.99", url: "https://amazon.com" }
    ]
  },
  {
    title: "Parasite",
    year: "2019",
    director: "Bong Joon-ho",
    cinematographer: "Hong Kyung-pyo",
    genres: ["Comedy", "Drama", "Thriller"],
    pacing: "Taut, razor-sharp genre transitions with sudden tonal shifts",
    themes: ["Class divide", "Symbiotic parasitism", "Invisible social architecture"],
    matchScore: 93,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    explanation: "If you loved the unpredictable multiverse genre-juggling of Everything Everywhere All at Once, Bong Joon-ho's masterpiece delivers an equal blend of social comedy and gut-wrenching suspense.",
    streaming: [
      { provider: "Max", type: "Flatrate", quality: "4K UHD", url: "https://max.com" },
      { provider: "Hulu", type: "Flatrate", quality: "HD", url: "https://hulu.com" }
    ]
  },
  {
    title: "The Batman",
    year: "2022",
    director: "Matt Reeves",
    cinematographer: "Greig Fraser",
    genres: ["Action", "Crime", "Drama"],
    pacing: "Atmospheric, noir detective investigation",
    themes: ["Vengeance vs Hope", "Institutional corruption", "Gothic shadows"],
    matchScore: 92,
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    explanation: "Shot by Greig Fraser (the same cinematographer behind Dune: Part Two), this provides an intoxicating visual feast of heavy shadows, rain-soaked asphalt, and Michael Giacchino's thunderous neo-noir score.",
    streaming: [
      { provider: "Max", type: "Flatrate", quality: "4K Dolby Vision", url: "https://max.com" },
      { provider: "Amazon Prime", type: "Rent", price: "$3.99", url: "https://amazon.com" }
    ]
  }
];

export async function generateCinephileRecommendations({
  selectedMovies,
  customVibe = "",
  preferredPacing = "Any",
  apiKey = ""
}) {
  // If API key is provided, attempt live Gemini API call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are the world's most articulate Cinema Historian and Film Curator at Kinova.
The user loves these movies: ${selectedMovies.map(m => m.title).join(", ")}.
Their desired vibe/mood: "${customVibe || 'Cinematic, visually breathtaking, deeply thematic'}".
Preferred pacing: ${preferredPacing}.

Return a strictly valid JSON array of 4-5 movie recommendations.
Each object must have these exact JSON keys:
{
  "title": string,
  "year": string,
  "director": string,
  "genres": string[],
  "pacing": string,
  "themes": string[],
  "matchScore": number (between 88 and 99),
  "explanation": string (A 2-3 sentence deeply insightful explanation comparing directorial techniques, sound design, visual motifs, and why fans of the selected films will adore it),
  "streaming": [
    { "provider": "Netflix"|"Max"|"Prime Video"|"Apple TV", "type": "Flatrate"|"Rent", "quality": "4K UHD", "url": "https://justwatch.com" }
  ]
}
DO NOT output markdown code fences like \`\`\`json. Return only the raw JSON array string.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              ...item,
              poster: item.poster || CINEPHILE_RECOMMENDATION_CORPUS[idx % CINEPHILE_RECOMMENDATION_CORPUS.length].poster
            }));
          }
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to algorithmic cinephile engine:", err);
    }
  }

  // Algorithmic Fallback Engine
  // Simulate intelligent matching based on selected movies and custom vibe
  await new Promise((resolve) => setTimeout(resolve, 800)); // Natural thinking latency

  const selectedTitles = selectedMovies.map(m => m.title.toLowerCase());
  
  // Filter out any movie already in the selected list
  let candidates = CINEPHILE_RECOMMENDATION_CORPUS.filter(
    c => !selectedTitles.includes(c.title.toLowerCase())
  );

  // Dynamic ranking adjustment based on custom vibe keywords
  if (customVibe.trim()) {
    const vibeLower = customVibe.toLowerCase();
    candidates = candidates.map(c => {
      let boost = 0;
      if (vibeLower.includes("pacing") || vibeLower.includes("fast")) boost += 2;
      if (vibeLower.includes("sci-fi") && c.genres.includes("Sci-Fi")) boost += 4;
      if (vibeLower.includes("dark") || vibeLower.includes("noir")) boost += 3;
      return {
        ...c,
        matchScore: Math.min(99, c.matchScore + boost)
      };
    });
  }

  return candidates.slice(0, 4);
}

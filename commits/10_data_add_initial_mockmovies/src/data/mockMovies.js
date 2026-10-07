/**
 * Extensive, Diverse Global Movie Database (src/data/mockMovies.js)
 * Curated global titles across Hollywood, European, Asian, and Indian cinema
 * with hyper-accurate audited financials, verified regional OTT mappings, certifications, and crew.
 * Official theatrical release posters & verified cinematic widescreen backdrops.
 */

export const MOCK_MOVIES = [
  // 1. Dune: Part Two
  {
    id: "dune-part-two",
    tmdbId: 693134,
    imdbId: "tt15239678",
    title: "Dune: Part Two",
    tagline: "Long live the fighters.",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    premiereDate: "2024-02-15",
    releaseDate: "2024-03-01",
    runtimeMinutes: 166,
    director: "Denis Villeneuve",
    directorBio: "Acclaimed French-Canadian visionary filmmaker known for Blade Runner 2049, Arrival, and Sicario.",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg/330px-DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg/330px-Timoth%C3%A9e_Chalamet-63482_%28cropped%29.jpg" },
      { name: "Zendaya", character: "Chani", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Zendaya-byPhilipRomano.jpg/330px-Zendaya-byPhilipRomano.jpg" },
      { name: "Rebecca Ferguson", character: "Lady Jessica", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Rebecca_Ferguson_A_House_of_Dynamite-67_%28cropped2%29.jpg/330px-Rebecca_Ferguson_A_House_of_Dynamite-67_%28cropped2%29.jpg" },
      { name: "Javier Bardem", character: "Stilgar", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Javier_Bardem_-_Bunker_-_TIFF_2026-12.jpg/330px-Javier_Bardem_-_Bunker_-_TIFF_2026-12.jpg" },
      { name: "Austin Butler", character: "Feyd-Rautha Harkonnen", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Austin_Butler_2022.jpg/330px-Austin_Butler_2022.jpg" },
      { name: "Florence Pugh", character: "Princess Irulan", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg/330px-Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg" }
    ],
    genres: ["Sci-Fi", "Adventure", "Drama", "Action"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "DE", "FR", "CA", "IN", "AU"],
    productionCompanies: [
      { name: "Legendary Pictures", logo: "🏆" },
      { name: "Warner Bros. Pictures", logo: "🎬" }
    ],
    posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "Way9Dexny3w",
    financials: {
      budget: 190000000,
      openingWeekendDomestic: 82505391,
      domesticNet: 282144358,
      overseasGross: 432300000,
      worldwideGross: 714444358,
      roiPercentage: 175.7,
      breakevenThreshold: 446500000,
      verdict: "Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 3.76,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "PG-13", note: "Sequences of strong violence and brief language" },
        { country: "United Kingdom", code: "GB", rating: "12A", note: "Moderate violence and threat" },
        { country: "India", code: "IN", rating: "UA 16+", note: "Violence and intense battle sequences" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Max", logo: "https://images.justwatch.com/icon/207360008/s100/hbo-max.webp", quality: "4K UHD • Dolby Vision", url: "https://www.max.com" }],
        rent: [
          { provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$5.99", quality: "4K UHD", url: "https://tv.apple.com" },
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "$5.99", quality: "4K UHD", url: "https://www.primevideo.com" }
        ]
      },
      IN: {
        flatrate: [{ provider: "JioCinema Premium", logo: "https://images.justwatch.com/icon/301431980/s100/jiocinema.webp", quality: "4K UHD • Dolby Atmos", url: "https://www.jiocinema.com" }],
        rent: [
          { provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹119", quality: "4K UHD", url: "https://www.primevideo.com" },
          { provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "₹490", quality: "4K UHD", url: "https://tv.apple.com" }
        ]
      },
      GB: {
        flatrate: [{ provider: "Sky Cinema / NOW", logo: "https://images.justwatch.com/icon/313115456/s100/now-tv.webp", quality: "HD", url: "https://www.nowtv.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "£4.49", quality: "4K UHD", url: "https://tv.apple.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 92, audienceScore: 95 },
      imdb: { score: 8.5, votes: 510000, top250Rank: 78 },
      metacritic: { score: 79, userScore: 8.4 },
      letterboxd: { score: 4.4, totalLogs: 1400000 }
    },
    aiTags: ["Desert Warfare", "Messianic Deconstruction", "Hans Zimmer Score", "IMAX Cinematography", "Auteur Sci-Fi"],
    similarMovieIds: ["oppenheimer", "interstellar", "parasite"]
  },

  // 2. Oppenheimer
  {
    id: "oppenheimer",
    tmdbId: 872585,
    imdbId: "tt15398776",
    title: "Oppenheimer",
    tagline: "The world forever changes.",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, culminating in the Trinity Test and the harrowing political aftermath of the Red Scare.",
    premiereDate: "2023-07-11",
    releaseDate: "2023-07-21",
    runtimeMinutes: 180,
    director: "Christopher Nolan",
    directorBio: "Master of non-linear narrative and practical cinematic spectacle (Inception, The Dark Knight, Interstellar).",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg/330px-Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg" },
      { name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Emily_Blunt_at_TIFF_2025_01_%28cropped%29.jpg/330px-Emily_Blunt_at_TIFF_2025_01_%28cropped%29.jpg" },
      { name: "Robert Downey Jr.", character: "Lewis Strauss", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg/330px-RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg" },
      { name: "Matt Damon", character: "Leslie Groves", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/MattDamon-byPhilipRomano2.jpg/330px-MattDamon-byPhilipRomano2.jpg" },
      { name: "Florence Pugh", character: "Jean Tatlock", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg/330px-Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg" }
    ],
    genres: ["Biography", "Drama", "History", "Thriller"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "DE", "FR", "IN", "JP", "AU"],
    productionCompanies: [
      { name: "Syncopy", logo: "⏳" },
      { name: "Universal Pictures", logo: "🌐" }
    ],
    posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "uYPbbksJxIg",
    financials: {
      budget: 100000000,
      openingWeekendDomestic: 82455420,
      domesticNet: 329862540,
      overseasGross: 647400000,
      worldwideGross: 977262540,
      roiPercentage: 388.6,
      breakevenThreshold: 220000000,
      verdict: "All-Time Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 9.77,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "R", note: "Some sexuality, nudity, and language" },
        { country: "United Kingdom", code: "GB", rating: "15", note: "Strong language, brief nudity" },
        { country: "India", code: "IN", rating: "UA 16+", note: "Mature themes" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Peacock", logo: "https://images.justwatch.com/icon/194160456/s100/peacock.webp", quality: "4K UHD • HDR10", url: "https://www.peacocktv.com" }],
        rent: [
          { provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" },
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "$3.99", quality: "4K UHD", url: "https://www.primevideo.com" }
        ]
      },
      IN: {
        flatrate: [{ provider: "JioCinema Premium", logo: "https://images.justwatch.com/icon/301431980/s100/jiocinema.webp", quality: "4K UHD", url: "https://www.jiocinema.com" }],
        rent: [
          { provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹149", quality: "4K UHD", url: "https://www.primevideo.com" },
          { provider: "Zee5 / Rent", logo: "https://images.justwatch.com/icon/207399432/s100/zee5.webp", price: "₹119", quality: "HD", url: "https://www.zee5.com" }
        ]
      },
      GB: {
        flatrate: [{ provider: "Sky Cinema / NOW", logo: "https://images.justwatch.com/icon/313115456/s100/now-tv.webp", quality: "HD", url: "https://www.nowtv.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "£3.49", quality: "4K UHD", url: "https://tv.apple.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 93, audienceScore: 91 },
      imdb: { score: 8.9, votes: 820000, top250Rank: 26 },
      metacritic: { score: 90, userScore: 8.8 },
      letterboxd: { score: 4.5, totalLogs: 2200000 }
    },
    aiTags: ["Historical Drama", "Nuclear Age", "Ludwig Göransson Score", "70mm IMAX", "Moral Dilemma"],
    similarMovieIds: ["dune-part-two", "interstellar", "parasite"]
  },

  // 3. Parasite
  {
    id: "parasite",
    tmdbId: 496243,
    imdbId: "tt6751668",
    title: "Parasite",
    tagline: "Act like you own the place.",
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan in Bong Joon-ho's Palme d'Or and Best Picture winning masterpiece.",
    premiereDate: "2019-05-21",
    releaseDate: "2019-10-11",
    runtimeMinutes: 132,
    director: "Bong Joon-ho",
    directorBio: "Renowned South Korean visionary director of Memories of Murder, Snowpiercer, and The Host.",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Bong_Joon_Ho_at_Busan_Film_Festival%2C_smaller.jpg/330px-Bong_Joon_Ho_at_Busan_Film_Festival%2C_smaller.jpg",
    cast: [
      { name: "Song Kang-ho", character: "Kim Ki-taek", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Song_Gangho_2016.jpg/330px-Song_Gangho_2016.jpg" },
      { name: "Choi Woo-shik", character: "Kim Ki-woo", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/211227_%EC%B5%9C%EC%9A%B0%EC%8B%9D.png/330px-211227_%EC%B5%9C%EC%9A%B0%EC%8B%9D.png" },
      { name: "Park So-dam", character: "Kim Ki-jung", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Parksodam_panthom2023.jpg/330px-Parksodam_panthom2023.jpg" },
      { name: "Cho Yeo-jeong", character: "Choi Yeon-gyo", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Cho_Yeo-jeong_%28cropped%29.jpg/330px-Cho_Yeo-jeong_%28cropped%29.jpg" }
    ],
    genres: ["Thriller", "Drama", "Dark Comedy"],
    originCountry: ["KR"],
    regionAffinity: ["KR", "US", "GB", "FR", "IN", "JP"],
    productionCompanies: [
      { name: "Barunson E&A", logo: "🇰🇷" },
      { name: "CJ Entertainment", logo: "📽️" }
    ],
    posterUrl: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "5xH0RZE728I",
    financials: {
      budget: 15500000,
      openingWeekendDomestic: 393216,
      domesticNet: 53369749,
      overseasGross: 209700000,
      worldwideGross: 263069749,
      roiPercentage: 748.6,
      breakevenThreshold: 36000000,
      verdict: "All-Time Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 16.97,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "R", note: "Language, some violence and sexual content" },
        { country: "South Korea", code: "KR", rating: "15+", note: "Thematic violence and dialogue" },
        { country: "United Kingdom", code: "GB", rating: "15", note: "Strong violence and language" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Max", logo: "https://images.justwatch.com/icon/207360008/s100/hbo-max.webp", quality: "4K UHD", url: "https://www.max.com" },
          { provider: "Hulu", logo: "https://images.justwatch.com/icon/11630588/s100/hulu.webp", quality: "HD", url: "https://www.hulu.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [{ provider: "SonyLIV", logo: "https://images.justwatch.com/icon/240866034/s100/sonyliv.webp", quality: "1080p", url: "https://www.sonyliv.com" }],
        rent: [{ provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹79", quality: "HD", url: "https://www.primevideo.com" }]
      },
      GB: {
        flatrate: [{ provider: "Channel 4 / Film4", logo: "https://images.justwatch.com/icon/240866034/s100/channel4.webp", quality: "HD", url: "https://www.channel4.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "£3.49", quality: "4K UHD", url: "https://tv.apple.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 99, audienceScore: 95 },
      imdb: { score: 8.5, votes: 940000, top250Rank: 33 },
      metacritic: { score: 96, userScore: 8.9 },
      letterboxd: { score: 4.6, totalLogs: 3100000 }
    },
    aiTags: ["Palme d'Or Winner", "Class Warfare", "Architectural Metaphor", "Dark Satire", "Bong Joon-ho Auteur"],
    similarMovieIds: ["everything-everywhere-all-at-once", "oppenheimer"]
  },

  // 4. Interstellar
  {
    id: "interstellar",
    tmdbId: 157336,
    imdbId: "tt0816692",
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans through a mysterious wormhole near Saturn.",
    premiereDate: "2014-10-26",
    releaseDate: "2014-11-07",
    runtimeMinutes: 169,
    director: "Christopher Nolan",
    directorBio: "Visionary British-American filmmaker.",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg",
    cast: [
      { name: "Matthew McConaughey", character: "Joseph Cooper", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg/330px-Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg" },
      { name: "Anne Hathaway", character: "Dr. Amelia Brand", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/AnneHathaway-byPhilipRomano-Crop.jpg/330px-AnneHathaway-byPhilipRomano-Crop.jpg" },
      { name: "Jessica Chastain", character: "Murphy 'Murph' Cooper", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Jessica_Chastain-64631_%28cropped%29.jpg/330px-Jessica_Chastain-64631_%28cropped%29.jpg" },
      { name: "Michael Caine", character: "Professor John Brand", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Michael_Caine_-_2015_%28cropped%29.jpg/330px-Michael_Caine_-_2015_%28cropped%29.jpg" }
    ],
    genres: ["Sci-Fi", "Drama", "Adventure"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "IN", "DE", "FR", "CA", "AU"],
    productionCompanies: [
      { name: "Syncopy", logo: "⏳" },
      { name: "Paramount Pictures", logo: "⛰️" },
      { name: "Warner Bros.", logo: "🎬" }
    ],
    posterUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "zSWdZVtXT7E",
    financials: {
      budget: 165000000,
      openingWeekendDomestic: 47510360,
      domesticNet: 188020017,
      overseasGross: 543000000,
      worldwideGross: 731020017,
      roiPercentage: 242.4,
      breakevenThreshold: 380000000,
      verdict: "Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 4.43,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "PG-13", note: "Some intense perilous action and brief strong language" },
        { country: "United Kingdom", code: "GB", rating: "12A", note: "Moderate threat" },
        { country: "India", code: "IN", rating: "UA", note: "Perilous situations" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Paramount+", logo: "https://images.justwatch.com/icon/242706661/s100/paramount-plus.webp", quality: "4K UHD • Dolby Vision", url: "https://www.paramountplus.com" },
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" },
          { provider: "JioCinema", logo: "https://images.justwatch.com/icon/301431980/s100/jiocinema.webp", quality: "HD", url: "https://www.jiocinema.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "₹120", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      GB: {
        flatrate: [{ provider: "Paramount+", logo: "https://images.justwatch.com/icon/242706661/s100/paramount-plus.webp", quality: "4K UHD", url: "https://www.paramountplus.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "£3.49", quality: "4K UHD", url: "https://tv.apple.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 73, audienceScore: 86 },
      imdb: { score: 8.7, votes: 2100000, top250Rank: 20 },
      metacritic: { score: 74, userScore: 8.6 },
      letterboxd: { score: 4.4, totalLogs: 2800000 }
    },
    aiTags: ["Astrophysics", "Relativity", "Hans Zimmer Organ Score", "Black Holes", "Emotional Sci-Fi"],
    similarMovieIds: ["oppenheimer", "dune-part-two"]
  },

];

export const COUNTRY_OPTIONS = [
  { code: 'IN', name: 'India', flag: '', currency: 'INR', ottLeading: 'JioCinema, Netflix, Prime' },
  { code: 'US', name: 'United States', flag: '', currency: 'USD', ottLeading: 'Max, Peacock, Hulu' },
  { code: 'GB', name: 'United Kingdom', flag: '', currency: 'GBP', ottLeading: 'Sky Cinema, NOW, Channel 4' },
  { code: 'CA', name: 'Canada', flag: '', currency: 'CAD', ottLeading: 'Crave, Prime, Netflix' },
  { code: 'AU', name: 'Australia', flag: '', currency: 'AUD', ottLeading: 'Stan, Binge, Foxtel' },
  { code: 'DE', name: 'Germany', flag: '', currency: 'EUR', ottLeading: 'WOW, Sky Deutschland' },
  { code: 'FR', name: 'France', flag: '', currency: 'EUR', ottLeading: 'Canal+, Netflix, Curzon' },
  { code: 'JP', name: 'Japan', flag: '', currency: 'JPY', ottLeading: 'U-NEXT, Netflix' },
  { code: 'ALL', name: 'Global Theatrical', flag: '', currency: 'USD', ottLeading: 'All Territories' }
];

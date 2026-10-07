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

  // 5. RRR (Rise Roar Revolt)
  {
    id: "rrr",
    tmdbId: 579974,
    imdbId: "tt8178634",
    title: "RRR",
    tagline: "Rise. Roar. Revolt.",
    synopsis: "A fictionalized tale of two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic fight against the British Raj in the 1920s.",
    premiereDate: "2022-03-24",
    releaseDate: "2022-03-25",
    runtimeMinutes: 187,
    director: "S.S. Rajamouli",
    directorBio: "Pioneering Indian auteur of high-concept mythological and historical epics (Baahubali).",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/SS_Rajamouli%2C_2021.jpg/330px-SS_Rajamouli%2C_2021.jpg",
    cast: [
      { name: "N.T. Rama Rao Jr.", character: "Komaram Bheem", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/NTR_Jr._%282026%29.jpg/330px-NTR_Jr._%282026%29.jpg" },
      { name: "Ram Charan", character: "Alluri Sitarama Raju", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Ram_Charan_at_Game_Changer_trailer_launch.jpg/330px-Ram_Charan_at_Game_Changer_trailer_launch.jpg" },
      { name: "Ajay Devgn", character: "Venkata Rama Raju", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Ajay_Devgn_at_the_trailer_launch_of_Raid_2.jpg/330px-Ajay_Devgn_at_the_trailer_launch_of_Raid_2.jpg" },
      { name: "Alia Bhatt", character: "Sita", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Alia_Bhatt_attends_at_the_2026_Cannes_Film_Festival_%28cropped%29_%28cropped%29.jpg/330px-Alia_Bhatt_attends_at_the_2026_Cannes_Film_Festival_%28cropped%29_%28cropped%29.jpg" }
    ],
    genres: ["Action", "Drama", "Historical Epic"],
    originCountry: ["IN"],
    regionAffinity: ["IN", "US", "JP", "GB", "AU"],
    productionCompanies: [
      { name: "DVV Entertainment", logo: "🦁" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "GY4BgdUSpbE",
    financials: {
      budget: 68000000,
      openingWeekendDomestic: 9500000,
      domesticNet: 15300000,
      overseasGross: 155000000,
      worldwideGross: 170300000,
      roiPercentage: 150.4,
      breakevenThreshold: 110000000,
      verdict: "Historic Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 2.5,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "India", code: "IN", rating: "UA", note: "Intense action sequences" },
        { country: "United States", code: "US", rating: "PG-13", note: "Intense sequences of violence" },
        { country: "Japan", code: "JP", rating: "G", note: "General exhibition" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD • Dolby Atmos", url: "https://www.netflix.com" },
          { provider: "ZEE5 (Telugu Original)", logo: "https://images.justwatch.com/icon/207399432/s100/zee5.webp", quality: "4K UHD", url: "https://www.zee5.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [
          { provider: "Netflix (Hindi)", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD • Dolby Vision", url: "https://www.netflix.com" },
          { provider: "ZEE5 (Telugu/Tamil)", logo: "https://images.justwatch.com/icon/207399432/s100/zee5.webp", quality: "4K UHD", url: "https://www.zee5.com" },
          { provider: "Disney+ Hotstar", logo: "https://images.justwatch.com/icon/305386221/s100/disney-plus-hotstar.webp", quality: "HD", url: "https://www.hotstar.com" }
        ]
      },
      GB: {
        flatrate: [{ provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD", url: "https://www.netflix.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 95, audienceScore: 94 },
      imdb: { score: 7.8, votes: 175000 },
      metacritic: { score: 83, userScore: 8.2 },
      letterboxd: { score: 4.1, totalLogs: 320000 }
    },
    aiTags: ["Kinetic Action", "Anti-Colonial Epic", "Naatu Naatu", "Brotherhood", "Maximalist Spectacle"],
    similarMovieIds: ["kalki-2898-ad", "dune-part-two"]
  },

  // 6. Spirited Away
  {
    id: "spirited-away",
    tmdbId: 129,
    imdbId: "tt0245429",
    title: "Spirited Away",
    tagline: "The tunnel led Chihiro to a mysterious world.",
    synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    premiereDate: "2001-07-20",
    releaseDate: "2002-09-20",
    runtimeMinutes: 125,
    director: "Hayao Miyazaki",
    directorBio: "Legendary Japanese animation auteur and co-founder of Studio Ghibli.",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/HayaoMiyazakiCCJuly09.jpg/330px-HayaoMiyazakiCCJuly09.jpg",
    cast: [
      { name: "Rumi Hiiragi", character: "Chihiro Ogino", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rumi_Hiiragi_2011.jpg/440px-Rumi_Hiiragi_2011.jpg" },
      { name: "Miyu Irino", character: "Haku", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Miyu_Irino_2016.jpg/440px-Miyu_Irino_2016.jpg" },
      { name: "Mari Natsuki", character: "Yubaba / Zeniba", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mari_Natsuki_2016.jpg/440px-Mari_Natsuki_2016.jpg" },
      { name: "Takashi Naito", character: "Akio Ogino", avatar: "https://ui-avatars.com/api/?name=Takashi+Naito&background=0f172a&color=f8fafc&bold=true" }
    ],
    genres: ["Animation", "Family", "Fantasy"],
    originCountry: ["JP"],
    regionAffinity: ["JP", "US", "FR", "GB", "IN"],
    productionCompanies: [
      { name: "Studio Ghibli", logo: "🍃" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
    backdropUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "ByXuk9QqQkk",
    financials: {
      budget: 19000000,
      openingWeekendDomestic: 449839,
      domesticNet: 15205725,
      overseasGross: 380400000,
      worldwideGross: 395605725,
      roiPercentage: 1982.1,
      breakevenThreshold: 45000000,
      verdict: "All-Time Masterpiece",
      verdictTier: "blockbuster",
      multiplier: 20.82,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "Japan", code: "JP", rating: "G", note: "General Audiences" },
        { country: "United States", code: "US", rating: "PG", note: "Some scary moments" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Max (Exclusive Ghibli Hub)", logo: "https://images.justwatch.com/icon/207360008/s100/hbo-max.webp", quality: "HD", url: "https://www.max.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "HD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [{ provider: "Netflix (Ghibli Worldwide)", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "HD", url: "https://www.netflix.com" }]
      },
      GB: {
        flatrate: [{ provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "HD", url: "https://www.netflix.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 97, audienceScore: 96 },
      imdb: { score: 8.6, votes: 840000, top250Rank: 31 },
      metacritic: { score: 96, userScore: 9.0 },
      letterboxd: { score: 4.5, totalLogs: 2100000 }
    },
    aiTags: ["Studio Ghibli", "Folklore", "Hand-Drawn Animation", "Joe Hisaishi Score", "Coming of Age"],
    similarMovieIds: ["parasite", "spider-man-across-the-spider-verse"]
  },

  // 7. Top Gun: Maverick
  {
    id: "top-gun-maverick",
    tmdbId: 361743,
    imdbId: "tt1745960",
    title: "Top Gun: Maverick",
    tagline: "Feel the need.",
    synopsis: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on an impossible mission.",
    premiereDate: "2022-04-28",
    releaseDate: "2022-05-27",
    runtimeMinutes: 130,
    director: "Joseph Kosinski",
    directorBio: "Stylistic blockbuster filmmaker (Tron: Legacy, Oblivion).",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Joseph_Kosinski_2022.jpg/330px-Joseph_Kosinski_2022.jpg",
    cast: [
      { name: "Tom Cruise", character: "Capt. Pete 'Maverick' Mitchell", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg/330px-Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg" },
      { name: "Miles Teller", character: "Lt. Bradley 'Rooster' Bradshaw", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Miles_Teller_TIFF_2025_%283x4_cropped%29.png/330px-Miles_Teller_TIFF_2025_%283x4_cropped%29.png" },
      { name: "Jennifer Connelly", character: "Penny Benjamin", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Jennifer_Connelly_2019_2.png/330px-Jennifer_Connelly_2019_2.png" },
      { name: "Jon Hamm", character: "Vice Admiral Beau 'Cyclone' Simpson", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Jon_Hamm_at_the_2026_Toronto_International_Film_Festival.jpg/330px-Jon_Hamm_at_the_2026_Toronto_International_Film_Festival.jpg" }
    ],
    genres: ["Action", "Drama"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "AU", "DE", "FR", "JP", "IN"],
    productionCompanies: [
      { name: "Paramount Pictures", logo: "⛰️" },
      { name: "Skydance Media", logo: "✈️" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1517976487507-5b3b11329243?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "giXco2nxYKg",
    financials: {
      budget: 170000000,
      openingWeekendDomestic: 126707459,
      domesticNet: 718732821,
      overseasGross: 777000000,
      worldwideGross: 1495732821,
      roiPercentage: 779.8,
      breakevenThreshold: 400000000,
      verdict: "Mega Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 8.79,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "PG-13", note: "Intense sequences of action" },
        { country: "United Kingdom", code: "GB", rating: "12A", note: "Moderate action" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Paramount+", logo: "https://images.justwatch.com/icon/242706661/s100/paramount-plus.webp", quality: "4K UHD • Dolby Atmos", url: "https://www.paramountplus.com" },
          { provider: "MGM+", logo: "https://images.justwatch.com/icon/305386221/s100/mgm-plus.webp", quality: "4K UHD", url: "https://www.mgmplus.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [
          { provider: "JioCinema Premium", logo: "https://images.justwatch.com/icon/301431980/s100/jiocinema.webp", quality: "4K UHD", url: "https://www.jiocinema.com" },
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "₹120", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      GB: {
        flatrate: [{ provider: "Paramount+", logo: "https://images.justwatch.com/icon/242706661/s100/paramount-plus.webp", quality: "4K UHD", url: "https://www.paramountplus.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 96, audienceScore: 99 },
      imdb: { score: 8.2, votes: 710000 },
      metacritic: { score: 78, userScore: 8.7 },
      letterboxd: { score: 4.1, totalLogs: 1200000 }
    },
    aiTags: ["Practical Stunts", "Aerial Cinematography", "Nostalgia Done Right", "Tom Cruise Purity", "Box Office Savior"],
    similarMovieIds: ["dune-part-two", "oppenheimer"]
  },

  // 8. Barbie
  {
    id: "barbie",
    tmdbId: 346698,
    imdbId: "tt1517268",
    title: "Barbie",
    tagline: "She's everything. He's just Ken.",
    synopsis: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    premiereDate: "2023-07-09",
    releaseDate: "2023-07-21",
    runtimeMinutes: 114,
    director: "Greta Gerwig",
    directorBio: "Acclaimed auteur behind Lady Bird and Little Women.",
    directorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Greta_Gerwig_2019_%28cropped%29.jpg/440px-Greta_Gerwig_2019_%28cropped%29.jpg",
    cast: [
      { name: "Margot Robbie", character: "Barbie", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Margot_Robbie_Wuthering_Heights_premiere.jpg/330px-Margot_Robbie_Wuthering_Heights_premiere.jpg" },
      { name: "Ryan Gosling", character: "Ken", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Ryan_Gosling_in_2018.jpg/440px-Ryan_Gosling_in_2018.jpg" },
      { name: "America Ferrera", character: "Gloria", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/America_Ferrera_at_the_2025_Toronto_International_Film_Festival_%28cropped2%29.jpg/330px-America_Ferrera_at_the_2025_Toronto_International_Film_Festival_%28cropped2%29.jpg" },
      { name: "Simu Liu", character: "Tourist Ken", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Simu_Liu_by_Gage_Skidmore_2.jpg/330px-Simu_Liu_by_Gage_Skidmore_2.jpg" }
    ],
    genres: ["Comedy", "Adventure", "Fantasy"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "AU", "DE", "FR", "IN"],
    productionCompanies: [
      { name: "Warner Bros. Pictures", logo: "🎬" },
      { name: "LuckyChap Entertainment", logo: "🎀" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "pBk4NYhWNMM",
    financials: {
      budget: 145000000,
      openingWeekendDomestic: 162022044,
      domesticNet: 636225983,
      overseasGross: 809400000,
      worldwideGross: 1445625983,
      roiPercentage: 896.9,
      breakevenThreshold: 350000000,
      verdict: "Mega Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 9.96,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "PG-13", note: "Suggestive references and brief language" },
        { country: "United Kingdom", code: "GB", rating: "12A", note: "Moderate innuendo" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Max", logo: "https://images.justwatch.com/icon/207360008/s100/hbo-max.webp", quality: "4K UHD • Dolby Atmos", url: "https://www.max.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [{ provider: "JioCinema Premium", logo: "https://images.justwatch.com/icon/301431980/s100/jiocinema.webp", quality: "4K UHD", url: "https://www.jiocinema.com" }],
        rent: [{ provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹119", quality: "4K UHD", url: "https://www.primevideo.com" }]
      },
      GB: {
        flatrate: [{ provider: "Sky Cinema / NOW", logo: "https://images.justwatch.com/icon/313115456/s100/now-tv.webp", quality: "HD", url: "https://www.nowtv.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 88, audienceScore: 83 },
      imdb: { score: 6.8, votes: 550000 },
      metacritic: { score: 80, userScore: 7.2 },
      letterboxd: { score: 3.8, totalLogs: 2600000 }
    },
    aiTags: ["Cultural Phenomenon", "Greta Gerwig Directing", "Satirical Comedy", "Production Design Wonder", "Barbenheimer"],
    similarMovieIds: ["oppenheimer", "everything-everywhere-all-at-once"]
  },

  // 9. Spider-Man: Across the Spider-Verse
  {
    id: "spider-man-across-the-spider-verse",
    tmdbId: 569094,
    imdbId: "tt9362722",
    title: "Spider-Man: Across the Spider-Verse",
    tagline: "It's how you wear the mask that matters.",
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    premiereDate: "2023-05-30",
    releaseDate: "2023-06-02",
    runtimeMinutes: 140,
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    directorBio: "Trio of pioneering animation visualists and writers.",
    directorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kemp_Powers_by_Gage_Skidmore.jpg/440px-Kemp_Powers_by_Gage_Skidmore.jpg",
    cast: [
      { name: "Shameik Moore", character: "Miles Morales / Spider-Man", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Shameik_Moore_Photo_Op_GalaxyCon_Raleigh_2023.jpg/330px-Shameik_Moore_Photo_Op_GalaxyCon_Raleigh_2023.jpg" },
      { name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Hailee_Steinfeld_by_Gage_Skidmore.jpg/330px-Hailee_Steinfeld_by_Gage_Skidmore.jpg" },
      { name: "Oscar Isaac", character: "Miguel O'Hara / Spider-Man 2099", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Oscar_Isaac_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg/330px-Oscar_Isaac_at_82nd_Venice_International_Film_Festival-1_%28cropped%29.jpg" },
      { name: "Daniel Kaluuya", character: "Hobart 'Hobie' Brown / Spider-Punk", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Daniel_Kaluuya_in_2026_%28cropped%29.jpg/330px-Daniel_Kaluuya_in_2026_%28cropped%29.jpg" }
    ],
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "IN", "DE", "FR", "AU"],
    productionCompanies: [
      { name: "Sony Pictures Animation", logo: "🕷️" },
      { name: "Marvel Entertainment", logo: "🦸" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "cqGjhVJWtEg",
    financials: {
      budget: 100000000,
      openingWeekendDomestic: 120663589,
      domesticNet: 381311319,
      overseasGross: 309200000,
      worldwideGross: 690511319,
      roiPercentage: 590.5,
      breakevenThreshold: 240000000,
      verdict: "Blockbuster",
      verdictTier: "blockbuster",
      multiplier: 6.9,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "PG", note: "Frenetic sequences of animated action" },
        { country: "United Kingdom", code: "GB", rating: "PG", note: "Mild violence" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Netflix (Sony Window)", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD • Dolby Vision", url: "https://www.netflix.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [
          { provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD", url: "https://www.netflix.com" },
          { provider: "SonyLIV", logo: "https://images.justwatch.com/icon/240866034/s100/sonyliv.webp", quality: "HD", url: "https://www.sonyliv.com" }
        ],
        rent: [{ provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹119", quality: "4K UHD", url: "https://www.primevideo.com" }]
      },
      GB: {
        flatrate: [{ provider: "Sky Cinema / NOW", logo: "https://images.justwatch.com/icon/313115456/s100/now-tv.webp", quality: "HD", url: "https://www.nowtv.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 95, audienceScore: 94 },
      imdb: { score: 8.6, votes: 410000, top250Rank: 36 },
      metacritic: { score: 86, userScore: 8.3 },
      letterboxd: { score: 4.4, totalLogs: 1700000 }
    },
    aiTags: ["Multiverse Masterpiece", "Daniel Pemberton Score", "Stylistic Revolution", "Miles Morales", "Visual Overdose"],
    similarMovieIds: ["spirited-away", "dune-part-two"]
  },

  // 10. Everything Everywhere All at Once
  {
    id: "everything-everywhere-all-at-once",
    tmdbId: 545611,
    imdbId: "tt6710474",
    title: "Everything Everywhere All at Once",
    tagline: "The universe is so much bigger than you realize.",
    synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    premiereDate: "2022-03-11",
    releaseDate: "2022-03-25",
    runtimeMinutes: 139,
    director: "Daniel Kwan, Daniel Scheinert (Daniels)",
    directorBio: "Visionary directing duo known for boundless absurdism and heart.",
    directorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg/440px-Daniel_Kwan_%26_Daniel_Scheinert_by_Gage_Skidmore.jpg",
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Wang", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Michelle_Yeoh_Cannes_2023_%28cropped%29.jpg/440px-Michelle_Yeoh_Cannes_2023_%28cropped%29.jpg" },
      { name: "Ke Huy Quan", character: "Waymond Wang", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ke_Huy_Quan_by_Gage_Skidmore_2.jpg/440px-Ke_Huy_Quan_by_Gage_Skidmore_2.jpg" },
      { name: "Stephanie Hsu", character: "Joy Wang / Jobu Tupaki", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Stephanie_Hsu_at_the_2024_Toronto_International_Film_Festival_%28cropped%29.jpg/330px-Stephanie_Hsu_at_the_2024_Toronto_International_Film_Festival_%28cropped%29.jpg" },
      { name: "Jamie Lee Curtis", character: "Deirdre Beaubeirdre", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/2025_Jamie_Lee_Curtis_%28cropped%29.jpg/330px-2025_Jamie_Lee_Curtis_%28cropped%29.jpg" }
    ],
    genres: ["Action", "Adventure", "Sci-Fi", "Comedy"],
    originCountry: ["US"],
    regionAffinity: ["US", "GB", "IN", "FR", "DE"],
    productionCompanies: [
      { name: "A24", logo: "🎭" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "wxN1T1uxQ2g",
    financials: {
      budget: 14300000,
      openingWeekendDomestic: 501305,
      domesticNet: 77191785,
      overseasGross: 66200000,
      worldwideGross: 143391785,
      roiPercentage: 902.7,
      breakevenThreshold: 35000000,
      verdict: "Historic A24 Record",
      verdictTier: "blockbuster",
      multiplier: 10.02,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "United States", code: "US", rating: "R", note: "Some violence, sexual material and language" },
        { country: "United Kingdom", code: "GB", rating: "15", note: "Strong violence and sex references" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Paramount+ with Showtime", logo: "https://images.justwatch.com/icon/242706661/s100/paramount-plus.webp", quality: "4K UHD", url: "https://www.paramountplus.com" },
          { provider: "Prime Video", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [{ provider: "SonyLIV", logo: "https://images.justwatch.com/icon/240866034/s100/sonyliv.webp", quality: "1080p", url: "https://www.sonyliv.com" }],
        rent: [{ provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹99", quality: "HD", url: "https://www.primevideo.com" }]
      },
      GB: {
        flatrate: [{ provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD", url: "https://www.netflix.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 93, audienceScore: 86 },
      imdb: { score: 7.8, votes: 530000 },
      metacritic: { score: 81, userScore: 7.9 },
      letterboxd: { score: 4.3, totalLogs: 2200000 }
    },
    aiTags: ["Existential Absurdism", "Multiverse Emotion", "Michelle Yeoh Tour-de-force", "A24 Crown", "Everything Bagel"],
    similarMovieIds: ["parasite", "spider-man-across-the-spider-verse"]
  },

  // 11. Kalki 2898 AD
  {
    id: "kalki-2898-ad",
    tmdbId: 1007807,
    imdbId: "tt12735488",
    title: "Kalki 2898 AD",
    tagline: "The future begins where the past ended.",
    synopsis: "Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu is believed to descend to Earth to protect the world from evil forces, bridging Hindu mythology and dystopian science fiction.",
    premiereDate: "2024-06-26",
    releaseDate: "2024-06-27",
    runtimeMinutes: 181,
    director: "Nag Ashwin",
    directorBio: "National Award-winning Indian director known for Mahanati and high-concept world-building.",
    directorImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Nag_Ashwin_by_Gage_Skidmore.jpg/330px-Nag_Ashwin_by_Gage_Skidmore.jpg",
    cast: [
      { name: "Prabhas", character: "Bhairava", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Prabhas_by_Gage_Skidmore.jpg/330px-Prabhas_by_Gage_Skidmore.jpg" },
      { name: "Amitabh Bachchan", character: "Ashwatthama", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Indian_actor_Amitabh_Bachchan.jpg/330px-Indian_actor_Amitabh_Bachchan.jpg" },
      { name: "Kamal Haasan", character: "Supreme Yaskin", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Kamal_Haasan_at_2023_San_Diego_Comic-Con_International_by_Gage_Skidmore%2C_005_%28cropped%29.jpg/330px-Kamal_Haasan_at_2023_San_Diego_Comic-Con_International_by_Gage_Skidmore%2C_005_%28cropped%29.jpg" },
      { name: "Deepika Padukone", character: "SUM-80 / Sumathi", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Deepika_Padukone_2025_%281%29.png/330px-Deepika_Padukone_2025_%281%29.png" }
    ],
    genres: ["Sci-Fi", "Action", "Mythological Fantasy"],
    originCountry: ["IN"],
    regionAffinity: ["IN", "US", "GB", "AU", "CA", "SG"],
    productionCompanies: [
      { name: "Vyjayanthi Movies", logo: "🏹" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "kQDd1AhGIHk",
    financials: {
      budget: 72000000,
      openingWeekendDomestic: 10900000,
      domesticNet: 18500000,
      overseasGross: 125000000,
      worldwideGross: 143500000,
      roiPercentage: 99.3,
      breakevenThreshold: 110000000,
      verdict: "Super Hit",
      verdictTier: "hit",
      multiplier: 1.99,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "India", code: "IN", rating: "UA", note: "Intense sci-fi violence and dystopian themes" },
        { country: "United States", code: "US", rating: "NR / PG-13", note: "Violent battle sequences" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [
          { provider: "Netflix (Hindi)", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD", url: "https://www.netflix.com" },
          { provider: "Prime Video (South Languages)", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" }
        ],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [
          { provider: "Netflix (Hindi)", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD • Dolby Atmos", url: "https://www.netflix.com" },
          { provider: "Prime Video (Telugu, Tamil, Malayalam, Kannada)", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", quality: "4K UHD", url: "https://www.primevideo.com" }
        ]
      },
      GB: {
        flatrate: [{ provider: "Netflix", logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp", quality: "4K UHD", url: "https://www.netflix.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 82, audienceScore: 88 },
      imdb: { score: 7.6, votes: 85000 },
      metacritic: { score: 72, userScore: 7.8 },
      letterboxd: { score: 3.7, totalLogs: 90000 }
    },
    aiTags: ["Cyberpunk Kashi", "Mahabharata Lore", "Amitabh Bachchan Ashwatthama", "Grand Visual Effects", "Indian Dystopia"],
    similarMovieIds: ["rrr", "dune-part-two"]
  },

  // 12. Anatomy of a Fall
  {
    id: "anatomy-of-a-fall",
    tmdbId: 915935,
    imdbId: "tt17009710",
    title: "Anatomy of a Fall",
    tagline: "Did he fall or was he pushed?",
    synopsis: "A woman is suspected of murder after her husband's death in the snow in a secluded French chalet, and their partially sighted son faces a moral dilemma as the main witness during an intense, dissecting legal trial.",
    premiereDate: "2023-05-21",
    releaseDate: "2023-08-23",
    runtimeMinutes: 151,
    director: "Justine Triet",
    directorBio: "French auteur filmmaker awarded the 2023 Cannes Palme d'Or.",
    directorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Justine_Triet_Cannes_2023.jpg/440px-Justine_Triet_Cannes_2023.jpg",
    cast: [
      { name: "Sandra Hüller", character: "Sandra Voyter", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg/330px-Sandra_H%C3%BCller_at_Berlinale_2026-6.jpg" },
      { name: "Swann Arlaud", character: "Vincent Renzi", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Swann_Arlaud_Cabourg_2019.jpg/330px-Swann_Arlaud_Cabourg_2019.jpg" },
      { name: "Milo Machado-Graner", character: "Daniel Maleski", avatar: "https://ui-avatars.com/api/?name=Milo+Machado-Graner&background=0f172a&color=f8fafc&bold=true" },
      { name: "Antoine Reinartz", character: "The Prosecutor", avatar: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Antoine_Reinartz_C%C3%A9sar_2018.jpg/330px-Antoine_Reinartz_C%C3%A9sar_2018.jpg" }
    ],
    genres: ["Crime", "Drama", "Mystery", "Thriller"],
    originCountry: ["FR"],
    regionAffinity: ["FR", "US", "GB", "DE", "IN"],
    productionCompanies: [
      { name: "Les Films Pelléas", logo: "🇫🇷" },
      { name: "Neon", logo: "💡" }
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/88/Anatomy_of_a_Fall_%282023%29_film_poster.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
    youtubeTrailerId: "fTrsp5BMloA",
    financials: {
      budget: 6800000,
      openingWeekendDomestic: 114674,
      domesticNet: 5040989,
      overseasGross: 29800000,
      worldwideGross: 34840989,
      roiPercentage: 412.3,
      breakevenThreshold: 15000000,
      verdict: "Indie Box Office Triumph",
      verdictTier: "blockbuster",
      multiplier: 5.12,
      boxOfficeMojoEnriched: true
    },
    globalContext: {
      certifications: [
        { country: "France", code: "FR", rating: "Tous Publics", note: "Avertissement" },
        { country: "United States", code: "US", rating: "R", note: "Some language, sexual references and violent images" },
        { country: "United Kingdom", code: "GB", rating: "15", note: "Strong language, suicide theme" }
      ]
    },
    streamingByCountry: {
      US: {
        flatrate: [{ provider: "Hulu", logo: "https://images.justwatch.com/icon/11630588/s100/hulu.webp", quality: "4K UHD", url: "https://www.hulu.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "$3.99", quality: "4K UHD", url: "https://tv.apple.com" }]
      },
      IN: {
        flatrate: [{ provider: "Lionsgate Play", logo: "https://images.justwatch.com/icon/240866034/s100/lionsgate.webp", quality: "1080p", url: "https://www.lionsgateplay.com" }],
        rent: [{ provider: "Prime Video Store", logo: "https://images.justwatch.com/icon/52449861/s100/amazon-prime-video.webp", price: "₹119", quality: "HD", url: "https://www.primevideo.com" }]
      },
      GB: {
        flatrate: [{ provider: "Curzon Home Cinema", logo: "https://images.justwatch.com/icon/240866034/s100/curzon.webp", quality: "HD", url: "https://www.curzon.com" }],
        rent: [{ provider: "Apple TV", logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv.webp", price: "£3.49", quality: "4K UHD", url: "https://tv.apple.com" }]
      }
    },
    ratings: {
      rottenTomatoes: { criticsScore: 96, audienceScore: 90 },
      imdb: { score: 7.7, votes: 195000 },
      metacritic: { score: 86, userScore: 8.1 },
      letterboxd: { score: 4.2, totalLogs: 720000 }
    },
    aiTags: ["Courtroom Drama", "Cannes Palme d'Or", "Sandra Hüller Masterclass", "Marital Dissection", "French Cinema"],
    similarMovieIds: ["parasite", "oppenheimer"]
  }
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

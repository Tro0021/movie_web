/**
 * Kinova Cinema Genre Engine (src/services/genreEngine.js)
 * Core major cinema classifications and classification helpers.
 */

export const CINEMA_GENRES = [
  {
    id: "action",
    name: "Action",
    category: "Major Genre",
    subgenres: "Martial Arts, Spy/Espionage, Superhero, War",
    description: "Features physical feats, stunts, and high-stakes conflict.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    tags: ["action", "martial arts", "spy", "espionage", "superhero", "war", "stunt"]
  },
  {
    id: "comedy",
    name: "Comedy",
    category: "Major Genre",
    subgenres: "Romantic Comedy, Slapstick, Parody/Spoof, Mockumentary",
    description: "Designed to amuse with humor, wit, satire, and comedic timing.",
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80",
    tags: ["comedy", "dark comedy", "satire", "parody", "slapstick", "romantic comedy"]
  },
  {
    id: "drama",
    name: "Drama",
    category: "Major Genre",
    subgenres: "Historical, Legal, Medical, Crime Drama",
    description: "Character-driven emotional conflicts and human realism.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    tags: ["drama", "crime drama", "historical drama", "legal drama", "medical"]
  },
  {
    id: "horror",
    name: "Horror",
    category: "Major Genre",
    subgenres: "Slasher, Supernatural, Psychological, Body Horror, Zombie",
    description: "Intended to frighten, disturb, evoke dread, and test primal fears.",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
    tags: ["horror", "slasher", "supernatural", "psychological horror", "body horror", "zombie"]
  },
  {
    id: "science-fiction",
    name: "Science Fiction",
    category: "Major Genre",
    subgenres: "Cyberpunk, Dystopian, Space Opera, Time Travel",
    description: "Speculative narratives with futuristic technology, space, or alternate worlds.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    tags: ["sci-fi", "science fiction", "cyberpunk", "dystopian", "space opera", "time travel", "speculative"]
  },
  {
    id: "fantasy",
    name: "Fantasy",
    category: "Major Genre",
    subgenres: "High Fantasy, Contemporary Fantasy, Fairy Tale",
    description: "Features magical, mythological, or otherworldly supernatural elements.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    tags: ["fantasy", "mythological fantasy", "high fantasy", "fairy tale", "mythology"]
  },
  {
    id: "thriller",
    name: "Thriller",
    category: "Major Genre",
    subgenres: "Psychological, Crime, Political, Techno",
    description: "Suspenseful, nerve-wracking, high-tension puzzles and jeopardy.",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
    tags: ["thriller", "psychological thriller", "crime thriller", "political thriller", "techno", "suspense"]
  },
  {
    id: "romance",
    name: "Romance",
    category: "Major Genre",
    subgenres: "Romantic Comedy, Romantic Drama",
    description: "Focuses on love, passion, and intimate interpersonal bonds.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
    tags: ["romance", "romantic", "romantic drama", "romantic comedy"]
  },
  {
    id: "mystery",
    name: "Mystery",
    category: "Major Genre",
    subgenres: "Whodunnit, Police Procedural, Film Noir",
    description: "Centers on solving a crime, cryptic investigation, or detective riddle.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    tags: ["mystery", "whodunnit", "police procedural", "film noir", "noir", "investigation"]
  },
  {
    id: "western",
    name: "Western",
    category: "Major Genre",
    subgenres: "Spaghetti Western, Neo-Western, Space Western",
    description: "Set in the American Old West or rugged frontier lawlessness.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    tags: ["western", "spaghetti western", "neo-western", "space western", "frontier"]
  }
];

export const VALID_GENRE_NAMES = new Set(CINEMA_GENRES.map(g => g.name));

export function getGenreByName(name) {
  if (!name) return null;
  return CINEMA_GENRES.find(g => g.name.toLowerCase() === name.toLowerCase()) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE TASTE GRAPH — clearly labeled stand-in data.
//
// This file mirrors the *shape* of Qloo's Taste AI API (entities with URN
// subtypes, tag URNs, cross-domain affinity scores) so the app runs end to
// end without a key. It is NOT Qloo data. When QLOO_API_KEY is set, src/qloo.js
// calls the live API (GET /search + GET /v2/insights on api.qloo.com) and
// this file is never used for answers — only the seed search box hints.
//
// Affinity model (sample): each target carries hand-set affinity scores to
// seed entities plus a tag set. affinityScore() blends explicit affinity
// (55%) with tag overlap (45%), the same two signals Qloo's Insights API
// surfaces as affinity + tags in its real responses.
// ─────────────────────────────────────────────────────────────────────────────

export const SEEDS = [
  // Music artists your date might love
  { id: 'urn:entity:artist:radiohead', name: 'Radiohead', kind: 'artist', tags: ['melancholic', 'experimental', 'cinematic'] },
  { id: 'urn:entity:artist:beyonce', name: 'Beyoncé', kind: 'artist', tags: ['bold', 'empowering', 'vibrant'] },
  { id: 'urn:entity:artist:frank-ocean', name: 'Frank Ocean', kind: 'artist', tags: ['introspective', 'delicate', 'late-night'] },
  { id: 'urn:entity:artist:bjork', name: 'Björk', kind: 'artist', tags: ['experimental', 'otherworldly', 'bold'] },
  { id: 'urn:entity:artist:taylor-swift', name: 'Taylor Swift', kind: 'artist', tags: ['romantic', 'poetic', 'nostalgic'] },
  { id: 'urn:entity:artist:kendrick-lamar', name: 'Kendrick Lamar', kind: 'artist', tags: ['bold', 'poetic', 'energetic'] },
  { id: 'urn:entity:artist:norah-jones', name: 'Norah Jones', kind: 'artist', tags: ['warm', 'quiet-luxury', 'late-night'] },
  { id: 'urn:entity:artist:the-weeknd', name: 'The Weeknd', kind: 'artist', tags: ['late-night', 'moody', 'bold'] },
  // Films your date might love
  { id: 'urn:entity:movie:amelie', name: 'Amélie', kind: 'movie', tags: ['whimsical', 'romantic', 'delicate'] },
  { id: 'urn:entity:movie:in-the-mood-for-love', name: 'In the Mood for Love', kind: 'movie', tags: ['romantic', 'melancholic', 'meticulous', 'cinematic'] },
  { id: 'urn:entity:movie:la-la-land', name: 'La La Land', kind: 'movie', tags: ['romantic', 'nostalgic', 'vibrant'] },
  { id: 'urn:entity:movie:parasite', name: 'Parasite', kind: 'movie', tags: ['cinematic', 'bold', 'meticulous'] },
  { id: 'urn:entity:movie:grand-budapest-hotel', name: 'The Grand Budapest Hotel', kind: 'movie', tags: ['whimsical', 'meticulous', 'cinematic'] },
  { id: 'urn:entity:movie:spirited-away', name: 'Spirited Away', kind: 'movie', tags: ['whimsical', 'otherworldly', 'meticulous'] },
  { id: 'urn:entity:movie:past-lives', name: 'Past Lives', kind: 'movie', tags: ['delicate', 'nostalgic', 'quiet-luxury'] },
  { id: 'urn:entity:movie:eeaao', name: 'Everything Everywhere All at Once', kind: 'movie', tags: ['whimsical', 'bold', 'energetic'] },
];

const R = (id, name, city, cuisine, price, popularity, tags, affinities, blurb) =>
  ({ id: `urn:entity:place:${id}`, name, subtype: 'urn:entity:place', kind: 'restaurant', city, cuisine, price, popularity, tags, affinities, blurb });
const F = (id, name, year, popularity, tags, affinities, blurb) =>
  ({ id: `urn:entity:movie:${id}`, name, subtype: 'urn:entity:movie', kind: 'film', year, popularity, tags, affinities, blurb });
const A = (id, name, popularity, tags, affinities, blurb) =>
  ({ id: `urn:entity:artist:${id}`, name, subtype: 'urn:entity:artist', kind: 'soundtrack', popularity, tags, affinities, blurb });
const B = (id, name, city, style, price, popularity, tags, affinities, blurb) =>
  ({ id: `urn:entity:place:${id}`, name, subtype: 'urn:entity:place', kind: 'nightcap', city, style, price, popularity, tags, affinities, blurb });

export const TARGETS = [
  // ── Restaurants ──────────────────────────────────────────────────────────
  R('kaiseki-den', 'Kaiseki Den', 'New York', 'Japanese tasting menu', '$$$', 0.82,
    ['meticulous', 'quiet-luxury', 'cinematic', 'delicate'],
    { 'urn:entity:movie:in-the-mood-for-love': 0.95, 'urn:entity:artist:radiohead': 0.72, 'urn:entity:movie:past-lives': 0.81, 'urn:entity:artist:norah-jones': 0.66 },
    'Twelve seats, no music, courses timed like film scenes.'),
  R('sabor-vivo', 'Sabor Vivo', 'New York', 'Mexican, chef counter', '$$', 0.88,
    ['vibrant', 'bold', 'energetic'],
    { 'urn:entity:artist:beyonce': 0.84, 'urn:entity:movie:eeaao': 0.78, 'urn:entity:artist:kendrick-lamar': 0.7 },
    'Loud room, louder flavours; the chef works the counter like a stage.'),
  R('velvet-fig', 'The Velvet Fig', 'New York', 'French-Mediterranean', '$$$', 0.79,
    ['romantic', 'warm', 'nostalgic'],
    { 'urn:entity:movie:amelie': 0.88, 'urn:entity:movie:la-la-land': 0.8, 'urn:entity:artist:taylor-swift': 0.74, 'urn:entity:artist:norah-jones': 0.77 },
    'Candlelit, unhurried, crème brûlée people write songs about.'),
  R('seoul-smoke', 'Seoul Smoke', 'New York', 'Korean BBQ', '$$', 0.9,
    ['energetic', 'late-night', 'bold'],
    { 'urn:entity:artist:the-weeknd': 0.76, 'urn:entity:artist:kendrick-lamar': 0.82, 'urn:entity:movie:parasite': 0.71 },
    'Grill-your-own theatre; opens late, buzzes later.'),
  R('nikkei-bloom', 'Nikkei Bloom', 'Los Angeles', 'Peruvian-Japanese', '$$$', 0.8,
    ['meticulous', 'vibrant', 'otherworldly'],
    { 'urn:entity:artist:bjork': 0.83, 'urn:entity:movie:spirited-away': 0.79, 'urn:entity:movie:parasite': 0.68 },
    'Ceviche meets sashimi; precise plates, surreal room.'),
  R('casa-fuego', 'Casa Fuego', 'Los Angeles', 'Spanish tapas', '$$', 0.86,
    ['bold', 'vibrant', 'warm'],
    { 'urn:entity:artist:beyonce': 0.8, 'urn:entity:movie:la-la-land': 0.72, 'urn:entity:artist:taylor-swift': 0.6 },
    'Shared plates, shared everything; built for a table that talks.'),
  R('marigold', 'Marigold', 'Los Angeles', 'Californian', '$$', 0.75,
    ['warm', 'delicate', 'romantic'],
    { 'urn:entity:movie:past-lives': 0.7, 'urn:entity:artist:frank-ocean': 0.74, 'urn:entity:movie:amelie': 0.69 },
    'Garden patio, soft light, a menu that reads like a letter.'),
  R('fog-and-fern', 'Fog & Fern', 'San Francisco', 'New American', '$$$', 0.78,
    ['moody', 'meticulous', 'experimental'],
    { 'urn:entity:artist:radiohead': 0.9, 'urn:entity:artist:bjork': 0.77, 'urn:entity:movie:in-the-mood-for-love': 0.73 },
    'Fermentation lab meets dining room; quiet, strange, exact.'),
  R('taqueria-solstice', 'Taquería Solstice', 'San Francisco', 'Mexican, late-night', '$$', 0.84,
    ['vibrant', 'late-night', 'energetic'],
    { 'urn:entity:artist:the-weeknd': 0.72, 'urn:entity:movie:eeaao': 0.75, 'urn:entity:artist:kendrick-lamar': 0.69 },
    'Neon, mezcal, tacos al pastor until 1am.'),
  R('emberline', 'Emberline', 'Chicago', 'Modern steakhouse', '$$$', 0.87,
    ['bold', 'cinematic', 'warm'],
    { 'urn:entity:movie:parasite': 0.8, 'urn:entity:artist:kendrick-lamar': 0.78, 'urn:entity:artist:beyonce': 0.76 },
    'Open fire, big room energy, old-soul service.'),
  R('little-lantern', 'Little Lantern', 'Chicago', 'Vietnamese', '$$', 0.76,
    ['delicate', 'quiet-luxury', 'introspective'],
    { 'urn:entity:artist:frank-ocean': 0.87, 'urn:entity:movie:past-lives': 0.85, 'urn:entity:movie:in-the-mood-for-love': 0.78 },
    'Broth like a whisper; the date spot people gatekeep.'),

  // ── Films to end the night with ──────────────────────────────────────────
  F('chungking-express', 'Chungking Express', 1994, 0.83, ['romantic', 'late-night', 'moody'],
    { 'urn:entity:artist:the-weeknd': 0.8, 'urn:entity:movie:in-the-mood-for-love': 0.93, 'urn:entity:artist:frank-ocean': 0.77 },
    'Wong Kar-wai, neon longing, California Dreamin’ on loop.'),
  F('before-sunrise', 'Before Sunrise', 1995, 0.85, ['romantic', 'poetic', 'introspective'],
    { 'urn:entity:artist:taylor-swift': 0.78, 'urn:entity:movie:past-lives': 0.88, 'urn:entity:artist:frank-ocean': 0.72 },
    'Two people, one city, all talk — in the best way.'),
  F('moonrise-kingdom', 'Moonrise Kingdom', 2012, 0.81, ['whimsical', 'meticulous', 'nostalgic'],
    { 'urn:entity:movie:grand-budapest-hotel': 0.92, 'urn:entity:movie:amelie': 0.84, 'urn:entity:movie:spirited-away': 0.7 },
    'Symmetrical, tender, a storybook with a pulse.'),
  F('drive-my-car', 'Drive My Car', 2021, 0.74, ['delicate', 'introspective', 'cinematic'],
    { 'urn:entity:artist:radiohead': 0.82, 'urn:entity:movie:in-the-mood-for-love': 0.8, 'urn:entity:movie:past-lives': 0.86 },
    'Three quiet hours that feel like twenty held breaths.'),
  F('the-worst-person', 'The Worst Person in the World', 2021, 0.79, ['romantic', 'bold', 'energetic'],
    { 'urn:entity:artist:beyonce': 0.74, 'urn:entity:movie:eeaao': 0.81, 'urn:entity:artist:taylor-swift': 0.8 },
    'Messy, funny, alive — a rom-com with real stakes.'),
  F('perfect-days', 'Perfect Days', 2023, 0.77, ['quiet-luxury', 'warm', 'meticulous'],
    { 'urn:entity:artist:norah-jones': 0.85, 'urn:entity:movie:spirited-away': 0.72, 'urn:entity:artist:radiohead': 0.66 },
    'A gentle film about noticing things. Ends on a smile.'),

  // ── Soundtrack for the walk home ─────────────────────────────────────────
  A('khruangbin', 'Khruangbin', 0.84, ['warm', 'late-night', 'otherworldly'],
    { 'urn:entity:artist:frank-ocean': 0.8, 'urn:entity:artist:bjork': 0.7, 'urn:entity:movie:spirited-away': 0.68 },
    'Wordless groove; lets the conversation keep going.'),
  A('sade', 'Sade', 0.88, ['romantic', 'quiet-luxury', 'late-night'],
    { 'urn:entity:artist:norah-jones': 0.9, 'urn:entity:movie:in-the-mood-for-love': 0.85, 'urn:entity:movie:amelie': 0.7 },
    'The canonical slow-down-the-night voice.'),
  A('bad-bunny', 'Bad Bunny', 0.93, ['vibrant', 'energetic', 'bold'],
    { 'urn:entity:artist:beyonce': 0.82, 'urn:entity:artist:kendrick-lamar': 0.75, 'urn:entity:movie:eeaao': 0.7 },
    'For dates that should not end yet.'),
  A('nils-frahm', 'Nils Frahm', 0.72, ['delicate', 'experimental', 'introspective'],
    { 'urn:entity:artist:radiohead': 0.88, 'urn:entity:artist:bjork': 0.78, 'urn:entity:movie:past-lives': 0.74 },
    'Piano and tape hiss; thoughts get room to land.'),
  A('lana-del-rey', 'Lana Del Rey', 0.89, ['melancholic', 'romantic', 'cinematic'],
    { 'urn:entity:artist:the-weeknd': 0.84, 'urn:entity:artist:taylor-swift': 0.8, 'urn:entity:movie:la-la-land': 0.76 },
    'Cinematic melancholy for city lights.'),
  A('anderson-paak', 'Anderson .Paak', 0.83, ['vibrant', 'warm', 'energetic'],
    { 'urn:entity:artist:kendrick-lamar': 0.85, 'urn:entity:artist:beyonce': 0.79, 'urn:entity:movie:la-la-land': 0.71 },
    'Sunshine funk; the night ends smiling.'),

  // ── Nightcap / dessert ───────────────────────────────────────────────────
  B('bar-lumen', 'Bar Lumen', 'New York', 'Listening bar', '$$', 0.8, ['late-night', 'quiet-luxury', 'meticulous'],
    { 'urn:entity:artist:norah-jones': 0.84, 'urn:entity:movie:in-the-mood-for-love': 0.79, 'urn:entity:artist:radiohead': 0.7 },
    'Vinyl only, low lights, one perfect amaro list.'),
  B('neon-garden', 'Neon Garden', 'New York', 'Rooftop cocktails', '$$', 0.87, ['vibrant', 'bold', 'late-night'],
    { 'urn:entity:artist:the-weeknd': 0.85, 'urn:entity:artist:beyonce': 0.78, 'urn:entity:movie:eeaao': 0.72 },
    'Skyline, colour, a DJ who reads the room.'),
  B('the-study-la', 'The Study', 'Los Angeles', 'Wine bar', '$$', 0.77, ['introspective', 'delicate', 'warm'],
    { 'urn:entity:artist:frank-ocean': 0.83, 'urn:entity:movie:past-lives': 0.8, 'urn:entity:movie:amelie': 0.71 },
    'Natural wine and low talk in a converted bookstore.'),
  B('solstice-roof', 'Solstice Roof', 'Los Angeles', 'Mezcal rooftop', '$$', 0.85, ['vibrant', 'energetic', 'warm'],
    { 'urn:entity:artist:beyonce': 0.77, 'urn:entity:movie:la-la-land': 0.8, 'urn:entity:artist:taylor-swift': 0.66 },
    'Golden-hour mezcal; the skyline does half the work.'),
  B('fern-bar', 'Fern Bar', 'San Francisco', 'Herbal cocktails', '$$', 0.78, ['experimental', 'moody', 'otherworldly'],
    { 'urn:entity:artist:bjork': 0.86, 'urn:entity:artist:radiohead': 0.8, 'urn:entity:movie:spirited-away': 0.74 },
    'Botanical drinks in a greenhouse that glows.'),
  B('lantern-room', 'Lantern Room', 'Chicago', 'Dessert bar', '$$', 0.79, ['delicate', 'romantic', 'quiet-luxury'],
    { 'urn:entity:movie:amelie': 0.86, 'urn:entity:artist:taylor-swift': 0.76, 'urn:entity:movie:grand-budapest-hotel': 0.78 },
    'Patisserie by candlelight; order the thing with the dome.'),
];

export const CITIES = [...new Set(TARGETS.filter(t => t.city).map(t => t.city))];

const seedById = new Map(SEEDS.map(s => [s.id, s]));
export const getSeed = id => seedById.get(id);

function jaccard(a = [], b = []) {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union;
}

/** Sample-mode affinity: blend of explicit affinity + tag overlap, 0..1. */
export function affinityScore(seedIds, target) {
  if (!seedIds?.length) return 0;
  let best = 0, sum = 0;
  for (const id of seedIds) {
    const explicit = target.affinities?.[id] ?? 0;
    const tagScore = jaccard(seedById.get(id)?.tags, target.tags);
    const s = 0.55 * explicit + 0.45 * Math.min(1, tagScore * 2.2);
    best = Math.max(best, s); sum += s;
  }
  return +(0.7 * best + 0.3 * (sum / seedIds.length)).toFixed(3);
}

/** Shared tags between a target and the seed set — the explanation thread. */
export function sharedTags(seedIds, target) {
  const seedTags = new Map();
  for (const id of seedIds) for (const t of seedById.get(id)?.tags ?? []) {
    if (!seedTags.has(t)) seedTags.set(t, seedById.get(id).name);
  }
  return (target.tags ?? []).filter(t => seedTags.has(t)).map(t => ({ tag: t, via: seedTags.get(t) }));
}

/** The seed that drives a target's score most — used in "why" copy. */
export function topSeed(seedIds, target) {
  let bestId = null, bestScore = -1;
  for (const id of seedIds ?? []) {
    const s = (target.affinities?.[id] ?? 0) + 0.4 * jaccard(seedById.get(id)?.tags, target.tags);
    if (s > bestScore) { bestScore = s; bestId = id; }
  }
  return bestId ? seedById.get(bestId) : null;
}

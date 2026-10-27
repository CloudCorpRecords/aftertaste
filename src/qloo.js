// Qloo client — one interface, two transports.
//
// LIVE MODE (QLOO_API_KEY set): calls the real Qloo Taste AI API per
// docs.qloo.com — header `X-Api-Key`, base https://api.qloo.com
// (override with QLOO_API_BASE, e.g. https://staging.api.qloo.com):
//   search:   GET /search?query=<text>&types=<urn types>
//   insights: GET /v2/insights?signal.interests.entities=<ids>
//             &filter.type=<urn:entity:...>&take=<n>
// SAMPLE MODE (no key): answers from src/taste-data.js, a local dataset
// shaped like the API's responses and clearly labeled SAMPLE DATA.
// Swapping modes is a one-line env change: set QLOO_API_KEY.
//
// The hackathon credential is event-issued per participant via the form
// linked from https://qloo.devpost.com/resources ("FIRST, get your API key").

import { SEEDS, TARGETS, affinityScore, sharedTags, topSeed } from './taste-data.js';

const API_BASE = () => process.env.QLOO_API_BASE || 'https://api.qloo.com';
export const hasLiveKey = () => Boolean(process.env.QLOO_API_KEY);
export const mode = () => (hasLiveKey() ? 'live' : 'sample');

async function qlooFetch(path, params) {
  const url = new URL(API_BASE() + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': process.env.QLOO_API_KEY },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Qloo API ${res.status} on ${path}`);
  return res.json();
}

const norm = e => ({
  id: e.entity_id || e.id,
  name: e.name,
  subtype: e.subtype || e.type,
  popularity: e.properties?.popularity ?? 0.5,
  tags: (e.properties?.tags ?? e.tags ?? []).map(t => (typeof t === 'string' ? t : t.name)).filter(Boolean),
  raw: e,
});

/** Resolve free-text taste inputs ("Radiohead") to Qloo entity IDs. */
export async function searchEntities(query) {
  if (!hasLiveKey()) {
    const q = query.trim().toLowerCase();
    return SEEDS
      .filter(s => s.name.toLowerCase().includes(q) || q.includes(s.name.toLowerCase()))
      .map(s => ({ id: s.id, name: s.name, kind: s.kind, source: 'sample' }));
  }
  const data = await qlooFetch('/search', { query });
  const results = data.results ?? data.entities ?? [];
  return results.map(e => { const n = norm(e); return { id: n.id, name: n.name, kind: n.subtype, source: 'live' }; });
}

/**
 * Cross-domain recommendations: seed entities in, entities of `filterType`
 * out, ranked by Qloo affinity. This is the call a generic LLM cannot fake —
 * the ranking comes from the taste graph, not from language priors.
 */
export async function insights({ seedIds, filterType, kinds, city, take = 5, extraTagBoost = [] }) {
  if (!hasLiveKey()) {
    return TARGETS
      .filter(t => kinds.includes(t.kind))
      .filter(t => !city || !t.city || t.city === city)
      .map(t => {
        let score = affinityScore(seedIds, t);
        // Agent chaining: later legs get a small boost for sharing tags with
        // the legs already chosen, so the night coheres as one taste thread.
        if (extraTagBoost.length) {
          const overlap = t.tags.filter(x => extraTagBoost.includes(x)).length;
          score = Math.min(1, score + 0.06 * overlap);
        }
        return {
          id: t.id, name: t.name, kind: t.kind, city: t.city, cuisine: t.cuisine,
          style: t.style, year: t.year, price: t.price, blurb: t.blurb,
          popularity: t.popularity, tags: t.tags, score,
          sharedTags: sharedTags(seedIds, t), topSeed: topSeed(seedIds, t)?.name ?? null,
          source: 'sample',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, take);
  }
  const data = await qlooFetch('/v2/insights', {
    'signal.interests.entities': seedIds.join(','),
    'filter.type': filterType,
    take,
  });
  return (data.results?.entities ?? []).map(e => {
    const n = norm(e);
    return { ...n, kind: kinds[0], score: e.query?.affinity ?? n.popularity, sharedTags: [], topSeed: null, source: 'live' };
  });
}

/** Popularity-only ranking — the "without Qloo" ablation baseline. */
export function popularityOnly({ kinds, city, take = 5 }) {
  return TARGETS
    .filter(t => kinds.includes(t.kind))
    .filter(t => !city || !t.city || t.city === city)
    .map(t => ({ ...t, score: t.popularity, sharedTags: [], topSeed: null, source: 'none' }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, take);
}

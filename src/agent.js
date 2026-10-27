// Aftertaste agent — plans a date night in someone ELSE's taste language.
//
// Flow (each step is a real Qloo call in live mode):
//   1. resolve  — search the taste graph for the date's favourite things
//   2. dine     — Insights: places ranked by affinity to those seeds, in-city
//   3. watch    — Insights: films ranked by seeds + the chosen restaurant's
//                 tags (chaining: the night must cohere, not just match)
//   4. listen   — Insights: artists ranked by seeds + the chosen film
//   5. nightcap — Insights: bars/dessert ranked by seeds + accumulated thread
// Every pick carries its affinity score, the seed that drove it, and the
// shared tags — the explanation IS the product. A generic LLM can name a
// "nice restaurant"; it cannot show its work in a measured taste graph.

import { searchEntities, insights, popularityOnly, mode } from './qloo.js';
import { getSeed } from './taste-data.js';

const LEGS = [
  { key: 'dinner', label: 'Dinner', kinds: ['restaurant'], filterType: 'urn:entity:place', needsCity: true },
  { key: 'film', label: 'Watch after', kinds: ['film'], filterType: 'urn:entity:movie', needsCity: false },
  { key: 'soundtrack', label: 'Soundtrack for the walk home', kinds: ['soundtrack'], filterType: 'urn:entity:artist', needsCity: false },
  { key: 'nightcap', label: 'Nightcap', kinds: ['nightcap'], filterType: 'urn:entity:place', needsCity: true },
];

function explain(pick, seeds) {
  const bits = [];
  if (pick.topSeed) bits.push(`Closest to their love of ${pick.topSeed}`);
  if (pick.sharedTags?.length) {
    bits.push(`taste threads: ${pick.sharedTags.map(s => `${s.tag} (via ${s.via})`).join(', ')}`);
  }
  bits.push(`taste affinity ${pick.score.toFixed(2)}`);
  return bits.join(' · ') + '.';
}

export async function planNight({ tastes, city, generic = false }) {
  const steps = [];
  const started = Date.now();

  // Step 1 — resolve the date's tastes to graph entities.
  const seeds = [];
  for (const t of tastes) {
    const hits = await searchEntities(t);
    if (hits.length) seeds.push({ input: t, ...hits[0] });
  }
  steps.push({ step: 'resolve', detail: `Resolved ${seeds.length}/${tastes.length} tastes to taste-graph entities`, seeds: seeds.map(s => s.name) });
  if (!seeds.length) {
    return { ok: false, error: 'None of those tastes resolved to a known entity. Try an artist or film from the picker.', steps };
  }
  const seedIds = seeds.map(s => s.id);
  const seedNames = seeds.map(s => getSeed(s.id)?.name ?? s.name);

  // Generic ablation: no Qloo, rank by raw popularity only.
  if (generic) {
    const legs = LEGS.map(leg => {
      const picks = popularityOnly({ kinds: leg.kinds, city: leg.needsCity ? city : undefined, take: 3 });
      return { ...leg, picks: picks.map(p => ({ ...p, why: 'Ranked by popularity alone — no taste signal. This is what an agent without Qloo serves everyone.' })) };
    });
    steps.push({ step: 'ablation', detail: 'Qloo disabled: popularity-only ranking (the generic-agent baseline)' });
    return { ok: true, mode: 'generic-no-qloo', city, seeds: seedNames, legs, steps, ms: Date.now() - started };
  }

  // Steps 2–5 — chained Insights legs. Each leg's winner feeds its tags
  // forward so dinner, film, soundtrack and nightcap form ONE taste thread.
  const legs = [];
  let threadTags = [];
  for (const leg of LEGS) {
    const picks = await insights({
      seedIds, filterType: leg.filterType, kinds: leg.kinds,
      city: leg.needsCity ? city : undefined, take: 3, extraTagBoost: threadTags,
    });
    const enriched = picks.map(p => ({ ...p, why: explain(p, seedNames) }));
    legs.push({ key: leg.key, label: leg.label, picks: enriched });
    if (enriched[0]) threadTags = [...new Set([...threadTags, ...enriched[0].tags])];
    steps.push({ step: leg.key, detail: `Insights → ${leg.label}: top pick “${enriched[0]?.name}” (affinity ${enriched[0]?.score.toFixed(2)})`, chainedTags: threadTags });
  }

  return {
    ok: true, mode: mode(), dataSource: mode() === 'live' ? 'Qloo Taste AI API (live)' : 'SAMPLE DATA — local stand-in shaped like the Qloo API; set QLOO_API_KEY for live results',
    city, seeds: seedNames, legs, steps, ms: Date.now() - started,
  };
}

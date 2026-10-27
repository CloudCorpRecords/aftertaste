# Aftertaste — a date-night agent with taste

**Agents are culturally blind. Aftertaste fixes that for the hardest recommendation problem there is: planning a date for someone whose taste you know, but whose city you don't.**

Tell Aftertaste what *they* love — a musician, a film — and a city. It plans the whole night in their taste language: **dinner → a film to watch after → the walk-home soundtrack → a nightcap**. Every pick shows its work: the Qloo taste affinity score, the seed it connects to, and the shared taste threads. Not "here's a popular restaurant." Instead: *"Kaiseki Den — closest to their love of In the Mood for Love; meticulous, quiet-luxury, cinematic threads; affinity 0.81."*

That explanation is impossible for a generic LLM agent. It has no measured cross-domain affinities — it guesses stereotypes. Aftertaste's ranking comes from Qloo's taste graph (250M+ entities across music, film/TV, dining, fashion, travel), so a Radiohead fan and a Beyoncé fan standing in the same city get **genuinely different nights** — and the app proves it, with a built-in "without Qloo" ablation that serves both of them the same most-popular restaurant.

## Features

- **Cross-domain taste transfer** — music/film loves in, dining/film/music/nightlife out. The domains never overlap; only the taste graph connects them.
- **Chained agent planning** — four planning legs, each an Insights call. Each leg's winner feeds its tags into the next leg, so the night coheres as one taste thread instead of four independent lists.
- **Explainable picks** — every recommendation carries affinity score, driving seed, and shared tags. Culture you can audit, not vibes.
- **Built-in ablation** — one click re-plans the same night with Qloo disabled (popularity-only). Judges can watch the taste signal disappear.
- **Agent trace** — the UI/CLI shows every step the agent took: seed resolution, each Insights call, chaining state.
- **Live Qloo mode + sample mode** — set one env var and the identical app runs against the real Qloo Taste AI API. Without a key it runs on a clearly labeled local sample dataset shaped like the API, so the demo never hard-fails.

## Qloo integration points

All Qloo access lives in `src/qloo.js`, against the documented API (docs.qloo.com), authenticated with the `X-Api-Key` header:

| Step | Endpoint | How Aftertaste uses it |
| --- | --- | --- |
| Resolve tastes | `GET /search?query=<text>` | Turns "Radiohead", "Amélie" into taste-graph entity IDs |
| Recommend per leg | `GET /v2/insights?signal.interests.entities=<ids>&filter.type=<urn>&take=<n>` | Cross-domain affinity ranking: places, movies, artists seeded by the date's entities |
| Chaining | Insights `filter.tags` / tag signals from prior legs | The chosen dinner's tags bias the film leg; the film biases the soundtrack |

Entity/response handling follows the documented shapes (`entity_id`, `subtype` like `urn:entity:movie`, `properties.popularity`, tag URNs). In sample mode, `src/taste-data.js` reproduces those shapes locally with a hand-built mini graph (16 seeds, 29 targets, explicit affinity + tag-overlap scoring) — same code path, same UI, honestly labeled **SAMPLE DATA** everywhere it appears.

## Run it

Requires Node.js 20+ (developed on Node 24). Zero dependencies — nothing to install.

```bash
npm start
# → http://localhost:4173   (PORT env to change)
```

Or skip the server:

```bash
node scripts/demo.mjs "Radiohead" "In the Mood for Love" --city "New York"
node scripts/demo.mjs "Beyoncé" --city "Chicago" --generic   # the no-Qloo ablation
npm test   # end-to-end smoke test (boots the server, verifies the full flow)
```

### Going live with Qloo

1. Get the event-issued hackathon credential via the form linked at <https://qloo.devpost.com/resources> ("FIRST, get your API key"). Each participant uses their own credential — never commit it, never put it in the browser app; this server keeps it server-side.
2. Set one line:

```bash
QLOO_API_KEY=<your-key> npm start
# optional: QLOO_API_BASE=https://staging.api.qloo.com
```

That's the whole switch. The health endpoint reports `mode: "live"`.

## Architecture

```
public/index.html   single-page UI: seed picker, city, itinerary, ablation button, agent trace
src/server.js       zero-dependency Node http server: /, /api/catalog, /api/health, /api/plan
src/agent.js        the agent: resolve → dine → watch → listen → nightcap, with tag chaining + explanations
src/qloo.js         Qloo client: live API transport + sample transport behind one interface
src/taste-data.js   SAMPLE taste graph (stand-in data, labeled; unused for answers in live mode)
test/smoke.mjs      HTTP end-to-end smoke: full flow, taste-changes-outcome, ablation, error path
scripts/demo.mjs    CLI front-end for the same agent
```

API: `POST /api/plan` with `{ "tastes": ["Radiohead", "Amélie"], "city": "New York", "generic": false }` returns the itinerary with per-pick `score`, `why`, and the agent `steps` trace.

## Why it fails without Qloo

Remove Qloo and three things die at once: (1) the ranking — popularity serves everyone the same "best" restaurant; (2) the cross-domain jump — nothing connects a film someone loves to a kitchen across town; (3) the explanation — there is no affinity to show, only adjectives. The ablation mode demonstrates all three failures live. That is the point of the app: cultural intelligence isn't a garnish on the agent, it *is* the agent.

## License

MIT — see [LICENSE](./LICENSE).

## Build Disclosure

Build Disclosure: **AI-built.** Built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period; Rene set the use case and reviewed; agents designed, coded, and tested.

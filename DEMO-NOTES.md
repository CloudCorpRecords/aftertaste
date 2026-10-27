# Demo Notes — Aftertaste (for judges & for our own submit pass)

## Run it locally (30 seconds)

```bash
npm start            # Node 20+, zero dependencies, nothing to install
# open http://localhost:4173
npm test             # optional: end-to-end smoke test of the full flow
node scripts/demo.mjs "Radiohead" "Amélie" --city "New York"   # CLI instead of UI
```

## The 2-minute judge script

1. Pick **Radiohead** + **In the Mood for Love**, city **New York** → *Plan the night*. Note the top picks (expected sample mode: Kaiseki Den → *Drive My Car* → Nils Frahm → Bar Lumen) and read a "Why them" line out loud — affinity + threads are the product.
2. Change the picks to **Beyoncé** + **Everything Everywhere All at Once** → top dinner changes (Sabor Vivo). Same city, different human, different night.
3. Hit **"Show me the night WITHOUT Qloo"** → both profiles now get the same most-popular restaurant (Seoul Smoke, popularity 0.90). That contrast is the whole thesis, demonstrated live.
4. Scroll the **agent trace**: seed resolution → four chained Insights legs.

## Data modes — what judges are actually seeing

- **Sample mode (default, no key):** a local dataset in `src/taste-data.js` shaped exactly like Qloo API responses (URN subtypes, tag URNs, affinity scores). Labeled SAMPLE DATA in the UI badge, API responses, and CLI output. It exists so the demo can never hard-fail; it is not Qloo data and never claims to be.
- **Live mode:** set `QLOO_API_KEY` (event-issued credential, obtained via the form at https://qloo.devpost.com/resources) and the same build calls `https://api.qloo.com` (`/search`, `/v2/insights`, `X-Api-Key` header). `GET /api/health` reports which mode is active. **For the judged live demo, deploy with the key set** so judges see real Qloo results; the key stays server-side (the server binds the key, the browser never sees it).

## Hosting options for the live-demo requirement (parent to execute)

The app is a single zero-dependency Node server (`node src/server.js`, `PORT` env) — it deploys anywhere Node runs:

1. **Vercel** (matches our other wave-1 deploys): deploy the folder, set env `QLOO_API_KEY` (+ `PORT` not needed). Zero deps = cold-start friendly.
2. **Render / Fly.io / Railway:** start command `npm start`, env `QLOO_API_KEY`. Free tiers suffice.
3. Any VPS/container: `QLOO_API_KEY=… node src/server.js` behind a reverse proxy.

Checklist before submitting: live URL loads, `/api/health` shows `mode:"live"`, one full plan run in live mode screenshotted, repo public with LICENSE visible in About, SUBMISSION.md links filled in.

## Known limits (honest)

- Sample graph is small (16 seeds, 29 targets, 4 cities) — coverage, not concept. Live mode removes the limit entirely.
- In live mode, explanation threads rely on tags returned by the API; if a result lacks tags, the "why" falls back to affinity + driving seed.
- Restaurant picks are Qloo place entities; real-time availability/reservations are out of scope by design.

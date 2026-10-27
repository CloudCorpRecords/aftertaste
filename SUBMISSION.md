# Devpost Submission — Qloo Agentic Hackathon
<!-- Ready to paste. Deadline: Oct 30, 2026, 11:45 PM ET. No demo video required. -->
<!-- All fields filled: live demo + repo URLs in Links below. -->

**Project name:** Aftertaste — a date-night agent with taste

**Tagline:** Give an agent someone's taste in music and film, and it plans their whole night — dinner, movie, soundtrack, nightcap — in that taste language, with receipts.

## What it does

Agents today are culturally blind: they can plan and execute, but ask one to plan a date for a person who loves Radiohead and *In the Mood for Love* and it serves the same "top-rated Italian place" it serves everyone. Aftertaste is an agent that plans a complete date night — **dinner, a film to watch after, the walk-home soundtrack, and a nightcap** — grounded in Qloo's taste graph instead of language-model stereotypes.

You give it 2–4 things your date loves (artists, films) and a city. The agent:

1. **Resolves** each love to a Qloo taste-graph entity (`GET /search`).
2. **Plans four chained legs** (`GET /v2/insights`), each ranked by cross-domain affinity to those seeds: restaurants in-city, then films, then artists, then nightcap spots. Each leg's winner feeds its tags forward, so the night coheres as a single taste thread — a meticulous, quiet-luxury dinner flows into a delicate film, not a random blockbuster.
3. **Shows its work** on every pick: affinity score, the seed that drove it, and the shared taste threads ("closest to their love of *In the Mood for Love* · threads: meticulous, cinematic · affinity 0.81").
4. **Proves the counterfactual**: a "Without Qloo" button re-plans the identical night with popularity-only ranking. Both a Radiohead fan and a Beyoncé fan get the same restaurant. Taste-blind, in one click.

Verified behaviour (sample-data mode): Radiohead + *In the Mood for Love* in NYC → Kaiseki Den → *Drive My Car* → Nils Frahm → Bar Lumen. Beyoncé + *Everything Everywhere* → Sabor Vivo and a completely different night. Frank Ocean + *Past Lives* in Chicago → Little Lantern at 0.93 affinity.

## What makes it Qloo-powered

Cultural intelligence is not a feature of Aftertaste; it is the entire mechanism. The ranking, the cross-domain jump (film taste → restaurant choice — domains that share no catalog, only a taste graph), and the explanation all come from Qloo affinities across its 250M+ entities in music, film/TV, dining, and more. **If this submission would work the same without Qloo, it would be the wrong submission — so we built the ablation in to prove it doesn't:** remove Qloo and the ranking collapses to popularity, the cross-domain jump disappears, and every explanation loses its evidence. An LLM alone can describe a nice evening; it cannot measure one.

## Tech

Zero-dependency Node.js (server, agent, Qloo client), vanilla HTML/CSS/JS front end. Qloo integration follows the documented API (`X-Api-Key` auth, `/search`, `/v2/insights` with `signal.interests.entities` + `filter.type`). Runs with one command (`npm start`); `npm test` runs an end-to-end HTTP smoke test of the full flow. The repo also runs in a clearly labeled sample-data mode (local stand-in shaped like the Qloo API) so judges can try the complete experience; setting `QLOO_API_KEY` switches the same build to the live API.

**Built with:** Qloo Taste AI API, Node.js, Muse / Tree agent fleet.

**Links:** Live demo: https://aftertaste-gamma.vercel.app · Repo: https://github.com/CloudCorpRecords/aftertaste (MIT license, see repo About)

**Build Disclosure:** AI-built. Built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period; Rene set the use case and reviewed; agents designed, coded, and tested.

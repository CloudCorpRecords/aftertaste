// Aftertaste server — zero-dependency Node http server.
//   GET  /            → web UI (public/index.html)
//   GET  /api/health  → { ok, mode, dataSource }
//   GET  /api/catalog → seed picker + cities (for the UI)
//   POST /api/plan    → { tastes: [..], city, generic? } → itinerary
// Run: npm start   (PORT env, default 4173)

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { planNight } from './agent.js';
import { mode } from './qloo.js';
import { SEEDS, CITIES } from './taste-data.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const indexHtml = await readFile(join(__dir, '..', 'public', 'index.html'), 'utf8');

const json = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(indexHtml);
    }
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return json(res, 200, { ok: true, mode: mode(), app: 'aftertaste', ts: new Date().toISOString() });
    }
    if (req.method === 'GET' && url.pathname === '/api/catalog') {
      return json(res, 200, { seeds: SEEDS.map(s => ({ name: s.name, kind: s.kind })), cities: CITIES, mode: mode() });
    }
    if (req.method === 'POST' && url.pathname === '/api/plan') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { tastes = [], city = 'New York', generic = false } = JSON.parse(body || '{}');
      const clean = (Array.isArray(tastes) ? tastes : [tastes]).map(String).map(s => s.trim()).filter(Boolean).slice(0, 4);
      if (!clean.length) return json(res, 400, { ok: false, error: 'Give me at least one thing they love.' });
      const plan = await planNight({ tastes: clean, city, generic: Boolean(generic) });
      return json(res, plan.ok ? 200 : 422, plan);
    }
    return json(res, 404, { ok: false, error: 'not found' });
  } catch (err) {
    return json(res, 500, { ok: false, error: String(err?.message ?? err) });
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, () => console.log(`Aftertaste listening on http://localhost:${port} (Qloo mode: ${mode()})`));

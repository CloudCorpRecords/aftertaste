// End-to-end smoke test: boots the real server on an ephemeral port and
// exercises the full recommendation flow over HTTP. Run: npm test
import { spawn } from 'node:child_process';
import assert from 'node:assert';

const PORT = 4919;
const env = { ...process.env, PORT: String(PORT) };
delete env.QLOO_API_KEY; // force sample mode for deterministic assertions
const proc = spawn('node', ['src/server.js'], { env, stdio: 'pipe' });
const base = `http://localhost:${PORT}`;
const wait = ms => new Promise(r => setTimeout(r, ms));

async function waitUp() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(base + '/api/health'); if (r.ok) return r.json(); } catch {}
    await wait(150);
  }
  throw new Error('server did not come up');
}

try {
  const health = await waitUp();
  assert.equal(health.ok, true); assert.equal(health.mode, 'sample');
  console.log('✓ health:', JSON.stringify(health));

  const cat = await (await fetch(base + '/api/catalog')).json();
  assert.ok(cat.seeds.length >= 12 && cat.cities.length >= 4);
  console.log(`✓ catalog: ${cat.seeds.length} seeds, ${cat.cities.length} cities`);

  const post = body => fetch(base + '/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

  // Flow 1: melancholic-cinematic taste profile, NYC
  const p1 = await post({ tastes: ['Radiohead', 'In the Mood for Love'], city: 'New York' });
  assert.equal(p1.ok, true); assert.equal(p1.legs.length, 4);
  for (const leg of p1.legs) {
    assert.ok(leg.picks.length >= 2, `${leg.key} has ranked picks`);
    assert.ok(leg.picks[0].why.includes('affinity'), `${leg.key} top pick is explained`);
    assert.ok(leg.picks[0].score >= leg.picks[1].score, `${leg.key} picks are score-sorted`);
  }
  console.log('✓ plan 1 legs:', p1.legs.map(l => `${l.label} → ${l.picks[0].name} (${l.picks[0].score.toFixed(2)})`).join(' | '));

  // Flow 2: a different taste profile must produce a DIFFERENT top dinner —
  // the core claim: the graph, not popularity, drives the answer.
  const p2 = await post({ tastes: ['Beyoncé', 'Everything Everywhere All at Once'], city: 'New York' });
  assert.equal(p2.ok, true);
  const d1 = p1.legs[0].picks[0].name, d2 = p2.legs[0].picks[0].name;
  assert.notEqual(d1, d2, 'different tastes must change the top dinner');
  console.log(`✓ taste changes outcome: dinner “${d1}” (Radiohead profile) vs “${d2}” (Beyoncé profile)`);

  // Flow 3: ablation — without Qloo the ranking is popularity-only and the
  // top dinner is the same regardless of who the date is.
  const g1 = await post({ tastes: ['Radiohead'], city: 'New York', generic: true });
  const g2 = await post({ tastes: ['Beyoncé'], city: 'New York', generic: true });
  assert.equal(g1.legs[0].picks[0].name, g2.legs[0].picks[0].name, 'generic mode must be taste-blind');
  console.log(`✓ ablation: generic top dinner is identical for both profiles (“${g1.legs[0].picks[0].name}”) — taste-blind without Qloo`);

  // Flow 4: unknown taste is a clean error, not a crash.
  const bad = await post({ tastes: ['Zxqwv Nonexistent'], city: 'New York' });
  assert.equal(bad.ok, false);
  console.log('✓ unknown taste → clean error:', bad.error.slice(0, 60) + '…');

  console.log('\nSMOKE PASS — full recommendation flow verified end to end.');
} finally {
  proc.kill('SIGTERM');
}

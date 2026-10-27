// CLI demo — plan a night without the server.
//   node scripts/demo.mjs "Radiohead" "Amélie" --city "New York"
//   node scripts/demo.mjs "Beyoncé" --city "Chicago" --generic
import { planNight } from '../src/agent.js';

const args = process.argv.slice(2);
const cityIdx = args.indexOf('--city');
const city = cityIdx >= 0 ? args[cityIdx + 1] : 'New York';
const generic = args.includes('--generic');
const tastes = args.filter((a, i) => !a.startsWith('--') && i !== cityIdx + 1);

const plan = await planNight({ tastes: tastes.length ? tastes : ['Radiohead', 'In the Mood for Love'], city, generic });
if (!plan.ok) { console.error('✗', plan.error); process.exit(1); }
console.log(`\nAFTERTASTE — a night for a fan of ${plan.seeds.join(' + ')} · ${plan.city}`);
console.log(`mode: ${plan.mode}${plan.dataSource ? ' · ' + plan.dataSource : ''}\n`);
for (const leg of plan.legs) {
  console.log(`▸ ${leg.label.toUpperCase()}`);
  leg.picks.forEach((p, i) => console.log(`  ${i === 0 ? '★' : ' '} ${p.name}  [affinity ${p.score.toFixed(2)}]\n      ${p.why}`));
}
console.log('\nAgent trace:');
for (const s of plan.steps) console.log('  →', s.detail);

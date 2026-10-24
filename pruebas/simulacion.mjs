/* ============================================================================
 * PRUEBA 1 — Validación de contenido y simulación masiva.
 *
 *   node pruebas/simulacion.mjs
 *
 *  · Comprueba IDs únicos, opciones, desenlaces y claves de efecto válidas.
 *  · Verifica que todo evento tiene al menos una opción gratuita.
 *  · Juega 1.200 partidas con estrategia aleatoria y 1.200 con estrategia
 *    codiciosa, revisando que ninguna partida se rompa ni quede sin final.
 *
 * No usa el DOM: carga los mismos scripts que el navegador como módulo ESM.
 * ==========================================================================*/
import { cargarMotor } from '../herramientas/orden-carga.mjs';

const { Game, EVENT_LIST } = await cargarMotor();

/* ---------------------------------------------------------- validación ---- */
const ids = new Set();
const validFx = [
  'health', 'intellect', 'loyalty', 'blat', 'morale', 'rubles', 'rublesPct',
  'item', 'removeItem', 'flag', 'flags', 'risk', 'training', 'deals', 'rank',
  'starRep', 'flatBoost', 'waitlist', 'spouse', 'child', 'party', 'tier',
  'job', 'housing', 'retired', 'army', 'study', 'goal', 'death'
];

for (const e of EVENT_LIST) {
  if (ids.has(e.id)) throw new Error('ID duplicado: ' + e.id);
  ids.add(e.id);
  if (!e.options || !e.options.length) throw new Error('Sin opciones: ' + e.id);
  if (e.options.length > 4) throw new Error('Demasiadas opciones: ' + e.id);
  if (!e.title) throw new Error('Sin título: ' + e.id);
  for (const o of e.options) {
    if (!o.label) throw new Error('Opción sin etiqueta en ' + e.id);
    if (!o.outcome) throw new Error('Opción sin desenlace en ' + e.id);
    for (const k of Object.keys(o.fx || {})) {
      if (!validFx.includes(k)) throw new Error(`fx desconocido "${k}" en ${e.id}`);
    }
    if (o.cost && o.fx && o.fx.rubles) throw new Error('cost + fx.rubles duplicado en ' + e.id);
  }
}
console.log('Eventos:', EVENT_LIST.length);

/* ------------------------------------------------- auditoría de salida ---- */
{
  const dummy = new Game({
    v: 1, rand: 1, year: 1970, age: 30, sex: 'hombre',
    stats: { health: 50, intellect: 30, loyalty: 30, blat: 0, morale: 50 },
    rubles: 0, items: [], flags: {}, seen: [], cooldowns: {}, queue: [],
    goal: { id: 'flat', completed: false }, party: false, children: 0, spouse: false,
    tier: 3, housing: 'kommunalka', log: [], phase: 'event', ended: null
  });
  const stuck = EVENT_LIST.filter(e => !e.options.some(o => dummy.canPick(o))).map(e => e.id);
  if (stuck.length) throw new Error('SIN SALIDA GRATUITA: ' + stuck.join(', '));
  console.log('Todos los eventos tienen una salida gratuita.');
}

/* ------------------------------------------------------------ estrategias -- */
const cohorts = [1928, 1938, 1948, 1958];
const origins = ['obrero', 'campesino', 'intelectual', 'nomenklatura'];

function estimate(o, goalId) {
  const fx = o.fx || {};
  let sc = 0;
  sc += (fx.health || 0) * 1.3;
  sc += (fx.morale || 0) * 0.5;
  sc += (fx.intellect || 0) * 0.6;
  sc += (fx.loyalty || 0) * 0.35;
  sc += (fx.blat || 0) * 0.8;
  sc += (fx.rubles || 0) / 35;
  if (fx.item) sc += 14;
  if (fx.spouse) sc += 10;
  if (fx.party) sc += 12;
  if (fx.retired) sc += 8;
  if (fx.study) sc += 12;
  if (fx.goal) sc += 4;
  if (fx.waitlist) sc += 8;
  if (fx.training) sc += 9;
  if (fx.deals) sc += 9;
  if (fx.rank) sc += 12;
  if (fx.starRep) sc += 2.5;
  if (fx.flatBoost) sc += 2.5;
  if (fx.risk) sc -= 7 * fx.risk;
  if (fx.death) sc -= 1000;
  if (goalId === 'flat') { if (fx.rubles > 0) sc += fx.rubles / 25; if (fx.waitlist) sc += 10; if (fx.flatBoost) sc += 3; }
  if (goalId === 'star') { if (fx.training) sc += 8; if (fx.starRep) sc += 4; if (fx.intellect > 0) sc += fx.intellect * 0.4; }
  if (goalId === 'black') { if (fx.deals) sc += 10; if (fx.blat > 0) sc += fx.blat * 0.5; if (fx.rubles > 0) sc += fx.rubles / 22; }
  if (goalId === 'party') { if (fx.rank) sc += 12; if (fx.loyalty > 0) sc += fx.loyalty * 0.5; if (fx.party) sc += 16; }
  return sc;
}

function run(games, strategy) {
  const out = {
    deaths: 0, ussr: 0, byCohort: {}, maxYear: 0,
    goals: { flat: [0, 0], star: [0, 0], black: [0, 0], party: [0, 0] },
    avgHealth: 0, avgRub: 0
  };
  for (let i = 0; i < games; i++) {
    const birthYear = cohorts[i % cohorts.length];
    const g = Game.create({
      name: 'Test ' + i, sex: i % 2 ? 'mujer' : 'hombre',
      birthYear, origin: origins[i % origins.length]
    });
    let guard = 0;
    while (!g.state.ended && guard++ < 400) {
      const s = g.state;
      if (s.phase === 'result') { g.advance(); continue; }
      const ev = s.event;
      if (!ev) { g.advance(); continue; }
      const valid = ev.options.map((o, ix) => g.canPick(o) ? ix : -1).filter(ix => ix >= 0);
      if (!valid.length) throw new Error('Ninguna opción válida en ' + ev.id + ' año ' + s.year);
      let ix;
      if (strategy === 'greedy') {
        const goalId = s.goal ? s.goal.id : null;
        ix = valid.map(v => ({ v, sc: estimate(ev.options[v], goalId) })).sort((a, b) => b.sc - a.sc)[0].v;
      } else {
        ix = valid[Math.floor(Math.random() * valid.length)];
      }
      if (!g.choose(ix)) throw new Error('choose falló en ' + ev.id);
      const s2 = g.state;
      if (s2.year > 1991 && !s2.ended) throw new Error('Año > 1991 sin final');
      for (const k of ['health', 'intellect', 'loyalty', 'blat', 'morale']) {
        const v = s2.stats[k];
        if (!Number.isFinite(v) || v < 0 || v > 100) throw new Error(`Stat ${k}=${v} inválida en ${s2.year}`);
      }
      if (!Number.isFinite(s2.rubles) || s2.rubles < 0) throw new Error('Rublos inválidos: ' + s2.rubles);
    }
    if (!g.state.ended) throw new Error('Partida sin final');
    const e = g.state.ended;
    if (e.type === 'ussr') out.ussr++; else out.deaths++;
    const c = out.byCohort[birthYear] || { n: 0, ussr: 0 };
    c.n++; if (e.type === 'ussr') c.ussr++;
    out.byCohort[birthYear] = c;
    out.maxYear = Math.max(out.maxYear, e.year);
    out.avgHealth += g.state.stats.health;
    out.avgRub += g.state.rubles;
    if (g.state.goal) {
      const a = out.goals[g.state.goal.id];
      a[0]++; if (g.state.goal.completed) a[1]++;
    }
  }
  out.avgHealth = Math.round(out.avgHealth / games);
  out.avgRub = Math.round(out.avgRub / games);
  return out;
}

for (const strat of ['random', 'greedy']) {
  const r = run(1200, strat);
  console.log('\n== Estrategia ' + strat + ' ==');
  console.log('URSS:', r.ussr, '| muertes:', r.deaths, '| año máx:', r.maxYear);
  console.log('Por cohorte:', JSON.stringify(r.byCohort));
  console.log('Metas elegidas/cumplidas:', JSON.stringify(r.goals));
  console.log('Salud media final:', r.avgHealth, '| rublos medios:', r.avgRub);
}
console.log('\nOK');

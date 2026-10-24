/* ============================================================================
 * PRUEBA 2 — Equilibrio de las cuatro grandes metas.
 *
 *   node pruebas/metas.mjs
 *
 * Juega 400 partidas por meta con una estrategia orientada a cumplirla y
 * resume: cuántas veces se eligió, cuántas se cumplieron, progreso medio,
 * edad media de cierre y muertes prematuras.
 *
 * Sirve para detectar metas imposibles o demasiado fáciles tras tocar
 * src/nucleo/metas.js o los efectos de los eventos.
 * ==========================================================================*/
import { cargarMotor } from '../herramientas/orden-carga.mjs';

const { Game } = await cargarMotor();

const cohorts = [1928, 1938, 1948, 1958];
const origins = ['obrero', 'campesino', 'intelectual', 'nomenklatura'];

function base(o) {
  const fx = o.fx || {};
  let sc = (fx.health || 0) * 2 + (fx.morale || 0) * 0.4 + (fx.rubles || 0) / 40;
  if (fx.item) sc += 12;
  if (fx.spouse) sc += 4;
  if (fx.study) sc += 8;
  if (fx.risk) sc -= 8 * fx.risk;
  return sc;
}

function score(o, goal, s) {
  const fx = o.fx || {};
  let sc = base(o);
  if (s.stats.health < 45) sc += (fx.health || 0) * 4;
  if (s.stats.morale < 30) sc += (fx.morale || 0) * 1.5;
  if (goal === 'flat') {
    sc += (fx.rubles || 0) / 15;
    if (fx.waitlist) sc += 25;
    sc += (fx.flatBoost || 0) * 3;
    sc += (fx.blat || 0) * 0.4;
    if (fx.housing) sc += 30;
  }
  if (goal === 'star') {
    sc += (fx.training || 0) * 14 + (fx.starRep || 0) * 6;
    sc += (fx.intellect || 0) * 0.8;
  }
  if (goal === 'black') {
    sc += (fx.deals || 0) * 14 + (fx.blat || 0) * 0.7 + (fx.rubles || 0) / 20;
    sc -= (fx.risk || 0) * 4;
  }
  if (goal === 'party') {
    sc += (fx.rank || 0) * 16 + (fx.loyalty || 0) * 0.6 + (fx.party ? 20 : 0) + (fx.blat || 0) * 0.3;
  }
  return sc;
}

function run(goal, n) {
  const res = { chosen: 0, completed: 0, progressSum: 0, ages: [], deathEarly: 0 };
  for (let i = 0; i < n; i++) {
    const g = Game.create({ name: 'G', sex: i % 2 ? 'mujer' : 'hombre', birthYear: cohorts[i % 4], origin: origins[i % 4] });
    let guard = 0;
    while (!g.state.ended && guard++ < 400) {
      const s = g.state;
      if (s.phase === 'result') { g.advance(); continue; }
      const ev = s.event;
      if (!ev) { g.advance(); continue; }
      const valid = ev.options.map((o, ix) => g.canPick(o) ? ix : -1).filter(x => x >= 0);
      let ix;
      if (ev.id === 'great_goal') {
        ix = valid.find(v => ev.options[v].fx && ev.options[v].fx.goal === goal);
        if (ix == null) ix = valid[0];
      } else {
        ix = valid.map(v => ({ v, sc: score(ev.options[v], goal, s) })).sort((a, b) => b.sc - a.sc)[0].v;
      }
      g.choose(ix);
    }
    const e = g.state.ended;
    const has = g.state.goal && g.state.goal.id === goal;
    if (has) res.chosen++;
    if (has && g.state.goal.completed) {
      res.completed++;
      res.ages.push(g.state.goal.completedYear - g.state.birthYear);
    }
    res.progressSum += has ? g.goalProgress() : 0;
    if (e.type !== 'ussr') res.deathEarly++;
  }
  return res;
}

for (const goal of ['flat', 'star', 'black', 'party']) {
  const r = run(goal, 400);
  console.log(goal, 'elegida', r.chosen, '| cumplidas', r.completed, '/', r.chosen,
    '| progreso medio (elegidas)', r.chosen ? Math.round(r.progressSum / r.chosen) : 0,
    '| edad media', r.ages.length ? Math.round(r.ages.reduce((a, b) => a + b, 0) / r.ages.length) : '-',
    '| muertes prematuras', r.deathEarly);
}

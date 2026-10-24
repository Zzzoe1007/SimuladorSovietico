/* ============================================================================
 * UTILIDADES — Funciones pequeñas compartidas por todo el juego.
 *  · clamp / round / fmtRub : matemáticas y formato de rublos.
 *  · rnd                    : generador pseudoaleatorio determinista (mulberry32).
 *  · pickWeighted           : elige un elemento de una lista según su "weight".
 * No toca el DOM ni conoce las reglas: solo ayuda.
 * ==========================================================================*/

'use strict';

/* ------------------------------------------------------------------ */
/* Utilidades numéricas y de formato                                   */
/* ------------------------------------------------------------------ */
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const round = (n) => Math.round(n);
const fmtRub = (n) => new Intl.NumberFormat('es-ES').format(Math.max(0, Math.round(n))) + ' ₽';

/** PRNG determinista (mulberry32) guardado dentro del estado: permite
 *  guardar/recargar una partida sin que cambien los acontecimientos. */
function rnd(state) {
  state.rand = (state.rand + 0x6D2B79F5) | 0;
  let t = state.rand;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pickWeighted(state, list) {
  const total = list.reduce((a, e) => a + (e.weight || 1), 0);
  let r = rnd(state) * total;
  for (const e of list) {
    r -= (e.weight || 1);
    if (r <= 0) return e;
  }
  return list[list.length - 1] || null;
}

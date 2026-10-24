/* ============================================================================
 * ERAS — Los cuatro periodos históricos que enmarcan la partida.
 * Cada era tiene id, nombre, rango de años y color (se usa en la línea temporal).
 * eraFor(year) devuelve la era correspondiente a un año concreto.
 * ==========================================================================*/

'use strict';

/* ------------------------------------------------------------------ */
/* Eras históricas                                                     */
/* ------------------------------------------------------------------ */
const ERAS = [
  { id: 'stalin',      name: 'Era de Stalin',  years: '1922–1953', from: 1922, to: 1953, color: '#7c2f28' },
  { id: 'thaw',        name: 'Deshielo',       years: '1954–1964', from: 1954, to: 1964, color: '#7a5a2c' },
  { id: 'stagnation',  name: 'Estancamiento',  years: '1965–1984', from: 1965, to: 1984, color: '#4e5a44' },
  { id: 'perestroika', name: 'Perestroika',    years: '1985–1991', from: 1985, to: 1991, color: '#485c6b' }
];

function eraFor(year) {
  return ERAS.find(e => year >= e.from && year <= e.to) || ERAS[ERAS.length - 1];
}

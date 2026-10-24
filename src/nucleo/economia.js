/* ============================================================================
 * ECONOMÍA — Sueldos por categoría laboral, gastos del hogar y vivienda.
 *  · SALARY / JOBS   : ingresos y nombre del puesto según el "tier" (0–7).
 *  · incomeOf(state) : sueldo anual (incluye cónyuge y subidas de 1989).
 *  · expensesOf(state): gastos anuales (vivienda, hijos, cónyuge, inflación).
 *  · housingName(h)  : etiqueta legible de la vivienda.
 * ==========================================================================*/

'use strict';

/* ------------------------------------------------------------------ */
/* Economía                                                            */
/* ------------------------------------------------------------------ */
const SALARY = {
  0: 0,        // sin empleo
  1: 620,      // estudiante / beca + ayuda familiar
  2: 1050,     // obrero no cualificado
  3: 1600,     // obrero cualificado
  4: 2050,     // técnico
  5: 2550,     // ingeniero, maestro, médico
  6: 3900,     // élite protegida (científico, deportista)
  7: 3600      // nomenklatura (más privilegios que sueldo)
};

const JOBS = {
  0: 'Sin empleo',
  1: 'Estudiante',
  2: 'Obrero no cualificado',
  3: 'Obrero cualificado',
  4: 'Técnico de taller',
  5: 'Ingeniero / docente',
  6: 'Élite protegida por el Estado',
  7: 'Funcionario del Partido'
};

function incomeOf(s) {
  if (s.retired) return 1450;
  let base = SALARY[s.tier] || 0;
  if (s.spouse) base += 850;                       // el cónyuge también trabaja
  if (s.year >= 1989) base *= 1.08;                // subidas nominales tardías
  return Math.round(base);
}

function expensesOf(s) {
  if (s.age < 18) return 0;
  let exp = s.tier === 1 ? 480 : CONFIG.baseExpenses;  // beca y residencia
  if (s.housing === 'kommunalka') exp += 40;
  else if (s.housing === 'room') exp += 70;
  else if (s.housing === 'khrushchyovka' || s.housing === 'apartment') exp += 120;
  exp += (s.children || 0) * 165;
  if (s.spouse) exp += 240;
  if (s.year >= 1989) exp *= 1.22;                 // inflación y escasez
  if (s.year === 1991) exp *= 1.35;
  return Math.round(exp);
}

function housingName(h) {
  return ({
    kommunalka: 'Kommunalka (piso compartido)',
    room: 'Habitación en piso común',
    khrushchyovka: 'Khrushchiovka de una habitación',
    apartment: 'Apartamento de dos habitaciones',
    house: 'Casa propia'
  })[h] || 'Sin vivienda';
}

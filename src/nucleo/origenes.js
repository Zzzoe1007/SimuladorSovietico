/* ============================================================================
 * ORÍGENES — Punto de partida según la familia y el sexo registrado.
 * Cada origen fija los atributos iniciales y los rublos de la infancia.
 * ==========================================================================*/

'use strict';

const ORIGINS = {
  obrero: {
    label: 'Obrero',
    hint: 'Fábrica y barrio obrero: salud y sueldo modesto.',
    stats: { health: 78, intellect: 22, loyalty: 35, blat: 8, morale: 58 },
    rubles: 80
  },
  campesino: {
    label: 'Campesino',
    hint: 'Koljós: cuerpo curtido, menos escuela, más favores de aldea.',
    stats: { health: 84, intellect: 15, loyalty: 32, blat: 16, morale: 54 },
    rubles: 30
  },
  intelectual: {
    label: 'Intelectual',
    hint: 'Padres maestros o ingenieros: libros en casa, desconfianza oficial.',
    stats: { health: 70, intellect: 40, loyalty: 24, blat: 12, morale: 60 },
    rubles: 140
  },
  nomenklatura: {
    label: 'Nomenklatura',
    hint: 'Contactos y privilegios desde la cuna; el doble filo de la élite.',
    stats: { health: 74, intellect: 34, loyalty: 52, blat: 26, morale: 48 },
    rubles: 420
  }
};

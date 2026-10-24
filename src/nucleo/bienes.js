/* ============================================================================
 * BIENES — Inventario de posesiones tangibles.
 * Cada bien otorga un pequeño modificador anual (salud, moral, blat,
 * intelecto o lealtad). Se compran o se reciben mediante eventos.
 * ==========================================================================*/

'use strict';

/* ------------------------------------------------------------------ */
/* Bienes tangibles: pasivos anuales pequeños                         */
/* ------------------------------------------------------------------ */
const ITEMS = {
  boots:     { name: 'Botas de invierno',        desc: 'Cuero y fieltro. Los pies secos valen más que un discurso.', health: 0.25 },
  fridge:    { name: 'Frigorífico ZIL',          desc: 'La comida dura más; la vida doméstica, un poco menos gris.', morale: 0.35 },
  tv:        { name: 'Televisor Rubin',          desc: 'Dos canales y el noticiario. La ventana al país oficial.', morale: 0.3, loyalty: 0.1 },
  washer:    { name: 'Lavadora automática',      desc: 'Menos horas de cola en la lavandería común.', health: 0.15, morale: 0.25 },
  phone:     { name: 'Teléfono fijo',            desc: 'Una línea propia es un pequeño centro de poder.', blat: 0.45 },
  dacha:     { name: 'Dacha en las afueras',     desc: 'Patatas, setas y aire. El lujo permitido.', health: 0.7, morale: 0.45 },
  lada:      { name: 'Lada Zhiguli',             desc: 'Cuatro ruedas y una lista de espera de años.', morale: 0.35, blat: 0.2 },
  flat:      { name: 'Apartamento propio',       desc: 'Dos habitaciones, cocina y baño separado. Un mundo.', health: 0.4, morale: 0.5 },
  typewriter:{ name: 'Máquina de escribir',      desc: 'Para cartas, informes y textos que no se publican.', intellect: 0.3 },
  books:     { name: 'Biblioteca prohibida',     desc: 'Volúmenes que se prestan con las cortinas cerradas.', intellect: 0.35, loyalty: -0.15 },
  medals:    { name: 'Medallas y condecoraciones', desc: 'Metal sobre la solapa. Abre algunas puertas.', loyalty: 0.3, morale: 0.2 },
  suit:      { name: 'Traje occidental',         desc: 'Tejido importado. En una reunión, cambia cómo te miran.', blat: 0.3 },
  icon:      { name: 'Icono familiar',           desc: 'Oculta en un armario desde 1929. No se comenta.', morale: 0.3 },
  bike:      { name: 'Bicicleta',                desc: 'Transporte propio y ejercicio modesto.', health: 0.2, morale: 0.1 }
};

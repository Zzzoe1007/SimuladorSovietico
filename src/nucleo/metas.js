/* ============================================================================
 * METAS — Las cuatro grandes metas de vida.
 * Cada meta define:
 *   name/tag/desc  : textos que ve el jugador.
 *   threshold      : progreso interno necesario (el jugador siempre ve /100).
 *   progress(state): devuelve 0–100 según ahorros, blat, espera, etc.
 *   gate(state)    : condición final; si devuelve texto, aún no se puede cerrar.
 *   reward / done  : efectos al cumplirla y párrafo narrativo del cierre.
 * ==========================================================================*/

'use strict';

/* ------------------------------------------------------------------ */
/* Grandes metas                                                       */
/* ------------------------------------------------------------------ */
const GOALS = {
  flat: {
    id: 'flat',
    name: 'Un techo propio',
    tag: 'Apartamento de dos habitaciones',
    desc: 'Salir de la kommunalka. La lista de espera es larga, el comité decide y los contactos ayudan.',
    threshold: 90,
    progress(s) {
      const saving = clamp((s.rubles / 4500) * 100, 0, 50);
      const wait = s.flags.waitlist ? clamp(((s.year - s.flags.waitlist) / 5) * 40, 0, 40) : 0;
      const blat = clamp(s.stats.blat * 0.15, 0, 15);
      const boost = clamp(s.flags.flatBoost || 0, 0, 10);
      return Math.min(100, saving + wait + blat + boost);
    },
    gate(s) {
      if (!s.flags.waitlist) return 'Inscríbete en la lista de vivienda';
      if (s.year - s.flags.waitlist < 2) return 'Necesitas al menos 2 años de lista';
      if (s.rubles < CONFIG.apartmentPrice) return `Reúne ${fmtRub(CONFIG.apartmentPrice)} para la cooperativa`;
      return null;
    },
    reward: { housing: 'apartment', item: 'flat', morale: 18, health: 6, rubles: -CONFIG.apartmentPrice },
    done: 'Firmas el acta. Dos habitaciones, cocina propia y un balcón que da a un patio de asfalto. Por primera vez cierras una puerta que solo tú puedes abrir.'
  },
  star: {
    id: 'star',
    name: 'La élite protegida',
    tag: 'Ciencia o deporte de alto rendimiento',
    desc: 'Institutos, selecciones y mecenas del Estado. El talento abre la puerta; la lealtad la mantiene abierta.',
    threshold: 90,
    progress(s) {
      const train = clamp((s.flags.training || 0) / 6, 0, 1) * 40;
      const rep = clamp(s.flags.starRep || 0, 0, 10);
      return Math.min(100, s.stats.intellect * 0.5 + s.stats.loyalty * 0.15 + train + s.stats.blat * 0.12 + rep);
    },
    gate(s) {
      if ((s.flags.training || 0) < 6) return 'Completa 6 ciclos de entrenamiento o estudio dirigido';
      if (s.age < 24) return 'La élite no recluta antes de los 24';
      if (s.stats.intellect < 55) return 'Necesitas al menos 55 de intelecto';
      return null;
    },
    reward: { tier: 6, job: 'Investigador / atleta de élite', morale: 16, loyalty: 6, rubles: 1200, item: 'medals' },
    done: 'Tu nombre entra en una lista que no se publica. Laboratorio con acceso restringido o centro de entrenamiento en las afueras: el Estado te ha elegido, y eso también significa que te vigila.'
  },
  black: {
    id: 'black',
    name: 'El mercado negro',
    tag: 'Fartsovka y favores invisibles',
    desc: 'Jeans, discos, divisas y medicinas. Un segundo país dentro del país, con sus propias reglas y su propia policía.',
    threshold: 80,
    progress(s) {
      const deals = clamp((s.flags.deals || 0) / 6, 0, 1) * 40;
      const cash = clamp((s.rubles / 3000) * 100, 0, 25);
      const net = s.flags.black_network ? 15 : 0;
      return Math.min(100, s.stats.blat * 0.25 + cash + deals + net);
    },
    gate(s) {
      if ((s.flags.deals || 0) < 5) return 'Cierra 5 operaciones importantes';
      if (s.rubles < 2200) return 'Necesitas 2.200 ₽ de capital';
      return null;
    },
    reward: { item: 'lada', morale: 10, rubles: 2000, blat: 10 },
    done: 'Tienes un Lada, dos contactos en el aeropuerto y un teléfono que suena poco. Nunca sabrás si el hombre del abrigo gris te sigue por trabajo o por costumbre.'
  },
  party: {
    id: 'party',
    name: 'La carrera del Partido',
    tag: 'Nomenklatura y privilegios',
    desc: 'Actas, informes y lealtad demostrable. La seguridad material existe; el precio se paga en silencio.',
    threshold: 75,
    progress(s) {
      if (!s.party) return Math.min(45, s.stats.loyalty * 0.45);
      const rank = clamp((s.flags.rank || 0) / 3, 0, 1) * 30;
      return Math.min(100, s.stats.loyalty * 0.45 + rank + s.stats.blat * 0.15 + s.stats.intellect * 0.10 + 10);
    },
    gate(s) {
      if (!s.party) return 'Afíliate al PCUS';
      if ((s.flags.rank || 0) < 3) return 'Alcanza el tercer escalón del aparato';
      if (s.age < 28) return 'El aparato exige experiencia';
      if (s.stats.loyalty < 55) return 'Tu lealtad está bajo sospecha';
      return null;
    },
    reward: { tier: 7, job: 'Funcionario del Partido', housing: 'apartment', item: 'dacha', morale: -6, loyalty: 8 },
    done: 'Te asignan despacho, coche con chófer y una dacha. En el pasillo todos sonríen. En el informe anual, alguien ha subrayado tu nombre con lápiz.'
  }
};

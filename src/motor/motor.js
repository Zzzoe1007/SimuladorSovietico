/* ============================================================================
 * MOTOR — Estado, reglas y resolución (sin DOM).
 * Contiene la clase Game: creación del expediente, paso de año, elegibilidad
 * de opciones, aplicación de efectos, progreso de la meta, crisis y finales.
 * La interfaz solo lee este estado y lo pinta; nunca aplica reglas por su cuenta.
 * ==========================================================================*/

const EVENTS = Object.fromEntries(EVENT_LIST.map(e => [e.id, e]));

const STAT_KEYS = ['health', 'intellect', 'loyalty', 'blat', 'morale'];
const STAT_LABELS = {
  health: 'Salud',
  intellect: 'Intelecto',
  loyalty: 'Lealtad',
  blat: 'Blat',
  morale: 'Moral'
};

class Game {
  constructor(state) {
    this.s = state;
  }

  /* ------------------------------------------------------------ creación */
  static create(cfg) {
    const origin = ORIGINS[cfg.origin] || ORIGINS.obrero;
    const seed = (Math.floor(Math.random() * 1e9) >>> 0) || 1;
    const birthYear = Number(cfg.birthYear) || 1928;
    const name = (cfg.name || 'Iván Petrov').trim().slice(0, 28) || 'Iván Petrov';

    const s = {
      v: CONFIG.version,
      seed,
      rand: seed,
      name,
      sex: cfg.sex === 'mujer' ? 'mujer' : 'hombre',
      birthYear,
      origin: cfg.origin || 'obrero',
      year: birthYear - 1,
      age: -1,
      era: 'stalin',
      stats: { ...origin.stats },
      rubles: origin.rubles,
      tier: 0,
      job: 'Sin empleo',
      housing: 'kommunalka',
      spouse: false,
      children: 0,
      party: false,
      retired: false,
      items: [],
      flags: {},
      seen: [],
      cooldowns: {},
      queue: [],
      goal: null,
      log: [],
      event: null,
      outcome: null,
      phase: 'event',
      ended: null,
      flash: null,
      meta: { goalsCompleted: 0 }
    };

    const g = new Game(s);
    g.advance();
    return g;
  }

  /* ------------------------------------------------------------ consulta */
  get state() { return this.s; }

  get event() { return this.s.event; }

  goalDef() { return this.s.goal ? GOALS[this.s.goal.id] : null; }

  goalProgress() {
    if (!this.s.goal) return 0;
    if (this.s.goal.completed) return 100;
    return Math.min(100, Math.floor(GOALS[this.s.goal.id].progress(this.s)));
  }

  goalThreshold() {
    return this.goalDef()?.threshold || 100;
  }

  goalGate() {
    const def = this.goalDef();
    if (!def) return null;
    return def.gate(this.s);
  }

  income() { return incomeOf(this.s); }
  expenses() { return expensesOf(this.s); }

  canPick(opt) {
    const s = this.s;
    if (opt.cond && !opt.cond(s)) return false;
    if (opt.req && !opt.req(s)) return false;
    if (opt.cost && s.rubles < opt.cost) return false;
    if (opt.fx && typeof opt.fx.rubles === 'number' && opt.fx.rubles < 0) {
      if (s.rubles + opt.fx.rubles < 0) return false;
    }
    return true;
  }

  optionStatus(opt) {
    if (this.canPick(opt)) return { ok: true, reason: '' };
    const s = this.s;
    if (opt.cond && !opt.cond(s)) return { ok: false, reason: 'No disponible' };
    if (opt.cost && s.rubles < opt.cost) return { ok: false, reason: 'Fondos insuficientes' };
    if (opt.fx && opt.fx.rubles < 0 && s.rubles + opt.fx.rubles < 0) {
      return { ok: false, reason: 'Fondos insuficientes' };
    }
    return { ok: false, reason: opt.reqText ? 'Requiere ' + opt.reqText : 'No disponible' };
  }

  /* ------------------------------------------------------------ avance */
  advance() {
    const s = this.s;
    if (s.ended) return;

    if (s.phase === 'result') {
      s.phase = 'event';
      s.outcome = null;
      s.event = null;
    }

    if (s.flags.collapse_done) { this._endUSSR(); return; }
    if (s.year >= CONFIG.endYear && s.age >= 16) { this._endUSSR(); return; }

    // Acontecimientos encolados para el mismo año.
    if (s.queue.length) {
      const id = s.queue.shift();
      const ev = EVENTS[id];
      if (ev) { this._show(ev); return; }
    }

    let skippedFrom = null;
    let skippedTo = null;

    for (let guard = 0; guard < 12; guard++) {
      s.year++;
      s.age = s.year - s.birthYear;

      if (s.year > CONFIG.endYear) { this._endUSSR(); return; }

      this._yearly();
      if (s.ended) return;

      if (s.year === CONFIG.endYear) {
        if (!s.seen.includes('per_1991_coup') && !s.flags.coup_done) {
          s.flags.coup_done = true;
          this._show(EVENTS.per_1991_coup);
          return;
        }
        this._show(EVENTS.collapse_1991);
        return;
      }

      const ev = this._pickEvent();
      if (ev) {
        if (skippedFrom !== null) {
          this._log('note', skippedFrom === skippedTo
          ? `Año ${skippedFrom}: la infancia pasa entre la escuela, el patio y los turnos de la casa.`
          : `Años ${skippedFrom}–${skippedTo}: la infancia pasa entre la escuela, el patio y los turnos de la casa.`);
        }
        this._show(ev);
        return;
      }

      // Sin acontecimiento: los niños saltan años; los adultos tienen un año tranquilo.
      if (s.age < 18) {
        if (skippedFrom === null) skippedFrom = s.year;
        skippedTo = s.year;
        continue;
      }

      if (skippedFrom !== null) {
        this._log('note', skippedFrom === skippedTo
          ? `Año ${skippedFrom}: sin incidencias en el expediente.`
          : `Años ${skippedFrom}–${skippedTo}: sin incidencias en el expediente.`);
      }
      this._show(this._quiet());
      return;
    }
    this._show(this._quiet());
  }

  choose(index) {
    const s = this.s;
    if (s.ended || s.phase !== 'event' || !s.event) return false;
    const ev = s.event;
    const opt = ev.options[index];
    if (!opt || !this.canPick(opt)) return false;

    const before = this._snapshot();

    if (opt.cost) s.rubles = Math.max(0, s.rubles - opt.cost);
    this._applyFx(opt.fx || {});

    s.cooldowns[ev.id] = s.year;
    const repeatable = ev.once === false || ev.cooldown != null;
    if (!repeatable && !s.seen.includes(ev.id)) s.seen.push(ev.id);

    s.outcome = {
      eventId: ev.id,
      title: ev.title,
      text: opt.outcome || 'El año sigue su curso.',
      deltas: this._deltas(before)
    };
    s.event = null;
    s.phase = 'result';

    // El golpe de 1991 conduce al colapso en el mismo año.
    if (ev.id === 'per_1991_coup') s.queue.push('collapse_1991');

    const label = opt.label.length > 80 ? opt.label.slice(0, 77) + '…' : opt.label;
    this._log(ev.id.indexOf('crisis') === 0 ? 'crisis' : 'choice', `${label}. ${opt.outcome || ''}`);

    this._checkGoal();

    if (s.stats.health <= 0 && !s.ended) {
      this._end('Agotamiento físico', 'El cuerpo cedió antes que el expediente.');
    }
    if (s.flags.collapse_done && s.phase !== 'ended') {
      // La pantalla final se muestra al continuar.
    }

    return true;
  }

  /* ------------------------------------------------------------ año */
  _yearly() {
    const s = this.s;
    const era = eraFor(s.year);

    if (s.age === 0) {
      const origin = ORIGINS[s.origin];
      this._log('birth', `Nace ${s.name} en ${s.year}, en una familia de origen ${origin.label.toLowerCase()}. El país tiene ${s.year - 1922} años.`);
      s.era = era.id;
    }

    if (s.era !== era.id) {
      s.era = era.id;
      this._log('era', `Entra en escena: ${era.name} (${era.years}).`);
    }

    // Economía doméstica (solo adultos).
    if (s.age >= 18) {
      const inc = this.income();
      const exp = this.expenses();
      s.rubles += inc - exp;
      if (s.rubles < 0) {
        s.rubles = 0;
        s.stats.health = clamp(s.stats.health - 2);
        s.stats.morale = clamp(s.stats.morale - 3);
        this._log('economy', `El sueldo no cubre el mes: ${fmtRub(inc)} frente a ${fmtRub(exp)}. Se recorta la comida.`);
      }
    }

    // Fin de estudios.
    if (s.flags.studyUntil && s.year >= s.flags.studyUntil) {
      if (s.flags.uni) {
        s.tier = 5;
        s.job = 'Ingeniero / docente';
        this._log('note', 'Termina la universidad. Te asignan una plaza de ingeniero y un sueldo de 2.550 ₽ al año.');
      } else if (s.flags.tech) {
        s.tier = 4;
        s.job = 'Técnico de taller';
        this._log('note', 'Termina la escuela técnica. Entras como técnico en la fábrica, con delantal limpio y un sueldo algo mejor.');
      } else if (s.flags.army) {
        // La mili no deja un oficio: al licenciarse se vuelve al taller con categoría.
        s.tier = 3;
        s.job = 'Obrero cualificado';
        this._log('note', 'Termina el servicio militar. Vuelves a la fábrica con la cartilla y una categoría de obrero cualificado.');
      }
      s.flags.studyUntil = null;
    }

    // Desgaste biológico.
    let dh = 0;
    if (s.age <= 17) dh = 1.5;
    else if (s.age <= 39) dh = -0.25;
    else if (s.age <= 54) dh = -0.6;
    else if (s.age <= 69) dh = -1.2;
    else dh = -2.2;

    if (s.housing === 'kommunalka') dh -= 0.4;
    if (s.flags.drinker || s.flags.moonshine) dh -= 0.6;
    if (s.flags.wound || s.flags.combat_veteran) dh -= 0.3;
    if (s.flags.liquidator) dh -= 0.7;
    if (s.stats.morale < 25) dh -= 0.6;

    // Pasivos de los bienes.
    let dm = 0, db = 0, di = 0, dl = 0;
    for (const id of s.items) {
      const it = ITEMS[id];
      if (!it) continue;
      if (it.health) dh += it.health;
      if (it.morale) dm += it.morale;
      if (it.blat) db += it.blat;
      if (it.intellect) di += it.intellect;
      if (it.loyalty) dl += it.loyalty;
    }

    // Moral: regresa despacio hacia 50, con correctores sociales.
    if (s.stats.morale > 50) dm -= 0.25;
    else dm += 0.25;
    if (s.spouse) dm += 0.25;
    if (s.children > 0) dm += 0.12 * Math.min(3, s.children);
    if (s.housing === 'kommunalka') dm -= 0.3;
    if (s.year >= 1989) dm -= 0.2;

    s.stats.health = clamp(s.stats.health + dh);
    s.stats.morale = clamp(s.stats.morale + dm);
    s.stats.intellect = clamp(s.stats.intellect + di);
    s.stats.loyalty = clamp(s.stats.loyalty + dl);
    // Los contactos se gastan con el tiempo, pero un niño no pierde una red que aún no tiene.
    s.stats.blat = clamp(s.stats.blat - (s.age >= 18 ? 1.5 : 0) + db);

    // El riesgo político caduca si no se alimenta.
    if (s.flags.risk && s.year % 3 === 0) {
      s.flags.riskLevel = Math.max(0, (s.flags.riskLevel || 1) - 1);
      if (s.flags.riskLevel <= 0) { s.flags.risk = false; }
    }

    this._checkGoal();

    if (s.age % 10 === 0 && s.age > 0 && s.age < 100) {
      this._log('note', `Balance de la década: ${s.age} años, ${fmtRub(s.rubles)} ahorrados, ${s.job.toLowerCase()}, ${s.spouse ? 'casado/a' : 'sin cónyuge'}${s.children ? `, ${s.children} hijo(s)` : ''}.`);
    }

    if (s.stats.health <= 0 && !s.ended) {
      this._end('Agotamiento físico', 'La salud llegó a cero. El Estado anota la baja.');
      return;
    }

    this._mortality();
  }

  _mortality() {
    const s = this.s;
    let p = 0;
    if (s.age >= 62) p += (s.age - 60) * 0.010;
    if (s.stats.health < 55) p += (55 - s.stats.health) * 0.002;
    if (s.age >= CONFIG.maxAge) p = 1;
    if (p > 0 && rnd(s) < Math.min(0.85, p)) {
      if (s.stats.health < 40) {
        this._end('Enfermedad', 'El cuerpo llevaba años avisando. Una gripe, una infección, una operación a destiempo.');
      } else {
        this._end('Muerte natural', s.age >= 70 ? 'Murió en su cama, en un país que ya no era el mismo.' : 'El corazón se detuvo sin aviso.');
      }
    }
  }

  /* ------------------------------------------------------------ eventos */
  _eligible(e) {
    const s = this.s;
    const repeatable = e.once === false || e.cooldown != null;
    if (!repeatable && s.seen.includes(e.id)) return false;
    if (e.age != null && s.age !== e.age) return false;
    if (e.minAge != null && s.age < e.minAge) return false;
    if (e.maxAge != null && s.age > e.maxAge) return false;
    if (e.year != null && s.year !== e.year) return false;
    if (e.from != null && s.year < e.from) return false;
    if (e.to != null && s.year > e.to) return false;
    if (e.cond && !e.cond(s)) return false;
    if (e.cooldown) {
      const last = s.cooldowns[e.id];
      if (last != null && s.year - last < e.cooldown) return false;
    }
    return true;
  }

  _pickEvent() {
    const s = this.s;

    // 1) Efemérides exactas: la historia manda.
    const exact = EVENT_LIST.filter(e => e.year === s.year && this._eligible(e));
    if (exact.length) {
      const chosen = pickWeighted(s, exact);
      if (s.age === 18 && !s.goal && chosen.id !== 'great_goal') s.queue.push('great_goal');
      return chosen;
    }

    // 2) Hitos de edad (escuela, mayoría de edad).
    const milestone = EVENT_LIST.filter(e => e.milestone && e.age === s.age && this._eligible(e));
    if (milestone.length) return milestone[0];

    // 2-bis) El fin de la escuela no puede perderse por una efeméride.
    if (s.age >= 17 && s.tier === 0 && !s.seen.includes('teen_school_end')) {
      if (s.age >= 18 && !s.goal) s.queue.push('great_goal');
      return EVENTS.teen_school_end;
    }

    // 3) Gran meta pendiente.
    if (s.age >= 18 && !s.goal) return EVENTS.great_goal;

    // 4) Crisis según el estado vital.
    const crisis = this._crisis();
    if (crisis) return crisis;

    // 5) Bolsa general, con peso extra para los eventos de la meta elegida.
    const pool = EVENT_LIST.filter(e => this._eligible(e) && e.year == null);
    if (!pool.length) return null;

    const weighted = pool.map(e => ({
      ...e,
      weight: (e.weight || 1) * (e.id.indexOf('g_') === 0 ? 4 : 1)
    }));
    return pickWeighted(s, weighted);
  }

  _crisis() {
    const s = this.s;
    if (s.age < 16) return null;

    if (s.stats.health < 34 && this._eligible(EVENTS.crisis_health) && rnd(s) < 0.5) return EVENTS.crisis_health;
    if ((s.stats.loyalty < 36 || s.flags.risk) && this._eligible(EVENTS.crisis_kgb) && rnd(s) < 0.32) return EVENTS.crisis_kgb;
    if (s.rubles < 110 && this._eligible(EVENTS.crisis_money) && rnd(s) < 0.32) return EVENTS.crisis_money;
    if (this._eligible(EVENTS.crisis_winter) && rnd(s) < 0.13) return EVENTS.crisis_winter;
    return null;
  }

  _quiet() {
    const s = this.s;
    const inc = this.income();
    const exp = this.expenses();
    return {
      id: 'quiet_' + s.year,
      title: 'Un año sin sobresaltos',
      stamp: 'Registro anual',
      text: `El año pasa entre el trabajo, la cola y la casa. Ingresos: ${fmtRub(inc)}. Gastos: ${fmtRub(exp)}. Ahorros: ${fmtRub(s.rubles)}. A veces la paz también es una forma de suerte.`,
      options: [{
        label: 'Pasar el año',
        fx: { morale: 1 },
        outcome: 'El tiempo avanza. Nada memorable, nada irreparable.'
      }]
    };
  }

  _show(ev) {
    if (!ev) return;
    this.s.event = ev;
    this.s.phase = 'event';
  }

  /* ------------------------------------------------------------ efectos */
  _applyFx(fx) {
    const s = this.s;
    if (!fx) return;

    for (const k of STAT_KEYS) {
      if (typeof fx[k] === 'number') s.stats[k] = clamp(s.stats[k] + fx[k]);
    }

    if (typeof fx.rubles === 'number') s.rubles = Math.max(0, s.rubles + fx.rubles);
    if (typeof fx.rublesPct === 'number') s.rubles = Math.max(0, s.rubles * (1 + fx.rublesPct / 100));

    if (fx.item && !s.items.includes(fx.item)) s.items.push(fx.item);
    if (fx.removeItem) s.items = s.items.filter(i => i !== fx.removeItem);

    if (fx.flag) s.flags[fx.flag] = true;
    if (fx.flags) Object.assign(s.flags, fx.flags);

    if (fx.risk) {
      s.flags.risk = true;
      s.flags.riskLevel = (s.flags.riskLevel || 0) + fx.risk;
    }

    for (const key of ['training', 'deals', 'rank', 'starRep', 'flatBoost']) {
      if (typeof fx[key] === 'number') {
        s.flags[key] = Math.max(0, (s.flags[key] || 0) + fx[key]);
      }
    }

    if (fx.waitlist && !s.flags.waitlist) s.flags.waitlist = s.year;
    if (fx.spouse) s.spouse = true;
    if (fx.child) s.children += fx.child;
    if (fx.party) s.party = true;
    if (fx.tier != null) s.tier = fx.tier;
    if (fx.job) s.job = fx.job;
    if (fx.housing) s.housing = fx.housing;
    if (fx.retired) s.retired = true;
    if (fx.army) s.flags.army = true;

    if (fx.study) s.flags.studyUntil = s.year + fx.study;

    if (fx.goal) this._setGoal(fx.goal);

    if (fx.death && !s.ended) this._end('Decisión fatal', 'Una decisión cerró el expediente antes de tiempo.');
  }

  _setGoal(id) {
    if (!GOALS[id]) return;
    this.s.goal = {
      id,
      since: this.s.year,
      progress: 0,
      completed: false,
      completedYear: null
    };
  }

  _checkGoal() {
    const s = this.s;
    if (!s.goal || s.goal.completed) return;
    const def = GOALS[s.goal.id];
    if (!def) return;

    const p = def.progress(s);
    s.goal.progress = Math.min(100, Math.floor(p));
    if (p < (def.threshold || 100)) return;
    if (def.gate(s)) return;

    s.goal.completed = true;
    s.goal.completedYear = s.year;
    s.meta.goalsCompleted++;
    this._applyFx(def.reward || {});
    this._log('goal', `META CUMPLIDA · ${def.name}. ${def.done}`);
    s.flash = { text: 'Meta cumplida: ' + def.name, year: s.year };
  }

  /* ------------------------------------------------------------ deltas */
  _snapshot() {
    return {
      stats: { ...this.s.stats },
      rubles: this.s.rubles,
      items: [...this.s.items],
      spouse: this.s.spouse,
      children: this.s.children,
      party: this.s.party,
      goalProgress: this.goalProgress()
    };
  }

  _deltas(before) {
    const s = this.s;
    const out = [];

    for (const k of STAT_KEYS) {
      const d = Math.round(s.stats[k]) - Math.round(before.stats[k]);
      if (d !== 0) out.push({ key: k, label: STAT_LABELS[k], value: d, tone: d > 0 ? 'good' : 'bad' });
    }

    const dr = Math.round(s.rubles) - Math.round(before.rubles);
    if (dr !== 0) out.push({ key: 'rubles', label: 'Rublos', value: dr, tone: dr > 0 ? 'good' : 'bad' });

    if (s.goal) {
      const now = this.goalProgress();
      const dg = now - before.goalProgress;
      if (dg > 0) out.push({ key: 'goal', label: 'Meta', value: dg, tone: 'goal' });
    }

    for (const it of s.items) {
      if (!before.items.includes(it)) out.push({ key: 'item', label: ITEMS[it]?.name || it, value: 1, tone: 'good' });
    }

    if (s.spouse && !before.spouse) out.push({ key: 'spouse', label: 'Matrimonio', value: 1, tone: 'neutral' });
    if (s.children > before.children) out.push({ key: 'child', label: 'Hijo', value: s.children - before.children, tone: 'neutral' });
    if (s.party && !before.party) out.push({ key: 'party', label: 'Carné del PCUS', value: 1, tone: 'neutral' });

    return out;
  }

  /* ------------------------------------------------------------ final */
  _end(cause, detail) {
    const s = this.s;
    if (s.ended) return;
    s.ended = { type: 'death', cause, detail, year: s.year, age: s.age };
    s.phase = 'ended';
    s.event = null;
    this._log('death', `${s.name} muere en ${s.year}, a los ${s.age} años. ${detail}`);
  }

  _endUSSR() {
    const s = this.s;
    if (s.ended) return;
    const projected = Math.max(s.age + 1, Math.min(96, Math.round(72 + s.stats.health / 12 + rnd(s) * 8)));
    s.ended = {
      type: 'ussr',
      year: 1991,
      age: s.age,
      projected,
      detail: 'La Unión se disuelve. Tu expediente pasa a un archivo que ya no tiene país.'
    };
    s.phase = 'ended';
    s.event = null;
    this._log('death', `${s.name} tiene ${s.age} años cuando la URSS deja de existir. El epílogo calcula una vida de ${projected} años.`);
  }

  seals() {
    const s = this.s;
    const out = [];
    if (s.goal?.completed) out.push('Meta cumplida');
    if (s.flags.combat_veteran || s.flags.afghan_veteran) out.push('Veterano de guerra');
    if (s.flags.liquidator) out.push('Liquidador de Chernóbil');
    if (s.party) out.push('Miembro del PCUS');
    if (s.tier === 7) out.push('Nomenklatura');
    if (s.flags.dissident) out.push('Voz disidente');
    if (s.flags.informer) out.push('Colaborador');
    if (s.children > 0) out.push(s.children === 1 ? 'Padre/madre de familia' : `Familia de ${s.children}`);
    if (s.items.includes('lada')) out.push('Propietario de un Lada');
    if (s.items.includes('flat') || s.housing === 'apartment') out.push('Techo propio');
    if (s.rubles >= 8000) out.push('Ahorrador');
    if (s.age >= 70) out.push('Longevo');
    if (s.flags.family_repressed) out.push('Familia represaliada');
    if (s.flags.black_network) out.push('Mercado negro');
    if (s.flags.uni) out.push('Estudios superiores');
    return out;
  }

  score() {
    const s = this.s;
    const avg = STAT_KEYS.reduce((a, k) => a + s.stats[k], 0) / STAT_KEYS.length;
    let pts = avg * 0.30;
    if (s.goal) pts += s.goal.completed ? 40 : Math.min(25, this.goalProgress() * 0.25);
    pts += Math.min(10, s.rubles / 1000);
    pts += s.spouse ? 4 : 0;
    pts += Math.min(9, s.children * 3);
    if (s.age >= 60) pts += 6;
    if (s.flags.combat_veteran || s.flags.afghan_veteran || s.flags.liquidator) pts += 3;
    pts += Math.min(8, s.items.length * 0.8);
    return Math.max(0, Math.min(100, Math.round(pts)));
  }

  rank() {
    const p = this.score();
    if (p >= 85) return 'Figura del siglo';
    if (p >= 70) return 'Vida plena';
    if (p >= 55) return 'Superviviente';
    if (p >= 40) return 'Vida gris';
    return 'Expediente menor';
  }

  endNote() {
    const s = this.s;
    if (s.ended?.type === 'ussr') {
      return 'Entre 1989 y 1991 el sistema soviético se deshizo: el bloque del Este se liberó, las repúblicas declararon la independencia y el 26 de diciembre de 1991 el Soviet Supremo disolvió la Unión. Los ahorros de toda una vida se evaporaron con la hiperinflación; algunos prosperaron, muchos no.';
    }
    const y = s.ended?.year ?? s.year;
    if (y <= 1953) return 'Murió bajo Stalin: colectivización, industrialización acelerada, Gran Guerra Patria y un sistema de campos de trabajo. También alfabetización masiva, sanidad pública y una movilidad social sin precedentes para millones de campesinos.';
    if (y <= 1964) return 'Murió durante el Deshielo: amnistía, vivienda masiva en bloques de paneles, Sputnik y Gagarin. La liberalización tuvo límites: Hungría 1956, Novocherkassk 1962 y la censura continuaron.';
    if (y <= 1984) return 'Murió en el estancamiento: estabilidad cotidiana y vivienda garantizada, junto a escasez crónica, privilegios de la nomenklatura, guerra en Afganistán y represión de disidentes.';
    return 'Murió en la Perestroika: glásnost, cooperativas y el fin de la censura, pero también colas, racionamiento, conflictos nacionales y el colapso del Estado que había organizado su vida.';
  }

  epilogue() {
    const s = this.s;
    const e = s.ended;
    if (!e || e.type !== 'ussr') return '';
    const goal = s.goal
      ? (s.goal.completed ? `Cumpliste tu meta («${GOALS[s.goal.id].name}») antes del colapso.` : `Tu meta («${GOALS[s.goal.id].name}») quedó en el ${this.goalProgress()} %.`)
      : 'Nunca llegaste a elegir una gran meta.';
    return `Sobreviviste ${e.projected - e.age} años más, hasta ${1991 + (e.projected - e.age)}. ${goal} Los ahorros en rublos perdieron casi todo su valor; la pensión, cuando llegó, alcanzaba para poco. En el nuevo país, tu expediente soviético sirvió para algunas cosas y estorbó para otras.`;
  }

  /* ------------------------------------------------------------ registro */
  _log(kind, text) {
    this.s.log.push({ y: this.s.year, a: this.s.age, kind, text });
  }

  logText() {
    const s = this.s;
    const head = [
      'EXPEDIENTE PERSONAL · URSS',
      `Titular: ${s.name}`,
      `Nacimiento: ${s.birthYear}`,
      `Origen: ${ORIGINS[s.origin].label}`,
      `Expediente: URSS-${s.birthYear}-${String(s.seed).slice(-4)}`,
      '',
      'REGISTRO DE VIDA'
    ];
    const body = s.log.map(l => `[${l.y}] ${l.text}`);
    return head.concat(body).join('\n');
  }

  /* ------------------------------------------------------------ guardado */
  serialize() {
    return JSON.parse(JSON.stringify(this.s));
  }

  static revive(state) {
    if (!state || state.v !== CONFIG.version) return null;
    const g = new Game(state);
    return g;
  }
}

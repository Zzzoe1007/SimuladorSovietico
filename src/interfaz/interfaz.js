/* ============================================================================
 * INTERFAZ — DOM, pantallas, sonido y guardado.
 * Lee el estado del motor y lo pinta. Captura clics y teclas, muestra avisos,
 * gestiona las pantallas (inicio, juego, final), el guardado en localStorage
 * y la descarga del registro en .txt.
 * ==========================================================================*/

const UI = (() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  let game = null;
  let toastTimer = null;

  const esc = (str) => String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const fmt = (n) => new Intl.NumberFormat('es-ES').format(Math.round(n));
  const rub = (n) => fmt(n) + ' ₽';
  const pct = (n) => Math.max(0, Math.min(100, Math.round(n)));

  /* --------------------------------------------------------------- guardado */
  function storageOk() {
    try {
      const k = '__urss_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  function save() {
    if (!game || game.state.ended) return false;
    if (!storageOk()) return false;
    try {
      localStorage.setItem(CONFIG.saveKey, JSON.stringify(game.serialize()));
      return true;
    } catch (e) { return false; }
  }

  function clearSave() {
    try { localStorage.removeItem(CONFIG.saveKey); } catch (e) {}
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(CONFIG.saveKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function bestScore() {
    try { return Number(localStorage.getItem(CONFIG.bestKey)) || 0; } catch (e) { return 0; }
  }

  function setBest(score) {
    try {
      if (score > bestScore()) localStorage.setItem(CONFIG.bestKey, String(score));
    } catch (e) {}
  }

  /* --------------------------------------------------------------- pantallas */
  function show(screen) {
    ['intro', 'game', 'end'].forEach(name => {
      const el = $('#screen-' + name);
      if (el) el.hidden = (name !== screen);
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function toast(text, tone = 'gold') {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:80;max-width:340px;padding:12px 16px;border:1px solid #5a4a26;background:#1a1710;color:#e7dfcb;font-size:12px;letter-spacing:.06em;box-shadow:0 12px 30px rgba(0,0,0,.5);transform:translateY(14px);opacity:0;transition:all .25s ease;';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.borderColor = tone === 'red' ? '#7c2f28' : '#5a4a26';
    requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.transform = 'translateY(14px)';
      el.style.opacity = '0';
    }, 3200);
  }

  /* --------------------------------------------------------------- inicio */
  let introBound = false;
  let introActionsBound = false;

  function initIntro() {
    const hint = $('#origin-hint');
    const updateHint = () => {
      const val = document.querySelector('input[name="origin"]:checked')?.value || 'obrero';
      hint.textContent = ORIGINS[val].hint;
    };
    if (!introBound) {
      $$('input[name="origin"]').forEach(r => r.addEventListener('change', updateHint));
      introBound = true;
    }
    updateHint();

    const saved = loadSave();
    const btnContinue = $('#btn-continue');
    const note = $('#intro-save-note');
    btnContinue.hidden = true;
    note.hidden = true;
    note.textContent = '';
    if (saved) {
      const revived = Game.revive(saved);
      if (revived) {
        btnContinue.hidden = false;
        note.hidden = false;
        note.textContent = `Expediente en curso: ${revived.state.name}, ${revived.state.year} (${revived.state.age} años).`;
      } else {
        clearSave();
      }
    }
    const best = bestScore();
    if (best > 0) {
      note.hidden = false;
      note.textContent = (note.textContent ? note.textContent + ' · ' : '') + `Mejor calificación archivada: ${best}/100.`;
    }

    if (!introActionsBound) {
      introActionsBound = true;

      btnContinue.addEventListener('click', () => {
        const data = loadSave();
        const revived = data ? Game.revive(data) : null;
        if (!revived) { toast('No se pudo recuperar el expediente.', 'red'); return; }
        game = revived;
        show('game');
        render();
        toast('Expediente recuperado.');
      });

      $('#intro-form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = $('#name-input').value.trim() || 'Iván Petrov';
        const sex = document.querySelector('input[name="sex"]:checked')?.value || 'hombre';
        const origin = document.querySelector('input[name="origin"]:checked')?.value || 'obrero';
        const birthYear = Number(document.querySelector('input[name="cohort"]:checked')?.value || 1928);

        if (loadSave() && !confirm('Ya hay un expediente abierto. ¿Empezar uno nuevo y descartarlo?')) return;

        game = Game.create({ name, sex, origin, birthYear });
        save();
        show('game');
        render();
      });
    }
  }

  /* --------------------------------------------------------------- cabecera */
  function buildTimeline() {
    const tl = $('#timeline');
    if (!tl || tl.dataset.built) return;
    tl.dataset.built = '1';
    const total = CONFIG.endYear - CONFIG.startYear + 1;
    ERAS.forEach(era => {
      const seg = document.createElement('div');
      seg.className = 'seg';
      seg.dataset.era = era.id;
      seg.style.width = ((era.to - era.from + 1) / total * 100) + '%';
      seg.title = `${era.name} (${era.years})`;
      const label = document.createElement('span');
      label.textContent = era.id === 'stagnation' ? 'ESTANC.' : era.id === 'perestroika' ? 'PERESTR.' : era.id === 'thaw' ? 'DESHIELO' : 'STALIN';
      seg.appendChild(label);
      tl.insertBefore(seg, $('#timeline-marker'));
    });
  }

  function renderHeader() {
    const s = game.state;
    $('#hdr-name').textContent = s.name;
    $('#case-no').textContent = `URSS-${s.birthYear}-${String(s.seed).slice(-4)}`;
    $('#hdr-year').textContent = s.year;
    $('#hdr-age').textContent = s.age;
    $('#hdr-era').textContent = eraFor(s.year).name;

    buildTimeline();
    const marker = $('#timeline-marker');
    const total = CONFIG.endYear - CONFIG.startYear;
    const left = ((Math.min(CONFIG.endYear, Math.max(CONFIG.startYear, s.year)) - CONFIG.startYear) / total) * 100;
    marker.style.left = left + '%';
    const activeEra = eraFor(s.year);
    $$('#timeline .seg').forEach(seg => {
      const on = seg.dataset.era === activeEra.id;
      seg.classList.toggle('on', on);
      // Cada era se ilumina con su propio color; el resto queda apagado.
      seg.style.background = on
        ? `linear-gradient(180deg, ${activeEra.color}dd, ${activeEra.color}44)`
        : '';
    });
  }

  /* --------------------------------------------------------------- estado */
  const STAT_META = [
    { key: 'health', label: 'Salud / vitalidad', short: 'Salud' },
    { key: 'intellect', label: 'Intelecto / educación', short: 'Intelecto' },
    { key: 'loyalty', label: 'Fidelidad ideológica', short: 'Lealtad' },
    { key: 'blat', label: 'Red de contactos (blat)', short: 'Blat' },
    { key: 'morale', label: 'Estado psicológico', short: 'Moral' }
  ];

  function renderStats() {
    const s = game.state;
    const box = $('#stats-body');
    box.innerHTML = STAT_META.map(m => {
      const v = pct(s.stats[m.key]);
      return `
        <div class="stat ${v < 25 ? 'danger' : ''}">
          <div class="stat-head"><span>${m.label}</span><span class="stat-val">${v}%</span></div>
          <div class="track"><div class="fill f-${m.key}" style="width:${v}%"></div></div>
        </div>`;
    }).join('');

    const inc = game.income();
    const exp = game.expenses();
    const isChild = s.age < 18;
    const fam = s.spouse ? (s.children ? `Casado/a · ${s.children} hijo(s)` : 'Casado/a') : (s.children ? `${s.children} hijo(s)` : 'Soltero/a');
    const party = s.party ? 'PCUS' : 'Sin partido';

    $('#resources-body').innerHTML = `
      <div class="flex items-end justify-between">
        <div>
          <div class="label">Ahorros</div>
          <div class="font-display text-2xl text-[var(--gold)] mono-num">${rub(s.rubles)}</div>
        </div>
        <div class="text-right text-[10px] leading-5">
          ${isChild
            ? '<div class="muted">Manutención<br>familiar</div>'
            : `<div class="text-[#8fae72]">+ ${rub(inc)} / año</div>
               <div class="text-[#c98b78]">− ${rub(exp)} / año</div>`}
        </div>
      </div>
      <div class="divider-dots my-3"></div>
      <dl class="text-[11.5px] space-y-1.5">
        <div class="flex justify-between gap-2"><dt class="muted">Trabajo</dt><dd class="text-right">${esc(s.job)}</dd></div>
        <div class="flex justify-between gap-2"><dt class="muted">Vivienda</dt><dd class="text-right">${esc(housingName(s.housing))}</dd></div>
        <div class="flex justify-between gap-2"><dt class="muted">Familia</dt><dd class="text-right">${esc(fam)}</dd></div>
        <div class="flex justify-between gap-2"><dt class="muted">Partido</dt><dd class="text-right">${party}</dd></div>
      </dl>
      <div class="divider-dots my-3"></div>
      <div class="label mb-2">Bienes registrados</div>
      <div class="flex flex-wrap gap-1.5">
        ${s.items.length ? s.items.map(id => {
          const it = ITEMS[id] || { name: id, desc: '' };
          return `<span class="chip chip-neutral" title="${esc(it.desc)}">${esc(it.name)}</span>`;
        }).join('') : '<span class="muted text-[11px]">Ninguno. La casa está vacía.</span>'}
      </div>`;
  }

  function renderGoal() {
    const s = game.state;
    const box = $('#goal-body');
    const stamp = $('#goal-status-stamp');
    if (!s.goal) {
      stamp.hidden = true;
      box.innerHTML = `<p class="text-[12px] dim leading-relaxed">A los 18 años el expediente exigirá una gran meta: vivienda, élite, mercado negro o carrera del Partido.</p>
        <p class="muted text-[10px] mt-2">Edad actual: ${s.age}. Faltan ${Math.max(0, 18 - s.age)} años.</p>`;
      return;
    }
    const def = GOALS[s.goal.id];
    const prog = game.goalProgress();
    const gate = game.goalGate();
    stamp.hidden = !s.goal.completed;
    box.innerHTML = `
      <div class="font-display text-lg leading-tight">${esc(def.name)}</div>
      <div class="muted text-[10px] tracking-wider uppercase mt-0.5">${esc(def.tag)}</div>
      <div class="mt-3">
        <div class="stat-head"><span>Progreso</span><span class="stat-val">${prog} / 100</span></div>
        <div class="track" style="height:8px"><div class="fill" style="width:${prog}%;background:linear-gradient(90deg,#7a5a2c,#d0ad63)"></div></div>
      </div>
      <p class="text-[11px] dim mt-2 leading-snug">${esc(def.desc)}</p>
      <p class="text-[10px] mt-2 ${s.goal.completed ? 'text-[#a8c08d]' : 'text-[var(--muted)]'}">
        ${s.goal.completed ? 'Cumplida en ' + s.goal.completedYear + '.' : (gate ? 'Pendiente: ' + esc(gate) : 'Los requisitos están cubiertos. Esperando el cierre del expediente.')}
      </p>`;
  }

  /* --------------------------------------------------------------- dilema */
  function renderEvent() {
    const s = game.state;
    const panel = $('#event-panel');
    const stamp = $('#event-stamp');
    const yearEl = $('#event-year');
    const title = $('#event-title');
    const text = $('#event-text');
    const options = $('#event-options');
    const result = $('#event-result');

    yearEl.textContent = s.year;

    if (s.phase === 'result' && s.outcome) {
      stamp.textContent = 'Resolución';
      stamp.className = 'stamp stamp-gold';
      title.textContent = s.outcome.title;
      text.textContent = 'La decisión está tomada. El registro de vida conserva el resultado.';
      options.hidden = true;
      options.innerHTML = '';
      result.hidden = false;

      const chips = (s.outcome.deltas || []).map(d => {
        const tone = d.tone === 'good' ? 'chip-good' : d.tone === 'bad' ? 'chip-bad' : d.tone === 'goal' ? 'chip-goal' : 'chip-neutral';
        const val = d.key === 'rubles' ? (d.value > 0 ? '+' : '') + rub(d.value) :
          d.key === 'item' || d.key === 'spouse' || d.key === 'child' || d.key === 'party' ? d.label :
          `${d.label} ${d.value > 0 ? '+' : ''}${d.value}`;
        return `<span class="chip ${tone}">${esc(val)}</span>`;
      }).join('');

      result.innerHTML = `
        <div class="fade-in">
          <p class="text-[15px] leading-relaxed">${esc(s.outcome.text)}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">${chips || '<span class="chip chip-neutral">Sin cambios</span>'}</div>
          <button data-next class="btn btn-primary mt-6">Continuar →</button>
        </div>`;
      return;
    }

    const ev = s.event;
    if (!ev) {
      stamp.textContent = 'Archivo';
      title.textContent = 'Expediente en pausa';
      text.textContent = 'No hay ningún acontecimiento pendiente.';
      options.hidden = true;
      result.hidden = true;
      return;
    }

    stamp.textContent = ev.stamp || 'Archivo';
    stamp.className = 'stamp ' + (ev.id.indexOf('crisis') === 0 ? 'stamp-red' : ev.id.indexOf('g_') === 0 ? 'stamp-gold' : 'stamp-red');
    title.textContent = ev.title;
    text.textContent = ev.text;
    options.hidden = false;
    result.hidden = true;
    result.innerHTML = '';

    options.innerHTML = ev.options.map((o, i) => {
      const st = game.optionStatus(o);
      // La descripción (sub) suele incluir ya el coste o el requisito.
      // Evitamos repetirlo: si la opción está bloqueada y hay descripción,
      // basta con mostrarla; el motivo solo aparece cuando aporta algo nuevo.
      let detail = '';
      if (o.sub) {
        detail = `<span class="cost${st.ok ? '' : ' warn'}">${esc(o.sub)}</span>`;
      } else if (!st.ok) {
        detail = `<span class="cost warn">${esc(st.reason)}</span>`;
      } else if (o.reqText) {
        detail = `<span class="cost">Requiere: ${esc(o.reqText)}</span>`;
      }
      return `
        <button class="option" data-i="${i}" ${st.ok ? '' : 'disabled'}>
          <span class="num">${i + 1}</span>
          <span class="txt">
            <span class="block">${esc(o.label)}</span>
            ${detail}
          </span>
        </button>`;
    }).join('');
  }

  /* --------------------------------------------------------------- registro */
  function renderLog() {
    const s = game.state;
    const list = $('#log-list');
    const kindClass = {
      birth: 'is-choice', era: 'is-era', choice: 'is-choice', crisis: 'is-crisis',
      goal: 'is-goal', death: 'is-death', economy: 'is-crisis', note: ''
    };
    list.innerHTML = s.log.map(l => `
      <div class="log-entry ${kindClass[l.kind] || ''}">
        <div class="log-year">${l.y}</div>
        <div class="log-text">${esc(l.text)}</div>
      </div>`).join('');
    $('#log-count').textContent = s.log.length;
    list.scrollTop = list.scrollHeight;
  }

  function render() {
    if (!game) return;
    const s = game.state;
    if (s.ended) { renderEnd(); return; }
    show('game');
    renderHeader();
    renderStats();
    renderGoal();
    renderEvent();
    renderLog();

    if (s.flash) {
      toast(s.flash.text);
      s.flash = null;
    }
  }

  /* --------------------------------------------------------------- final */
  function renderEnd() {
    const s = game.state;
    const e = s.ended;
    const score = game.score();

    show('end');
    setBest(score);
    clearSave();

    $('#end-name').textContent = s.name;
    $('#end-years').textContent = e.type === 'ussr'
      ? `${s.birthYear} – 1991 · ${s.age} años al desaparecer el país`
      : `${s.birthYear} – ${e.year} · ${e.age} años`;

    if (e.type === 'ussr') {
      $('#end-stamp').textContent = 'FIN DE LA UNIÓN';
      $('#end-cause').textContent = `El 26 de diciembre de 1991 la URSS dejó de existir. Tenías ${s.age} años.`;
      $('#end-note').textContent = game.epilogue() + ' ' + game.endNote();
    } else {
      $('#end-stamp').textContent = 'ARCHIVADO';
      $('#end-cause').textContent = `${e.cause}. ${e.detail}`;
      $('#end-note').textContent = game.endNote();
    }

    $('#end-score').textContent = score;
    $('#end-rank').textContent = game.rank();
    $('#end-goal').textContent = s.goal
      ? `Gran meta: ${GOALS[s.goal.id].name} — ${s.goal.completed ? 'cumplida en ' + s.goal.completedYear : 'incompleta (' + game.goalProgress() + '%)'}.`
      : 'Gran meta: nunca elegida.';

    const seals = game.seals();
    $('#end-seals').innerHTML = seals.length
      ? seals.map(t => `<span class="stamp stamp-gold text-[9px]">${esc(t)}</span>`).join('')
      : '<span class="stamp stamp-steel text-[9px]">Sin sellos</span>';

    $('#end-stats').innerHTML = STAT_META.map(m => `
      <div class="panel-soft p-2 text-center">
        <div class="label">${m.short}</div>
        <div class="font-display text-lg">${pct(s.stats[m.key])}</div>
      </div>`).join('');
  }

  function downloadLog() {
    if (!game) return;
    const s = game.state;
    const extra = [
      '',
      'CIERRE',
      `Año: ${s.ended ? s.ended.year : s.year}`,
      `Edad: ${s.ended ? s.ended.age : s.age}`,
      s.ended ? `Tipo: ${s.ended.type === 'ussr' ? 'Fin de la URSS' : s.ended.cause}` : '',
      `Calificación: ${game.score()}/100 (${game.rank()})`,
      s.goal ? `Meta: ${GOALS[s.goal.id].name} — ${s.goal.completed ? 'cumplida' : 'incompleta'}` : '',
      '',
      'Sellos: ' + (game.seals().join(', ') || 'ninguno')
    ];
    const blob = new Blob([game.logText() + '\n' + extra.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expediente-${s.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Registro descargado.');
  }

  /* --------------------------------------------------------------- acciones */
  function choose(i) {
    if (!game) return;
    const ok = game.choose(i);
    if (!ok) { toast('Esa opción no está disponible.', 'red'); return; }
    save();
    render();
  }

  function next() {
    if (!game) return;
    game.advance();
    save();
    render();
  }

  function openHelp(v) {
    const m = $('#help-modal');
    if (m) m.hidden = !v;
  }

  /* --------------------------------------------------------------- eventos UI */
  function bind() {
    document.addEventListener('click', (ev) => {
      const opt = ev.target.closest('[data-i]');
      if (opt && !opt.disabled) { choose(Number(opt.dataset.i)); return; }
      if (ev.target.closest('[data-next]')) { next(); return; }
    });

    document.addEventListener('keydown', (ev) => {
      if (!game || game.state.ended) return;
      const tag = (ev.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (!$('#help-modal').hidden) {
        if (ev.key === 'Escape') openHelp(false);
        return;
      }
      if (game.state.phase === 'result') {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); next(); }
        return;
      }
      const n = Number(ev.key);
      if (n >= 1 && n <= 4) {
        const btn = document.querySelector(`#event-options [data-i="${n - 1}"]`);
        if (btn && !btn.disabled) choose(n - 1);
      }
    });

    $('#btn-help')?.addEventListener('click', () => openHelp(true));
    $('#btn-end-help')?.addEventListener('click', () => openHelp(true));
    $('#btn-close-help')?.addEventListener('click', () => openHelp(false));
    $('#btn-close-help-2')?.addEventListener('click', () => openHelp(false));
    $('#help-modal')?.addEventListener('click', (ev) => { if (ev.target.id === 'help-modal') openHelp(false); });

    $('#btn-save')?.addEventListener('click', () => {
      if (save()) toast('Expediente guardado en este navegador.');
      else toast('No se pudo guardar (almacenamiento no disponible).', 'red');
    });

    $('#btn-download-log')?.addEventListener('click', downloadLog);
    $('#btn-download')?.addEventListener('click', downloadLog);

    $('#btn-abandon')?.addEventListener('click', () => {
      if (!confirm('¿Abandonar este expediente? Se perderá el progreso no archivado.')) return;
      clearSave();
      game = null;
      show('intro');
      initIntro();
    });

    $('#btn-restart')?.addEventListener('click', () => {
      game = null;
      clearSave();
      show('intro');
      initIntro();
    });

    window.addEventListener('pagehide', () => { if (game && !game.state.ended) save(); });
    window.addEventListener('beforeunload', () => { if (game && !game.state.ended) save(); });
  }

  /* --------------------------------------------------------------- arranque */
  function init() {
    bind();
    initIntro();
    show('intro');
  }

  return { init, render, save, get game() { return game; } };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', UI.init);
} else {
  UI.init();
}

// Acceso de depuración desde la consola.
window.__URSS__ = { UI, Game, GOALS, EVENTS, EVENT_LIST };

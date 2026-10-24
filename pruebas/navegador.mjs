/* ============================================================================
 * PRUEBA 3 — Partida real en navegador (headless).
 *
 *   node pruebas/navegador.mjs            # prueba index.html (modular)
 *   node pruebas/navegador.mjs --dist     # prueba dist/urss-expediente.html
 *
 * Abre el juego por file://, juega 6 partidas completas pulsando botones y
 * comprueba que no hay errores JS ni pantallas atascadas. Requiere Chrome.
 * ==========================================================================*/
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ } from '../herramientas/orden-carga.mjs';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const usarDist = process.argv.includes('--dist');
const origen = path.join(RAIZ, usarDist ? 'dist/urss-expediente.html' : 'index.html');

if (!fs.existsSync(origen)) {
  console.error('No existe', origen, '→ ejecuta antes: node build.mjs');
  process.exit(1);
}

const html = fs.readFileSync(origen, 'utf8');
if (!html.includes('</body>')) {
  console.error('El HTML no tiene </body>; no se puede inyectar la prueba.');
  process.exit(1);
}

const inyeccion = `
<script>
window.__errors = [];
window.onerror = (m) => { window.__errors.push(String(m)); };
window.addEventListener('unhandledrejection', e => window.__errors.push('rejection:' + e.reason));
window.confirm = () => true;

function score(o) {
  const fx = o.fx || {};
  return (fx.health || 0) * 2 + (fx.morale || 0) * 0.4 + (fx.rubles || 0) / 40
    + (fx.waitlist ? 20 : 0) + (fx.study ? 8 : 0) + (fx.item ? 8 : 0) - (fx.risk || 0) * 5;
}

function jugarUna(n) {
  document.querySelector('#name-input').value = 'Prueba ' + n;
  document.querySelector('#intro-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  let guard = 0;
  while (guard++ < 1500) {
    if (document.querySelector('#screen-end').hidden === false) return 'end';
    const res = document.querySelector('#event-result');
    if (res && res.hidden === false) {
      const next = res.querySelector('[data-next]');
      if (next) { next.click(); continue; }
    }
    const opciones = Array.from(document.querySelectorAll('#event-options .option:not([disabled])'));
    if (!opciones.length) {
      return 'stuck:' + document.querySelector('#hdr-year').textContent + ':' + document.querySelector('#event-title').textContent;
    }
    const g = window.__URSS__.UI.game;
    const mejor = opciones
      .map(el => ({ el, sc: score(g.state.event.options[Number(el.dataset.i)]) }))
      .sort((a, b) => b.sc - a.sc)[0];
    mejor.el.click();
  }
  return 'timeout';
}

window.addEventListener('load', () => setTimeout(() => {
  const results = [];
  try {
    for (let i = 0; i < 6; i++) {
      const r = jugarUna(i);
      results.push({
        r,
        año: document.querySelector('#hdr-year').textContent,
        nombre: document.querySelector('#end-name').textContent,
        puntos: document.querySelector('#end-score').textContent,
        sellos: document.querySelectorAll('#end-seals .stamp').length
      });
      if (r !== 'end') break;
      document.querySelector('#btn-restart').click();
    }
  } catch (e) {
    window.__errors.push('throw:' + e.message + '|' + e.stack);
  }
  const pre = document.createElement('pre');
  pre.id = 'test-out';
  pre.textContent = JSON.stringify({ errors: window.__errors, results });
  document.body.appendChild(pre);
}, 600));
<\/script>`;

// El archivo temporal debe vivir dentro del proyecto: index.html usa rutas
// relativas (src/...). Si se escribe en /tmp, el navegador no las encuentra.
const tmp = path.join(RAIZ, `.tmp-prueba-navegador-${process.pid}.html`);
fs.writeFileSync(tmp, html.replace('</body>', inyeccion + '\n</body>'), 'utf8');

let dom = '';
try {
  dom = execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files',
    '--virtual-time-budget=45000', '--dump-dom', 'file://' + tmp
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120000 });
} catch (e) {
  console.error('Chrome falló:', e.message);
  process.exit(1);
} finally {
  fs.rmSync(tmp, { force: true });
}

const m = dom.match(/<pre id="test-out">([\s\S]*?)<\/pre>/);
if (!m) {
  console.error('La prueba no llegó a ejecutarse (sin #test-out).');
  process.exit(1);
}

const decodificar = (s) => s
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&').replace(/&#39;/g, "'");

const data = JSON.parse(decodificar(m[1]));
console.log('Archivo:', path.relative(RAIZ, origen));
console.log('Partidas:', data.results.length, '/ 6');
for (const r of data.results) {
  console.log(' ·', r.r, '|', r.año, '|', r.nombre, '|', r.puntos, 'pts |', r.sellos, 'sellos');
}
if (data.errors.length) {
  console.error('Errores JS:', data.errors);
  process.exit(1);
}
if (data.results.length !== 6 || data.results.some(r => r.r !== 'end')) {
  console.error('Alguna partida no llegó al final.');
  process.exit(1);
}
console.log('OK');

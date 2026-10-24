/* ============================================================================
 * ORDEN DE CARGA — Utilidades compartidas por build y pruebas.
 *
 * index.html es la única fuente de verdad: la lista de <script src="..."> y el
 * <link rel="stylesheet" href="..."> define qué se carga y en qué orden.
 * Aquí solo se lee ese HTML para reutilizarlo desde Node.
 * ==========================================================================*/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

/** Devuelve true para rutas locales (no http/https// ni data:). */
export const esLocal = (url) => !/^(?:[a-z]+:)?\/\//i.test(url) && !url.startsWith('data:');

/** Extrae las hojas de estilo locales referenciadas en el HTML. */
export function hojasLocales(html) {
  return [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1])
    .filter(esLocal);
}

/** Extrae los scripts locales referenciados en el HTML, en orden. */
export function scriptsLocales(html) {
  return [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)]
    .map((m) => m[1])
    .filter(esLocal);
}

/** Lee index.html del proyecto. */
export function leerIndex(raiz = RAIZ) {
  return fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
}

/**
 * Concatena los scripts del juego y los carga como un módulo ESM temporal.
 * Sirve para las pruebas: el navegador usa <script> clásicos, Node necesita
 * un archivo .mjs al que añadirle los `export`.
 */
export async function cargarMotor(raiz = RAIZ, { conInterfaz = false } = {}) {
  const html = leerIndex(raiz);
  let scripts = scriptsLocales(html);
  if (!conInterfaz) scripts = scripts.filter((rel) => !rel.startsWith('src/interfaz/'));
  const codigo = scripts
    .map((rel) => `\n/* ===== ${rel} ===== */\n` + fs.readFileSync(path.join(raiz, rel), 'utf8'))
    .join('\n');

  const exports = '\nexport { Game, GOALS, EVENTS, EVENT_LIST, ORIGINS, CONFIG, ITEMS, eraFor, incomeOf, expensesOf };\n';
  const tmpDir = fs.existsSync('/tmp/opencode') ? '/tmp/opencode' : os.tmpdir();
  const tmp = path.join(tmpDir, `urss-motor-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tmp, codigo + exports, 'utf8');
  try {
    return await import(tmp);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

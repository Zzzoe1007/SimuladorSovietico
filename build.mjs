/* ============================================================================
 * BUILD — Genera el archivo único para compartir.
 *
 *   node build.mjs
 *
 * Lee index.html (la versión modular), sustituye el <link> del CSS y cada
 * <script src="..."> local por su contenido, y escribe:
 *
 *   dist/urss-expediente.html
 *
 * Ese archivo se abre con doble clic, sin servidor y sin la carpeta src/.
 * Los CDN (Tailwind, Google Fonts) se dejan tal cual: sin red, el juego
 * funciona igualmente con los estilos de reserva.
 * ==========================================================================*/
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, leerIndex, esLocal } from './herramientas/orden-carga.mjs';

const SALIDA = path.join(RAIZ, 'dist', 'urss-expediente.html');

const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');

/* 1. CSS local -> <style> */
let salida = html.replace(
  /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
  (tag, href) => {
    if (!esLocal(href)) return tag;
    const css = fs.readFileSync(path.join(RAIZ, href), 'utf8');
    return `<style>\n/* ${href} */\n${css}\n</style>`;
  }
);

/* 2. JS local -> <script> en línea, respetando el orden de index.html */
salida = salida.replace(
  /<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi,
  (tag, src) => {
    if (!esLocal(src)) return tag;
    const js = fs.readFileSync(path.join(RAIZ, src), 'utf8');
    return `<script>\n/* ${src} */\n${js}\n</script>`;
  }
);

/* 3. Comprobación: no deben quedar referencias locales sin empaquetar */
const restos = [...salida.matchAll(/(?:src|href)=["'](src\/[^"']+)["']/gi)].map((m) => m[1]);
if (restos.length) {
  console.error('ERROR: quedaron referencias locales sin empaquetar:', restos.join(', '));
  process.exit(1);
}

fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
fs.writeFileSync(SALIDA, salida, 'utf8');

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log('OK  dist/urss-expediente.html  (' + kb(salida.length) + ')');

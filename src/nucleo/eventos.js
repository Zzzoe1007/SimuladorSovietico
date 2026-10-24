/* ============================================================================
 * REGISTRO DE EVENTOS — Contenedor común.
 * Los archivos de /src/eventos llaman a addEvents([...]) para registrarse.
 * El motor lee EVENT_LIST para decidir qué dilema mostrar cada año.
 * ==========================================================================*/

/* ------------------------------------------------------------------ */
/* Registro de acontecimientos                                         */
/* ------------------------------------------------------------------ */
const EVENT_LIST = [];
function addEvents(list) { EVENT_LIST.push(...list); }

/**
 * Server-side quote cache.
 *
 * Fetches every tracked symbol from Yahoo Finance in a single batch request on a
 * fixed interval. All API routes read from here so the client always gets an
 * instant response, and each successful refresh is pushed to connected browsers
 * via an injected `onRefresh` callback (used for the live WebSocket snapshot).
 */
const yahoo = require('./yahoo');
const { ALL_SYMBOLS, META } = require('../config/symbols');

let cache      = null;
let onRefresh  = null;
const REFRESH_MS = 25 * 1000;

async function refresh() {
  try {
    const quotes = await yahoo.fetchQuotes(ALL_SYMBOLS);
    // Attach curated name/sector (Yahoo's payload carries no sector).
    for (const [sym, q] of Object.entries(quotes)) {
      if (META[sym]) {
        q.name   = META[sym].name;
        q.sector = META[sym].sector;
      }
    }
    cache = quotes;
    console.log(`[cache] Refreshed — ${Object.keys(cache).length} symbols`);
    if (onRefresh) onRefresh(cache);
  } catch (err) {
    console.error('[cache] Refresh failed:', err.message);
  }
  setTimeout(refresh, REFRESH_MS);
}

function getAll()            { return cache; }
function getSymbols(symbols) { if (!cache) return null; return Object.fromEntries(symbols.map(s => [s, cache[s]]).filter(([, v]) => v)); }
function isReady()           { return cache !== null; }

// Start the background refresh loop. `cb(cache)` runs after each refresh.
function init(cb) { onRefresh = cb || null; refresh(); }

module.exports = { init, getAll, getSymbols, isReady };

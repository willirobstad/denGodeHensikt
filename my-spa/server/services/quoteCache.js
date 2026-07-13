/**
 * Quote cache shared by the local server and Vercel Functions.
 *
 * Local development refreshes in the background for WebSocket broadcasts.
 * Serverless requests instead wait for a fresh cache during the request; Vercel
 * does not guarantee that a timer keeps running after a response is sent.
 */
const yahoo = require('./yahoo');
const { ALL_SYMBOLS, META } = require('../config/symbols');

let cache = null;
let refreshedAt = 0;
let refreshing = null;
let onRefresh = null;
let initialized = false;
const REFRESH_MS = 25 * 1000;

function refresh() {
  // Quotes and indices are requested in parallel by the browser. Reuse one
  // Yahoo request rather than starting duplicate requests.
  if (refreshing) return refreshing;

  refreshing = (async () => {
    try {
      const quotes = await yahoo.fetchQuotes(ALL_SYMBOLS);
      for (const [symbol, quote] of Object.entries(quotes)) {
        if (META[symbol]) {
          quote.name = META[symbol].name;
          quote.sector = META[symbol].sector;
        }
      }
      cache = quotes;
      refreshedAt = Date.now();
      console.log(`[cache] Refreshed ${Object.keys(cache).length} symbols`);
      if (onRefresh) onRefresh(cache);
    } catch (err) {
      console.error('[cache] Refresh failed:', err.message);
    } finally {
      refreshing = null;
    }
    return cache;
  })();

  return refreshing;
}

async function ensureFresh() {
  if (!cache || Date.now() - refreshedAt >= REFRESH_MS) await refresh();
  return cache !== null;
}

function getAll() { return cache; }
function getSymbols(symbols) {
  if (!cache) return null;
  return Object.fromEntries(symbols.map((symbol) => [symbol, cache[symbol]]).filter(([, quote]) => quote));
}
function isReady() { return cache !== null; }

// Used only by the long-running local server for live WebSocket snapshots.
function init(cb) {
  onRefresh = cb || null;
  if (initialized) return;
  initialized = true;
  refresh();

  const schedule = () => setTimeout(async () => {
    await refresh();
    schedule();
  }, REFRESH_MS);
  schedule();
}

module.exports = { init, getAll, getSymbols, isReady, ensureFresh };

/**
 * Server-side quote cache.
 * Fetches all symbols in one request every 65 s (stays within the
 * 8-credits/minute free-tier limit). All API routes read from here
 * so the client always gets an instant response.
 */
const axios = require('axios');
const { ALL_SYMBOLS, TWELVE_DATA_REST } = require('../config/twelvedata');

let cache      = null;
let lastFetch  = 0;
const REFRESH_MS = 65 * 1000;

async function refresh() {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  try {
    const { data } = await axios.get(`${TWELVE_DATA_REST}/quote`, {
      params: { symbol: ALL_SYMBOLS.join(','), apikey: apiKey },
      timeout: 10000,
    });
    // If only one symbol is returned Twelve Data omits the wrapper — normalise it
    if (data.symbol) {
      cache = { [data.symbol]: data };
    } else {
      cache = data;
    }
    lastFetch = Date.now();
    console.log(`[cache] Refreshed — ${Object.keys(cache).length} symbols`);
  } catch (err) {
    console.error('[cache] Refresh failed:', err.message);
  }
  setTimeout(refresh, REFRESH_MS);
}

function getAll()                    { return cache; }
function getSymbols(symbols)         { if (!cache) return null; return Object.fromEntries(symbols.map(s => [s, cache[s]]).filter(([, v]) => v)); }
function isReady()                   { return cache !== null; }

// Start the background refresh loop immediately
function init() { refresh(); }

module.exports = { init, getAll, getSymbols, isReady };

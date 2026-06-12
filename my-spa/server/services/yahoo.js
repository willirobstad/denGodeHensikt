/**
 * Yahoo Finance data adapter.
 *
 * The batch quote endpoint requires a cookie + crumb session, so we lazily
 * establish one and reuse it, re-authenticating on a 401. Quotes are mapped into
 * the same shape the client already consumed from Twelve Data, so the front-end
 * contract is unchanged (close, percent_change, volume, fifty_two_week, …).
 */
const axios = require('axios');
const { YAHOO_QUOTE, YAHOO_CRUMB, YAHOO_COOKIE } = require('../config/symbols');

// A real browser UA is required — Yahoo blocks generic clients.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let session = null; // { cookie, crumb }

async function authenticate() {
  // 1. Hit a Yahoo host to obtain the session cookie (returns 404 but sets it).
  const cookieRes = await axios.get(YAHOO_COOKIE, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 10000,
    // fc.yahoo.com responds 404 yet still sends Set-Cookie — don't throw on it.
    validateStatus: (s) => s < 500,
  });
  const cookie = (cookieRes.headers['set-cookie'] || [])
    .map((c) => c.split(';')[0])
    .join('; ');

  // 2. Exchange the cookie for a crumb.
  const crumbRes = await axios.get(YAHOO_CRUMB, {
    headers: { 'User-Agent': USER_AGENT, Cookie: cookie },
    timeout: 10000,
  });
  const crumb = String(crumbRes.data).trim();

  if (!cookie || !crumb || crumb.includes('<')) {
    throw new Error('Yahoo auth failed (missing cookie or crumb)');
  }
  session = { cookie, crumb };
  return session;
}

function mapQuote(r) {
  const high = r.fiftyTwoWeekHigh;
  const low  = r.fiftyTwoWeekLow;
  return {
    symbol:         r.symbol,
    name:           r.longName || r.shortName || r.symbol,
    currency:       r.currency,
    close:          r.regularMarketPrice,
    previous_close: r.regularMarketPreviousClose,
    change:         r.regularMarketChange,
    percent_change: r.regularMarketChangePercent,
    volume:         r.regularMarketVolume,
    average_volume: r.averageDailyVolume3Month,
    is_market_open: r.marketState === 'REGULAR',
    fifty_two_week: {
      low,
      high,
      high_change_percent: r.fiftyTwoWeekHighChangePercent != null
        ? r.fiftyTwoWeekHighChangePercent * 100
        : undefined,
    },
  };
}

/**
 * Fetch quotes for the given symbols. Returns { SYMBOL: mappedQuote, … },
 * skipping any symbol Yahoo returns without a price.
 */
async function fetchQuotes(symbols, _retried = false) {
  if (!session) await authenticate();

  let res;
  try {
    res = await axios.get(YAHOO_QUOTE, {
      headers: { 'User-Agent': USER_AGENT, Cookie: session.cookie },
      params: { symbols: symbols.join(','), crumb: session.crumb },
      timeout: 10000,
    });
  } catch (err) {
    // Stale crumb/cookie → re-auth once and retry.
    if (!_retried && err.response && [401, 403].includes(err.response.status)) {
      session = null;
      return fetchQuotes(symbols, true);
    }
    throw err;
  }

  const rows = res.data?.quoteResponse?.result || [];
  const out = {};
  for (const r of rows) {
    if (r.regularMarketPrice == null) continue;
    out[r.symbol] = mapQuote(r);
  }
  return out;
}

module.exports = { fetchQuotes };

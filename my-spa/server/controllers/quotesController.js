const cache = require('../services/quoteCache');
const { STOCK_SYMBOLS } = require('../config/symbols');

async function getQuotes(req, res) {
  if (!await cache.ensureFresh()) {
    return res.status(502).json({ error: 'Could not fetch quote data from Yahoo Finance' });
  }
  res.json(cache.getSymbols(STOCK_SYMBOLS));
}

module.exports = { getQuotes };

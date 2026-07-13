const cache = require('../services/quoteCache');
const { INDEX_SYMBOLS } = require('../config/symbols');

async function getIndices(req, res) {
  if (!await cache.ensureFresh()) {
    return res.status(502).json({ error: 'Could not fetch index data from Yahoo Finance' });
  }
  res.json(cache.getSymbols(INDEX_SYMBOLS));
}

module.exports = { getIndices };

const cache = require('../services/quoteCache');
const { STOCK_SYMBOLS } = require('../config/symbols');

function getQuotes(req, res) {
  if (!cache.isReady()) {
    return res.status(503).json({ error: 'Cache warming up, try again in a few seconds' });
  }
  res.json(cache.getSymbols(STOCK_SYMBOLS));
}

module.exports = { getQuotes };

const cache = require('../services/quoteCache');
const { INDEX_SYMBOLS } = require('../config/twelvedata');

function getIndices(req, res) {
  if (!cache.isReady()) {
    return res.status(503).json({ error: 'Cache warming up, try again in a few seconds' });
  }
  res.json(cache.getSymbols(INDEX_SYMBOLS));
}

module.exports = { getIndices };

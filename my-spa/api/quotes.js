const cache = require('../server/services/quoteCache');
const { STOCK_SYMBOLS } = require('../server/config/symbols');

// Vercel Function for GET /api/quotes.
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!await cache.ensureFresh()) {
    return res.status(502).json({ error: 'Could not fetch quote data from Yahoo Finance' });
  }
  return res.status(200).json(cache.getSymbols(STOCK_SYMBOLS));
};

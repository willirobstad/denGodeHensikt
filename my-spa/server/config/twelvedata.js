// All symbols fetched in one batch — max 8 = free-tier per-minute limit.
// Norwegian stocks are US-listed ADRs / OTC shares (USD prices).
const ALL_SYMBOLS = ['EQNR', 'DNBBY', 'NHYKF', 'TELNY', 'SPY', 'QQQ', 'GLD', 'BNO'];

const STOCK_SYMBOLS = ['EQNR', 'DNBBY', 'NHYKF', 'TELNY'];
const INDEX_SYMBOLS = ['SPY', 'QQQ', 'GLD', 'BNO'];

const TWELVE_DATA_REST = 'https://api.twelvedata.com';
const TWELVE_DATA_WS   = 'wss://ws.twelvedata.com/v1/quotes/price';

module.exports = { ALL_SYMBOLS, STOCK_SYMBOLS, INDEX_SYMBOLS, TWELVE_DATA_REST, TWELVE_DATA_WS };

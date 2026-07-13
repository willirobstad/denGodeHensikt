require('dotenv').config();
const http          = require('http');
const WebSocket     = require('ws');
const quoteCache    = require('./services/quoteCache');
const { STOCK_SYMBOLS, INDEX_SYMBOLS } = require('./config/symbols');
const { createApp } = require('./app');

const app    = createApp();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3000;

// --- WebSocket: browser clients ---
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('Browser client connected');
  ws.on('close', () => console.log('Browser client disconnected'));
});

function broadcast(payload) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach((c) => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
}

// Split the cache into stocks vs. indices and push a snapshot to all clients.
// Yahoo has no free streaming feed, so liveness comes from this periodic refresh.
function broadcastSnapshot(cache) {
  const pick = (syms) => Object.fromEntries(syms.map(s => [s, cache[s]]).filter(([, v]) => v));
  broadcast({
    event:   'snapshot',
    stocks:  pick(STOCK_SYMBOLS),
    indices: pick(INDEX_SYMBOLS),
  });
}

// --- Boot ---
quoteCache.init(broadcastSnapshot);

server.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));

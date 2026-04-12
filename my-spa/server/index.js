require('dotenv').config();
const express       = require('express');
const http          = require('http');
const path          = require('path');
const WebSocket     = require('ws');
const quoteCache    = require('./services/quoteCache');
const quotesRouter  = require('./routes/quotes');
const indicesRouter = require('./routes/indices');
const { STOCK_SYMBOLS, TWELVE_DATA_WS } = require('./config/twelvedata');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3000;

// --- Static files ---
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/src', express.static(path.join(__dirname, '../client/src')));

// --- REST API ---
app.use(express.json());
app.use('/api/quotes',  quotesRouter);
app.use('/api/indices', indicesRouter);

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

// --- WebSocket: Twelve Data upstream ---
function connectTwelveData() {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const tdWs   = new WebSocket(`${TWELVE_DATA_WS}?apikey=${apiKey}`);

  tdWs.on('open', () => {
    console.log('Connected to Twelve Data WebSocket');
    tdWs.send(JSON.stringify({
      action: 'subscribe',
      params: { symbols: STOCK_SYMBOLS.join(',') },
    }));
  });

  tdWs.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (data.event === 'price') broadcast(data);
    } catch (_) {}
  });

  tdWs.on('error', (err)  => console.error('Twelve Data WS error:', err.message));
  tdWs.on('close', ()     => { console.warn('Twelve Data WS closed — reconnecting in 5s'); setTimeout(connectTwelveData, 5000); });
}

// --- Boot ---
quoteCache.init();
connectTwelveData();

server.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));

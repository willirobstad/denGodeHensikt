import { fetchQuotes, fetchIndices } from './services/api.js';
import { connectSocket } from './services/socket.js';

// ─── Static metadata ────────────────────────────────────────────────────────
const META = {
  EQNR:  { name: 'Equinor ASA',    sector: 'Energi'    },
  DNBBY: { name: 'DNB Bank ASA',   sector: 'Finans'    },
  NHYKF: { name: 'Norsk Hydro ASA',sector: 'Aluminium' },
  TELNY: { name: 'Telenor ASA',    sector: 'Telekom'   },
};

const INDEX_LABELS = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ 100',
  GLD: 'Gull',
  BNO: 'Brent Olje',
};

// ─── Formatters ──────────────────────────────────────────────────────────────
function fmtPrice(v, currency) {
  const n = Number(v);
  if (isNaN(n)) return '—';
  const num = n.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${currency} ${num}` : num;
}

function fmtChange(v) {
  const n = Number(v);
  if (isNaN(n)) return { text: '—', cls: '' };
  return { text: `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`, cls: n >= 0 ? 'positive' : 'negative' };
}

function fmtVol(v) {
  const n = Number(v);
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ─── State ───────────────────────────────────────────────────────────────────
let quotes  = {};   // { EQNR: {…quote…}, … }
let sortKey = 'symbol';
let sortDir = 1;

// ─── Market status ───────────────────────────────────────────────────────────
function setMarketStatus(q) {
  const el  = document.getElementById('market-status');
  if (!el) return;
  const dot = el.querySelector('.status-dot');
  const lbl = el.querySelector('.status-label');
  const open = q?.is_market_open;
  dot.className   = `status-dot ${open ? 'open' : 'closed'}`;
  lbl.textContent = open ? 'Marked åpent' : 'Marked stengt';
}

// ─── Ticker tape ─────────────────────────────────────────────────────────────
function renderTicker() {
  const track = document.getElementById('ticker-track');
  if (!track || !Object.keys(quotes).length) return;
  const items = Object.entries(quotes).map(([sym, q]) => {
    const { text, cls } = fmtChange(q.percent_change);
    return `<span class="${cls}">${sym} ${text}</span><span class="sep">&#8212;</span>`;
  }).join('');
  track.innerHTML = items + items;
}

// ─── Indices bar ─────────────────────────────────────────────────────────────
function renderIndices(data) {
  const bar = document.getElementById('indices-bar');
  if (!bar || !data) return;

  const items = Object.entries(data)
    .filter(([, q]) => q && q.status !== 'error' && q.close)
    .map(([sym, q]) => {
      const { text, cls } = fmtChange(q.percent_change);
      const label = INDEX_LABELS[sym] || sym;
      return `
        <div class="index-item">
          <span class="index-name">${label}</span>
          <span class="index-value">${fmtPrice(q.close, q.currency)}</span>
          <span class="index-change ${cls}">${text}</span>
        </div>`;
    });

  if (!items.length) return;
  bar.innerHTML = items.join('<div class="index-divider"></div>');
}

// ─── 52-week range bar ───────────────────────────────────────────────────────
function rangeBar(close, q) {
  const low  = Number(q.fifty_two_week?.low);
  const high = Number(q.fifty_two_week?.high);
  if (!low || !high || low === high) return '<span class="muted">—</span>';

  const pos = Math.max(0, Math.min(100, ((close - low) / (high - low)) * 100));
  return `
    <div class="range-wrap">
      <div class="range-track">
        <div class="range-fill"  style="width:${pos.toFixed(1)}%"></div>
        <div class="range-thumb" style="left:${pos.toFixed(1)}%"></div>
      </div>
      <div class="range-labels">
        <span>${fmtPrice(low)}</span>
        <span>${fmtPrice(high)}</span>
      </div>
    </div>`;
}

// ─── Market table ────────────────────────────────────────────────────────────
function sortedQuotes() {
  return Object.entries(quotes)
    .filter(([, q]) => q && q.close)
    .sort(([aKey, aQ], [bKey, bQ]) => {
      if (sortKey === 'symbol') return sortDir * aKey.localeCompare(bKey);
      const vals = {
        percent_change: [Number(aQ.percent_change), Number(bQ.percent_change)],
        volume:         [Number(aQ.volume),          Number(bQ.volume)],
        from_high:      [
          Number(aQ.fifty_two_week?.high_change_percent ?? 0),
          Number(bQ.fifty_two_week?.high_change_percent ?? 0),
        ],
      };
      const [a, b] = vals[sortKey] || [0, 0];
      return sortDir * (b - a);
    });
}

function buildRows() {
  return sortedQuotes().map(([sym, q]) => {
    const meta      = META[sym] || {};
    const close     = Number(q.close);
    const chg       = fmtChange(q.percent_change);
    const vol       = Number(q.volume);
    const avgVol    = Number(q.average_volume) || vol;
    const relVol    = avgVol > 0 ? vol / avgVol : 1;
    const relCls    = relVol >= 1.5 ? 'rel-vol high' : relVol >= 0.7 ? 'rel-vol mid' : 'rel-vol low';
    const fromHigh  = fmtChange(q.fifty_two_week?.high_change_percent);

    return `
      <tr class="market-row" data-symbol="${sym}">
        <td><span class="ticker-badge">${sym}</span></td>
        <td class="company-name">${meta.name || q.name || sym}</td>
        <td><span class="sector-tag">${meta.sector || '—'}</span></td>
        <td class="num mono" data-field="price">${fmtPrice(close, q.currency)}</td>
        <td class="num mono ${chg.cls}" data-field="change">${chg.text}</td>
        <td class="num mono">${fmtVol(vol)}</td>
        <td class="num"><span class="${relCls}">${relVol.toFixed(1)}x</span></td>
        <td>${rangeBar(close, q)}</td>
        <td class="num mono ${fromHigh.cls}">${fromHigh.text}</td>
      </tr>`;
  }).join('');
}

function renderTable() {
  const tbody = document.getElementById('market-tbody');
  if (!tbody) return;
  const html = buildRows();
  tbody.innerHTML = html || '<tr class="skeleton-row"><td colspan="9">Ingen data tilgjengelig</td></tr>';
}

// ─── Gainers / Losers ────────────────────────────────────────────────────────
function moverCard(sym, q, rank) {
  const meta = META[sym] || {};
  const chg  = fmtChange(q.percent_change);
  return `
    <div class="mover-card">
      <span class="mover-rank">${rank}</span>
      <div class="mover-info">
        <span class="ticker-badge small">${sym}</span>
        <span class="mover-name">${meta.name || sym}</span>
      </div>
      <div class="mover-right">
        <span class="mover-price mono">${fmtPrice(q.close, q.currency)}</span>
        <span class="mover-change ${chg.cls} mono">${chg.text}</span>
      </div>
    </div>`;
}

function renderMovers() {
  const sorted = sortedQuotes().sort((a, b) =>
    Number(b[1].percent_change) - Number(a[1].percent_change)
  );
  const gainers = sorted.slice(0, 3);
  const losers  = [...sorted].reverse().slice(0, 3);

  const gEl = document.getElementById('gainers-list');
  const lEl = document.getElementById('losers-list');
  if (gEl) gEl.innerHTML = gainers.map(([s, q], i) => moverCard(s, q, i + 1)).join('');
  if (lEl) lEl.innerHTML = losers.map(([s, q], i)  => moverCard(s, q, i + 1)).join('');
}

// ─── Sort controls ───────────────────────────────────────────────────────────
function initSortButtons() {
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      sortDir = sortKey === key ? sortDir * -1 : 1;
      sortKey = key;
      document.querySelectorAll('.sort-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderTable();
    });
  });
}

// ─── Live WebSocket update ───────────────────────────────────────────────────
function applyPriceEvent(event) {
  const sym = event.symbol;
  if (!quotes[sym]) return;

  quotes[sym].close          = event.price;
  quotes[sym].percent_change = event.percent_change;

  const row = document.querySelector(`.market-row[data-symbol="${sym}"]`);
  if (row) {
    const priceEl  = row.querySelector('[data-field="price"]');
    const changeEl = row.querySelector('[data-field="change"]');
    const chg      = fmtChange(event.percent_change);

    if (priceEl)  priceEl.textContent  = fmtPrice(event.price, quotes[sym].currency);
    if (changeEl) { changeEl.textContent = chg.text; changeEl.className = `num mono ${chg.cls}`; }

    row.classList.add('flash');
    setTimeout(() => row.classList.remove('flash'), 800);
  }

  renderTicker();
  renderMovers();
}

// ─── Boot ────────────────────────────────────────────────────────────────────
export default async function App() {
  initSortButtons();

  // Retry helper — cache may be warming up on first server start
  async function fetchWithRetry(fn, retries = 3, delayMs = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        const data = await fn();
        if (data.error) throw new Error(data.error);
        return data;
      } catch (e) {
        if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
        else throw e;
      }
    }
  }

  const [rawQuotes, rawIndices] = await Promise.allSettled([
    fetchWithRetry(fetchQuotes),
    fetchWithRetry(fetchIndices),
  ]);

  if (rawQuotes.status === 'fulfilled') {
    const data = rawQuotes.value;
    Object.entries(data).forEach(([sym, q]) => {
      if (q && q.status !== 'error' && q.close) {
        quotes[sym] = q;
      }
    });
    // Set market status from first valid quote
    const first = Object.values(quotes)[0];
    if (first) setMarketStatus(first);

    renderTable();
    renderTicker();
    renderMovers();
  } else {
    console.error('Quote fetch failed:', rawQuotes.reason);
    document.getElementById('market-tbody').innerHTML =
      '<tr class="skeleton-row"><td colspan="9">Kunne ikke laste markedsdata. Prøv igjen.</td></tr>';
  }

  if (rawIndices.status === 'fulfilled') {
    renderIndices(rawIndices.value);
  }

  connectSocket(applyPriceEvent);
}

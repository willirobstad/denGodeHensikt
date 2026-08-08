# Den gode Hensikt Aksjeklubb

An internal Norwegian single-page application for **Den gode Hensikt Aksjeklubb**. It displays near-real-time market data for selected Oslo Stock Exchange companies and global reference instruments, alongside member information and the club's statutes.

## Features

- Stock prices, market status, volume, and 52-week data
- Reference data for SPY, QQQ, GLD, and BNO
- Winners, losers, ticker, sorting, and expandable market tables
- Live browser updates over WebSocket, with REST polling as a fallback
- Hash-based navigation for the market overview, portfolio, members, and statutes
- Responsive, framework-free frontend

## Technology

- Node.js 20+ and Express
- Plain HTML, CSS, and JavaScript modules
- Yahoo Finance market data through Axios
- WebSocket updates with `ws`
- Vercel-compatible static build and serverless API functions

## Run locally

```bash
npm install
npm run dev
```

The server uses the `PORT` environment variable, or port `3000` by default. Open `http://localhost:3000`.

For a production-style local start:

```bash
npm start
```

## Project structure

| Path | Purpose |
| --- | --- |
| `client/` | SPA source, static content, styles, routing, and browser services |
| `server/` | Express server, REST controllers, quote cache, and WebSocket server |
| `server/config/symbols.js` | Central list of instruments and their metadata |
| `api/` | Vercel serverless endpoints for quotes and indices |
| `scripts/build-vercel.js` | Prepares the static SPA for Vercel deployment |
| `public/` | Generated deployment output |
| `PROJECT_CONTEXT.md` | Detailed implementation notes and maintenance guidance |

## Data flow

The server fetches and normalizes Yahoo Finance data, stores the latest successful snapshot in a shared cache, and broadcasts updates to connected browsers. The client initially loads data through `GET /api/quotes` and `GET /api/indices`, then uses WebSocket snapshots and periodic REST requests to stay current.

## Deployment

The repository includes `vercel.json`, serverless API handlers, and a Vercel build script:

```bash
npm run build:vercel
```

See [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) for API details, architecture notes, content-editing guidance, and known limitations.

# Prosjektkontekst – Den gode Hensikt Aksjeklubb

Dette dokumentet er et arbeidsnotat for videreutvikling av prosjektet.

## Formål

Nettsiden er en intern, norskspråklig enkeltsideapplikasjon (SPA) for **Den gode Hensikt Aksjeklubb**. Den viser markedsdata for et utvalg aksjer på Oslo Børs samt noen globale referanseindekser/ETF-er. I tillegg finnes en medlemsseksjon (foreløpig tom) og vedtekter.

## Teknologi og oppstart

- Node.js med Express på serveren.
- Vanlig HTML, CSS og JavaScript-moduler i klienten – ingen React/Vite/byggetrinn.
- WebSocket (`ws`) for oppdateringer i nettleseren.
- Axios og Yahoo Finance for kursdata.

Start lokalt med:

```bash
npm install
npm run dev
```

Serveren kjører på `PORT` fra miljøvariabler, eller port `3000` som standard. Åpne deretter `http://localhost:3000`.

## Struktur

| Område | Ansvar |
| --- | --- |
| `client/public/index.html` | Hele sidens HTML-struktur og innholdet i statiske sider. |
| `client/public/styles/main.css` | Felles visuelt uttrykk, layout og responsivitet. |
| `client/src/App.js` | Henter og renderer markedsdata, sortering, «Vis flere», indekslinje og vinnere/tapere. |
| `client/src/services/` | API-kall, WebSocket, hash-ruting og kollapsbar sidemeny. |
| `server/index.js` | Express-server, statiske filer, API-ruter og WebSocket-server. |
| `server/config/symbols.js` | Én kilde for symboler, selskapsnavn, sektorer og indeksnavn. |
| `server/services/yahoo.js` | Yahoo-autentisering og normalisering av Yahoo-svar. |
| `server/services/quoteCache.js` | Felles kursbuffer som oppdateres hvert 25. sekund. |
| `server/routes/` og `server/controllers/` | REST-endepunkter for aksjer og indekser. |
| `api/index.js` og `vercel.json` | Vercel-inngang og ruting for den deployerte SPA-en og API-et. |

## Hvordan dataflyten fungerer

1. Serveren starter kursbufferen og henter alle symbolene samlet fra Yahoo Finance.
2. Bufferen oppdateres omtrent hvert 25. sekund. Ved vellykket oppdatering sendes et WebSocket-øyeblikksbilde til alle tilkoblede nettlesere.
3. Klienten henter også startdata fra REST-API-et, med enkel gjenforsøkslogikk.
4. `App.js` renderer kurstabell, ticker, indekslinje og topp vinnere/tapere. Senere WebSocket-data oppdaterer samme visning.

På Vercel er det ikke trygt å basere datalasting på en bakgrunnstimer som lever mellom forespørsler. API-kontrollerne venter derfor på en fersk Yahoo-henting ved behov, mens klienten oppdaterer REST-data hvert 30. sekund som reserve for WebSocket-forbindelsen.

### API-kontrakt

- `GET /api/quotes` gir Oslo Børs-aksjene.
- `GET /api/indices` gir `SPY`, `QQQ`, `GLD` og `BNO`.
- Begge endepunkter svarer `503` mens første oppdatering av bufferet pågår.
- WebSocket-meldinger har formen:

```js
{ event: 'snapshot', stocks: { /* symbol -> kurs */ }, indices: { /* symbol -> kurs */ } }
```

Kursobjekter inneholder blant annet `symbol`, `name`, `sector`, `currency`, `close`, `percent_change`, `volume`, `average_volume`, `is_market_open` og 52-ukersdata.

## Navigasjon og grensesnitt

Ruter styres av hash og defineres i `client/src/services/router.js`:

- `#/` – forsiden med markedsoversikt.
- `#/medlemmer` – plassholder for medlemsside.
- `#/vedtekter` – vedtekter i statisk HTML.

Sidemenyen kan skjules og valget lagres i nettleserens `localStorage` med nøkkelen `dgha:sidebar-collapsed`.

Det visuelle uttrykket er mørkt og finansielt, med gull som aksentfarge. CSS-variabler i starten av `main.css` er riktig sted for gjennomgående designendringer.

## Viktige hensyn ved videre arbeid

- Endre instrumentuniverset i `server/config/symbols.js`; ikke lag parallelle symbol-/metadatakilder i klienten.
- Yahoo-tilkoblingen bruker cookie og «crumb», og kan feile eller bli blokkert. Bufferet beholder sist vellykkede datasett når en oppdatering feiler.
- Klienten forventer den normaliserte kursformen fra `yahoo.js`. Ved bytte av datakilde bør denne kontrakten beholdes eller klienten oppdateres samlet.
- Det finnes ikke test-, lint- eller byggeskript foreløpig. Manuell kontroll i nettleser er nødvendig etter UI-endringer.
- Mobilvisningen er definert i `main.css` rundt 900, 780 og 680 px; kontroller den ved endringer i meny eller tabeller.
- Bunnteksten sier fortsatt «Data fra Twelve Data», men den faktiske datakilden er Yahoo Finance. Oppdater teksten ved en passende innholds-/UI-runde.
- Arbeidstreet inneholder allerede lokale, ikke-committede endringer i `client/public/index.html`, `client/public/styles/main.css`, `client/src/index.js` og `client/src/services/sidebar.js`. Bevar dem ved videre arbeid.

## Forslag til naturlige neste steg

1. Fylle ut medlemssiden og avklare om den skal ha statisk eller redigerbart innhold.
2. Bytte ut eventuelle gjenværende Twelve Data-referanser og vurdere en brukerorientert status ved manglende kursdata.
3. Legge til et enkelt kontrolloppsett for viktige ruter og API-svar før større funksjonsutvidelser.

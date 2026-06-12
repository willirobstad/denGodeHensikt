// ─── Symbol universe ──────────────────────────────────────────────────────────
// Single source of truth for every instrument the app tracks.
//
// Stocks are native Oslo Børs tickers (`.OL`, priced in NOK) served by Yahoo
// Finance — Twelve Data's free tier does not cover Oslo Børs (XOSL). The list is
// the ~50 most-traded names on the exchange. `name`/`sector` are attached to each
// quote server-side (Yahoo's quote payload has no sector), so the client renders
// straight from the API with no separate metadata map.
//
// Indices stay as US-listed ETFs (USD); Yahoo serves them too.

const STOCKS = [
  { symbol: 'EQNR.OL',  name: 'Equinor ASA',                 sector: 'Energi'          },
  { symbol: 'DNB.OL',   name: 'DNB Bank ASA',                sector: 'Finans'          },
  { symbol: 'AKRBP.OL', name: 'Aker BP ASA',                 sector: 'Energi'          },
  { symbol: 'NHY.OL',   name: 'Norsk Hydro ASA',             sector: 'Materialer'      },
  { symbol: 'TEL.OL',   name: 'Telenor ASA',                 sector: 'Telekom'         },
  { symbol: 'MOWI.OL',  name: 'Mowi ASA',                    sector: 'Sjømat'          },
  { symbol: 'YAR.OL',   name: 'Yara International ASA',       sector: 'Materialer'      },
  { symbol: 'ORK.OL',   name: 'Orkla ASA',                   sector: 'Konsumvarer'     },
  { symbol: 'KOG.OL',   name: 'Kongsberg Gruppen ASA',       sector: 'Industri'        },
  { symbol: 'SALM.OL',  name: 'SalMar ASA',                  sector: 'Sjømat'          },
  { symbol: 'STB.OL',   name: 'Storebrand ASA',              sector: 'Finans'          },
  { symbol: 'GJF.OL',   name: 'Gjensidige Forsikring ASA',   sector: 'Finans'          },
  { symbol: 'FRO.OL',   name: 'Frontline plc',               sector: 'Shipping'        },
  { symbol: 'SUBC.OL',  name: 'Subsea 7 S.A.',               sector: 'Energitjenester' },
  { symbol: 'TOM.OL',   name: 'Tomra Systems ASA',           sector: 'Industri'        },
  { symbol: 'ELK.OL',   name: 'Elkem ASA',                   sector: 'Materialer'      },
  { symbol: 'AKER.OL',  name: 'Aker ASA',                    sector: 'Industri'        },
  { symbol: 'VAR.OL',   name: 'Vår Energi ASA',              sector: 'Energi'          },
  { symbol: 'BRG.OL',   name: 'Borregaard ASA',              sector: 'Materialer'      },
  { symbol: 'EPR.OL',   name: 'Europris ASA',                sector: 'Detaljhandel'    },
  { symbol: 'AUTO.OL',  name: 'AutoStore Holdings Ltd.',     sector: 'Teknologi'       },
  { symbol: 'PGS.OL',   name: 'PGS ASA',                     sector: 'Energitjenester' },
  { symbol: 'WAWI.OL',  name: 'Wallenius Wilhelmsen ASA',    sector: 'Shipping'        },
  { symbol: 'HAFNI.OL', name: 'Hafnia Limited',              sector: 'Shipping'        },
  { symbol: 'ODF.OL',   name: 'Odfjell SE',                  sector: 'Shipping'        },
  { symbol: 'DNO.OL',   name: 'DNO ASA',                     sector: 'Energi'          },
  { symbol: 'LSG.OL',   name: 'Lerøy Seafood Group ASA',     sector: 'Sjømat'          },
  { symbol: 'BAKKA.OL', name: 'P/F Bakkafrost',              sector: 'Sjømat'          },
  { symbol: 'AUSS.OL',  name: 'Austevoll Seafood ASA',       sector: 'Sjømat'          },
  { symbol: 'SCATC.OL', name: 'Scatec ASA',                  sector: 'Fornybar energi' },
  { symbol: 'NEL.OL',   name: 'Nel ASA',                     sector: 'Fornybar energi' },
  { symbol: 'AKSO.OL',  name: 'Aker Solutions ASA',          sector: 'Energitjenester' },
  { symbol: 'TGS.OL',   name: 'TGS ASA',                     sector: 'Energitjenester' },
  { symbol: 'BWLPG.OL', name: 'BW LPG Limited',              sector: 'Shipping'        },
  { symbol: 'OKEA.OL',  name: 'OKEA ASA',                    sector: 'Energi'          },
  { symbol: 'NAS.OL',   name: 'Norwegian Air Shuttle ASA',   sector: 'Transport'       },
  { symbol: 'ENTRA.OL', name: 'Entra ASA',                   sector: 'Eiendom'         },
  { symbol: 'NONG.OL',  name: 'SpareBank 1 Nord-Norge',      sector: 'Finans'          },
  { symbol: 'SPOL.OL',  name: 'SpareBank 1 Østlandet',       sector: 'Finans'          },
  { symbol: 'MPCC.OL',  name: 'MPC Container Ships ASA',     sector: 'Shipping'        },
  { symbol: 'B2I.OL',   name: 'B2 Impact ASA',               sector: 'Finans'          },
  { symbol: 'KIT.OL',   name: 'Kitron ASA',                  sector: 'Industri'        },
  { symbol: 'HEX.OL',   name: 'Hexagon Composites ASA',      sector: 'Industri'        },
  { symbol: 'ZAL.OL',   name: 'Zalaris ASA',                 sector: 'Teknologi'       },
  { symbol: 'RECSI.OL', name: 'REC Silicon ASA',             sector: 'Materialer'      },
  { symbol: 'ABG.OL',   name: 'ABG Sundal Collier ASA',      sector: 'Finans'          },
  { symbol: 'NOD.OL',   name: 'Nordic Semiconductor ASA',    sector: 'Teknologi'       },
  { symbol: 'PHO.OL',   name: 'Photocure ASA',               sector: 'Helse'           },
  { symbol: 'ELMRA.OL', name: 'Elmera Group ASA',            sector: 'Energi'          },
  { symbol: 'SPOG.OL',  name: 'Sparebanken Øst',             sector: 'Finans'          },
];

const INDEX_LABELS = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ 100',
  GLD: 'Gull',
  BNO: 'Brent Olje',
};

const STOCK_SYMBOLS = STOCKS.map((s) => s.symbol);
const INDEX_SYMBOLS = Object.keys(INDEX_LABELS);
const ALL_SYMBOLS   = [...STOCK_SYMBOLS, ...INDEX_SYMBOLS];

// name/sector lookup by symbol
const META = Object.fromEntries(STOCKS.map((s) => [s.symbol, { name: s.name, sector: s.sector }]));

const YAHOO_QUOTE   = 'https://query1.finance.yahoo.com/v7/finance/quote';
const YAHOO_CRUMB   = 'https://query1.finance.yahoo.com/v1/test/getcrumb';
const YAHOO_COOKIE  = 'https://fc.yahoo.com';

module.exports = {
  STOCKS, META, INDEX_LABELS,
  STOCK_SYMBOLS, INDEX_SYMBOLS, ALL_SYMBOLS,
  YAHOO_QUOTE, YAHOO_CRUMB, YAHOO_COOKIE,
};

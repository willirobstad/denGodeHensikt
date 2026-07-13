const express = require('express');
const path = require('path');
const quotesRouter = require('./routes/quotes');
const indicesRouter = require('./routes/indices');

function createApp() {
  const app = express();

  app.use(express.static(path.join(__dirname, '../client/public')));
  app.use('/src', express.static(path.join(__dirname, '../client/src')));
  app.use(express.json());
  app.use('/api/quotes', quotesRouter);
  app.use('/api/indices', indicesRouter);

  return app;
}

module.exports = { createApp };

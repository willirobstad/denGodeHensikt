// Vercel entry point. The API and static SPA are served by the same Express app.
require('dotenv').config();
const { createApp } = require('../server/app');
const quoteCache = require('../server/services/quoteCache');

const app = createApp();

// A warm serverless instance can reuse the in-memory cache. On cold starts the
// client retries while Yahoo data is fetched.
quoteCache.init();

module.exports = app;

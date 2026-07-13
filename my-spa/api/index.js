// Vercel entry point. The API and static SPA are served by the same Express app.
require('dotenv').config();
const { createApp } = require('../server/app');

const app = createApp();

module.exports = app;

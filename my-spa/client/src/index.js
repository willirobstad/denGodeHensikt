import App from './App.js';
import { initRouter } from './services/router.js';

initRouter();
App().catch(console.error);

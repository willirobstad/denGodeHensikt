import App from './App.js';
import { initRouter } from './services/router.js';
import { initSidebar } from './services/sidebar.js';

initRouter();
initSidebar();
App().catch(console.error);

import App from './App.js';
import { initRouter } from './services/router.js';
import { initSidebar } from './services/sidebar.js';
import { initMembers } from './services/members.js';

initRouter();
initSidebar();
initMembers();
App().catch(console.error);

// Minimal hash-based router for the multi-page SPA.
// Each top-level page is a `.page[data-route]` element; sidebar links carry the
// same `data-route`. We show the page matching the current hash and mark the
// active link. Unknown/empty hashes fall back to the home route ('/').

const ROUTES = ['/', '/medlemmer', '/vedtekter'];

function currentRoute() {
  const hash = location.hash.replace(/^#/, '');
  return ROUTES.includes(hash) ? hash : '/';
}

function render() {
  const route = currentRoute();
  document.querySelectorAll('.page').forEach((page) => {
    page.hidden = page.dataset.route !== route;
  });
  document.querySelectorAll('.side-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route);
  });
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', render);
  render();
}

// Collapsible sidebar. Any element with [data-sidebar-toggle] flips the
// `.collapsed` class on `.app-shell`; the choice is remembered in localStorage.

const KEY = 'dgha:sidebar-collapsed';

export function initSidebar() {
  const shell = document.querySelector('.app-shell');
  if (!shell) return;

  const apply = (collapsed) => shell.classList.toggle('collapsed', collapsed);

  // Restore saved state (default: expanded).
  apply(localStorage.getItem(KEY) === '1');

  document.querySelectorAll('[data-sidebar-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const collapsed = !shell.classList.contains('collapsed');
      apply(collapsed);
      try { localStorage.setItem(KEY, collapsed ? '1' : '0'); } catch (_) {}
    });
  });
}

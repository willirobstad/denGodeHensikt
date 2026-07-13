// Opens the selected member's profile dialog from the member overview.
export function initMembers() {
  document.querySelectorAll('[data-member-dialog]').forEach((card) => {
    card.addEventListener('click', () => {
      document.getElementById(card.dataset.memberDialog)?.showModal();
    });
  });

  document.querySelectorAll('.member-dialog').forEach((dialog) => {
    dialog.querySelector('[data-member-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

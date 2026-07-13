// Add or edit members here. One entry creates both a card and a detail view.
const MEMBERS = [
  {
    id: 'medlem-01',
    name: 'Medlem 01',
    role: 'Under utarbeidelse',
    image: '/images/members/medlem_bilde_01.jpeg',
    description: 'En beskrivende tekst om medlemmet kommer her.',
  },
  { id: 'medlem-02', name: 'Medlem 02', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-03', name: 'Medlem 03', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-04', name: 'Medlem 04', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-05', name: 'Medlem 05', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-06', name: 'Medlem 06', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-07', name: 'Medlem 07', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
  { id: 'medlem-08', name: 'Medlem 08', role: 'Under utarbeidelse', image: null, description: 'En beskrivende tekst om medlemmet kommer her.' },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
}

function photo(member, detail = false) {
  const className = detail ? 'member-detail-photo' : 'member-photo';
  if (member.image) {
    return `<img class="${className}" src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}">`;
  }
  return `<div class="${className} member-photo-placeholder" aria-hidden="true"><span>Bilde kommer</span></div>`;
}

function memberCard(member) {
  return `
    <button class="member-card" type="button" data-member-dialog="${member.id}">
      ${photo(member)}
      <h3 class="member-name">${escapeHtml(member.name)}</h3>
      <p class="member-role">Rolle: ${escapeHtml(member.role)}</p>
    </button>`;
}

function memberDialog(member) {
  return `
    <dialog class="member-dialog" id="${member.id}" aria-labelledby="${member.id}-name">
      <div class="member-dialog-inner">
        <button class="member-dialog-close" type="button" data-member-dialog-close aria-label="Lukk medlemsprofil">&times;</button>
        ${photo(member, true)}
        <p class="section-eyebrow">Den Gode Hensikt Aksjeklubb</p>
        <h2 class="member-detail-name" id="${member.id}-name">${escapeHtml(member.name)}</h2>
        <p class="member-detail-role">Rolle: ${escapeHtml(member.role)}</p>
        <p class="member-description">${escapeHtml(member.description)}</p>
      </div>
    </dialog>`;
}

export function initMembers() {
  const grid = document.getElementById('members-grid');
  const dialogs = document.getElementById('member-dialogs');
  if (!grid || !dialogs) return;

  grid.innerHTML = MEMBERS.map(memberCard).join('');
  dialogs.innerHTML = MEMBERS.map(memberDialog).join('');

  grid.querySelectorAll('[data-member-dialog]').forEach((card) => {
    card.addEventListener('click', () => document.getElementById(card.dataset.memberDialog)?.showModal());
  });
  dialogs.querySelectorAll('.member-dialog').forEach((dialog) => {
    dialog.querySelector('[data-member-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

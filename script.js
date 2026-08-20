const form = document.querySelector('#appointment-form');
const statusText = document.querySelector('.form-status');
const list = document.querySelector('#appointment-list');
const dateInput = form.querySelector('[name="date"]');
dateInput.min = new Date().toISOString().split('T')[0];

function renderAppointments(items) {
  if (!items.length) { list.innerHTML = '<p class="empty">No appointments yet. Your submitted request will appear here.</p>'; return; }
  list.innerHTML = items.map(item => `<article class="appointment-item"><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.department)} · ${escapeHtml(item.phone)}${item.message ? ` · ${escapeHtml(item.message)}` : ''}</p></div><time>${formatDate(item.date)}</time></article>`).join('');
}
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function formatDate(date) { return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' }); }
async function loadAppointments() { try { const response = await fetch('/api/appointments'); renderAppointments(await response.json()); } catch { list.innerHTML = '<p class="empty">Unable to load appointments right now.</p>'; } }
form.addEventListener('submit', async event => { event.preventDefault(); statusText.textContent = 'Submitting your request…'; const data = Object.fromEntries(new FormData(form)); try { const response = await fetch('/api/appointments', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); statusText.textContent = result.message; form.reset(); await loadAppointments(); } catch (error) { statusText.textContent = error.message || 'Something went wrong. Please try again.'; } });
document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('nav').classList.toggle('open'));
loadAppointments();

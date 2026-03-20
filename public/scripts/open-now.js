document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('open-badge');
  const dataEl = document.getElementById('hours-data');
  if (!badge || !dataEl) return;
  try {
    const hours = JSON.parse(dataEl.textContent);
    const days = hours.days || [];
    const badgeText = badge.querySelector('.badge-text');
    if (!badgeText) return;
    const is24_7 = days.length > 0 && days.every(d => d.open && d.open.toLowerCase().includes('24 hour'));
    if (is24_7) { badge.classList.add('open', 'open-24-7'); badgeText.textContent = 'Open 24/7'; return; }
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const today = days.find(d => d.day === dayName);
    if (!today || !today.open || today.open.toLowerCase() === 'closed') {
      badge.classList.add('closed');
      const todayIdx = days.findIndex(d => d.day === dayName);
      const next = days.find((d, i) => i > todayIdx && d.open && d.open.toLowerCase() !== 'closed') || days.find(d => d.open && d.open.toLowerCase() !== 'closed');
      badgeText.textContent = next ? 'Closed \u00B7 Opens ' + next.day + ' ' + next.open : 'Hours unavailable';
      return;
    }
    function parseTime(str) { const m = (str || '').match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return null; let h = parseInt(m[1]); if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12; if (m[3].toUpperCase() === 'AM' && h === 12) h = 0; return h * 60 + parseInt(m[2]); }
    const openMin = parseTime(today.open); const closeMin = parseTime(today.close); const nowMin = now.getHours() * 60 + now.getMinutes();
    if (openMin !== null && closeMin !== null && nowMin >= openMin && nowMin < closeMin) { badge.classList.add('open'); badgeText.textContent = 'Open \u00B7 Closes ' + today.close; }
    else { badge.classList.add('closed'); badgeText.textContent = nowMin < (openMin || 0) ? 'Closed \u00B7 Opens ' + today.open : 'Closed \u00B7 Opens tomorrow'; }
  } catch (e) { const badgeText = badge.querySelector('.badge-text'); if (badgeText) badgeText.textContent = ''; }
});

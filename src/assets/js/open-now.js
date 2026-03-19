document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('open-badge');
  const dataEl = document.getElementById('hours-data');
  if (!badge || !dataEl) return;

  try {
    const hours = JSON.parse(dataEl.textContent);
    const days = hours.days || [];
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const today = days.find(d => d.day === dayName);
    const badgeText = badge.querySelector('.badge-text');
    if (!badgeText) return;

    if (!today || !today.open) {
      badge.classList.add('closed');
      const next = days.find((d, i) => {
        const todayIdx = days.findIndex(dd => dd.day === dayName);
        return i > todayIdx && d.open;
      }) || days.find(d => d.open);
      badgeText.textContent = next ? 'Closed \u00B7 Opens ' + next.day + ' ' + next.open : 'Hours unavailable';
      return;
    }

    function parseTime(str) {
      const m = (str || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return null;
      let h = parseInt(m[1]);
      if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
      if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + parseInt(m[2]);
    }

    const openMin = parseTime(today.open);
    const closeMin = parseTime(today.close);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    if (openMin !== null && closeMin !== null && nowMin >= openMin && nowMin < closeMin) {
      badge.classList.add('open');
      badgeText.textContent = 'Open \u00B7 Closes ' + today.close;
    } else {
      badge.classList.add('closed');
      badgeText.textContent = nowMin < openMin
        ? 'Closed \u00B7 Opens ' + today.open
        : 'Closed \u00B7 Opens tomorrow';
    }
  } catch (e) {
    const badgeText = badge.querySelector('.badge-text');
    if (badgeText) badgeText.textContent = '';
  }
});

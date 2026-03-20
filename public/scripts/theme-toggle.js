// public/scripts/theme-toggle.js
(function() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isCurrentlyDark = current === 'dark' || (!current && prefersDark);
    var next = isCurrentlyDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

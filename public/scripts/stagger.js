// Stagger animation trigger — adds .stagger-in when container enters viewport
document.querySelectorAll('.services-grid, .trust-badges, .trust-stats, .process-steps').forEach(function(container) {
  var observer = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    container.classList.add('stagger-in');
    observer.disconnect();
  }, { threshold: 0.15 });
  observer.observe(container);
});

// Animated stat counters — fires once when element enters viewport
document.querySelectorAll('[data-count-to]').forEach(function(el) {
  var observer = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    var target = parseFloat(el.dataset.countTo);
    var isDecimal = el.dataset.countTo.indexOf('.') !== -1;
    var suffix = el.dataset.countSuffix || '';
    var duration = 1500;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = isDecimal
        ? (target * eased).toFixed(1)
        : Math.floor(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, { threshold: 0.3 });
  observer.observe(el);
});

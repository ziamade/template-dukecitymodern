// Animated stat counters — fires once when element enters viewport
// Supports data-count-delay="ms" to sync with entrance animations
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-count-to]').forEach(function(el) {
  var observer = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    var target = parseFloat(el.dataset.countTo);
    var isDecimal = el.dataset.countTo.indexOf('.') !== -1;
    var suffix = el.dataset.countSuffix || '';
    if (prefersReducedMotion) {
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      return;
    }
    var delay = parseInt(el.dataset.countDelay || '0', 10);
    var duration = 1500;
    function startCount() {
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
    }
    if (delay > 0) {
      setTimeout(startCount, delay);
    } else {
      startCount();
    }
  }, { threshold: 0.3 });
  observer.observe(el);
});

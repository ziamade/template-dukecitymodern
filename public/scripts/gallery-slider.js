(function() {
  var sliders = document.querySelectorAll('.project-slider');
  if (!sliders.length) return;

  for (var i = 0; i < sliders.length; i++) {
    initSlider(sliders[i]);
  }

  function initSlider(slider) {
    var wrap = slider.querySelector('.project-slider-wrap');
    var before = slider.querySelector('.project-img--before');
    var handle = slider.querySelector('.project-slider-handle');
    if (!wrap || !before || !handle) return;

    var dragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    function getPercent(clientX) {
      var rect = wrap.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      dragging = true;
    });
    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      setPosition(getPercent(e.clientX));
    });
    document.addEventListener('mouseup', function() {
      dragging = false;
    });

    handle.addEventListener('touchstart', function() {
      dragging = true;
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      setPosition(getPercent(e.touches[0].clientX));
    }, { passive: true });
    document.addEventListener('touchend', function() {
      dragging = false;
    });

    wrap.addEventListener('click', function(e) {
      setPosition(getPercent(e.clientX));
    });

    handle.addEventListener('keydown', function(e) {
      var current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPosition(current - 2);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPosition(current + 2);
      }
    });
  }
})();

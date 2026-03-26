document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const hero = document.querySelector('.hero');
  if (!header || !hero) return;

  header.classList.add('header-over-hero');

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('header-over-hero', entry.isIntersecting);
    header.classList.toggle('header-solid', !entry.isIntersecting);
  }, { rootMargin: '-56px 0px 0px 0px' }).observe(hero);

  // Hidden-on-scroll: hide header when scrolling down, show on scroll up
  var headerPos = document.body.getAttribute('data-header-position');
  if (headerPos === 'hidden-on-scroll') {
    var lastY = 0;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var y = window.scrollY;
          // Only hide after scrolling past the hero
          if (y > 200) {
            header.classList.toggle('header-hidden', y > lastY);
          } else {
            header.classList.remove('header-hidden');
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  var btn = header.querySelector('.hamburger-btn');
  var nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', function() {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      header.classList.toggle('nav-open', !open);
      // Always show header when mobile nav is open
      header.classList.remove('header-hidden');
    });
  }
});

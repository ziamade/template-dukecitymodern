document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const hero = document.querySelector('.hero');
  if (!header || !hero) return;

  header.classList.add('header-over-hero');

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('header-over-hero', entry.isIntersecting);
    header.classList.toggle('header-solid', !entry.isIntersecting);
  }, { rootMargin: '-56px 0px 0px 0px' }).observe(hero);

  const btn = header.querySelector('.hamburger-btn');
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      header.classList.toggle('nav-open', !open);
    });
  }
});

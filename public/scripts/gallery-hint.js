document.addEventListener('DOMContentLoaded', () => {
  if (!matchMedia('(max-width: 767px)').matches) return;
  const g = document.querySelector('.gallery-scroll');
  if (!g) return;
  g.style.transition = 'transform 300ms ease';
  g.style.transform = 'translateX(-40px)';
  setTimeout(() => { g.style.transform = ''; }, 600);
});

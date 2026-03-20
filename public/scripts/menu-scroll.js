(function() {
  var pills = document.querySelectorAll('.menu-pill');
  var cats = document.querySelectorAll('.menu-category');
  if (!pills.length || !cats.length) return;

  var visible = {};

  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      var id = entries[i].target.id;
      if (entries[i].isIntersecting) {
        visible[id] = entries[i].target.getBoundingClientRect().top;
      } else {
        delete visible[id];
      }
    }

    var topId = null;
    var topY = Infinity;
    for (var id in visible) {
      var rect = document.getElementById(id).getBoundingClientRect().top;
      if (rect < topY) { topY = rect; topId = id; }
    }

    for (var j = 0; j < pills.length; j++) {
      var href = pills[j].getAttribute('href');
      if (topId && href === '#' + topId) {
        pills[j].classList.add('active');
      } else {
        pills[j].classList.remove('active');
      }
    }
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  for (var k = 0; k < cats.length; k++) {
    observer.observe(cats[k]);
  }
})();

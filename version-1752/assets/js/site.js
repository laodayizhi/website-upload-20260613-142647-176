(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.nav-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    var hero = document.querySelector('.hero-carousel');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }
    show(0);
    start();
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    var roots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));
    roots.forEach(function (root) {
      var input = root.querySelector('.filter-input');
      var year = root.querySelector('.filter-year');
      var type = root.querySelector('.filter-type');
      var category = root.querySelector('.filter-category');
      var grid = root.parentElement.querySelector('.movie-grid');
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
      var urlQuery = readQuery();
      if (input && urlQuery) {
        input.value = urlQuery;
      }

      function apply() {
        var q = normalize(input ? input.value : '');
        var y = normalize(year ? year.value : '');
        var t = normalize(type ? type.value : '');
        var c = normalize(category ? category.value : '');
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (y && normalize(card.getAttribute('data-year')) !== y) {
            ok = false;
          }
          if (t && normalize(card.getAttribute('data-type')) !== t) {
            ok = false;
          }
          if (c && normalize(card.getAttribute('data-category')) !== c) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }

      [input, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function initPlayer() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.player-unit'));
    players.forEach(function (box) {
      var video = box.querySelector('video');
      var start = box.querySelector('.player-start');
      var streamUrl = box.getAttribute('data-stream');
      var hlsInstance = null;
      var loaded = false;
      if (!video || !start || !streamUrl) {
        return;
      }

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      function loadAndPlay() {
        box.classList.add('is-playing');
        if (loaded) {
          playVideo();
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', playVideo, { once: true });
          playVideo();
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
          return;
        }
        video.src = streamUrl;
        playVideo();
      }

      start.addEventListener('click', loadAndPlay);
      video.addEventListener('click', function () {
        if (!loaded) {
          loadAndPlay();
        }
      });
      window.addEventListener('pagehide', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();

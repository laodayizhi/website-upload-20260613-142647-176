(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');

  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', function () {
      menuPanel.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5600);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        startTimer();
      });
    }

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

  searchInputs.forEach(function (input) {
    var scopeSelector = input.getAttribute('data-search-scope');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    var emptyTarget = input.getAttribute('data-empty-target');
    var emptyBox = emptyTarget ? document.querySelector(emptyTarget) : null;

    function filterCards() {
      var keyword = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var visibleCount = 0;

      cards.forEach(function (card) {
        var source = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        var matched = !keyword || source.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';

        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyBox) {
        emptyBox.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    input.addEventListener('input', filterCards);
    filterCards();
  });

  var filterGroups = Array.prototype.slice.call(document.querySelectorAll('[data-filter-group]'));

  filterGroups.forEach(function (group) {
    var scopeSelector = group.getAttribute('data-filter-scope');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    var buttons = Array.prototype.slice.call(group.querySelectorAll('[data-filter-value]'));

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter-value');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });

        cards.forEach(function (card) {
          var matched = value === 'all' || card.getAttribute('data-type') === value || card.getAttribute('data-region') === value;
          card.style.display = matched ? '' : 'none';
        });
      });
    });
  });
})();

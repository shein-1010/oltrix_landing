/* Oltrix Education - site behaviour
   Progressive enhancement only: every page is readable without this file. */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Sticky header shadow ------------------------------------------- */
  var header = doc.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile navigation ---------------------------------------------- */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      doc.documentElement.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) setNav(false);
    });
  }

  /* --- Course filtering ------------------------------------------------ */
  var filters = doc.querySelectorAll('[data-filter]');
  var courses = doc.querySelectorAll('[data-category]');
  var counter = doc.querySelector('[data-course-count]');

  if (filters.length && courses.length) {
    var applyFilter = function (value) {
      var shown = 0;
      courses.forEach(function (card) {
        var match = value === 'all' || card.getAttribute('data-category') === value;
        card.hidden = !match;
        if (match) shown++;
      });
      filters.forEach(function (btn) {
        var active = btn.getAttribute('data-filter') === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (counter) {
        counter.textContent = shown + (shown === 1 ? ' course' : ' courses');
      }
    };

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    /* Support deep links like courses.html#data-science: reveal the card's
       category so the anchor target is actually visible. */
    var hash = window.location.hash.replace('#', '');
    if (hash) {
      var target = doc.getElementById(hash);
      if (target && target.hasAttribute('data-category')) {
        applyFilter(target.getAttribute('data-category'));
      }
    }
  }

  /* --- Pre-select the course on the contact form ---------------------- */
  var courseSelect = doc.getElementById('course');
  if (courseSelect) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('course');
    if (wanted) {
      Array.prototype.forEach.call(courseSelect.options, function (opt) {
        if (opt.value === wanted) courseSelect.value = wanted;
      });
    }
  }

  /* --- Scroll reveal --------------------------------------------------- */
  var revealItems = doc.querySelectorAll('.reveal');
  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealItems.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- Current year in the footer ------------------------------------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

(function() {
  'use strict';

  // --- Уважение системных настроек анимации ---
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var shouldAnimate = !prefersReducedMotion.matches;

  // --- DOM элементы ---
  var burger = document.querySelector('.burger-menu');
  var navLinks = document.querySelector('.nav-links');
  var header = document.querySelector('.header');
  var backToTop = document.getElementById('backToTop');
  var galleryGrid = document.getElementById('gallery-grid');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var lightbox = document.querySelector('.lightbox');
  var lbImg = document.querySelector('.lb-img');
  var lbCaption = document.querySelector('.lb-caption');
  var closeBtn = document.querySelector('.lb-close');
  var contactForm = document.querySelector('.contact-form');

  // --- 1. Мобильное меню ---
  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      var expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 2. Header scroll ---
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
  }

  // --- 3. Back to Top ---
  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.hidden = window.pageYOffset <= 600;
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. Галерея ---
  if (galleryGrid) {
    var photoList = [
      { id: 'IMG_01', category: 'macrame', title: 'Макраме панно' },
      { id: 'IMG_02', category: 'embroidery', title: 'Вышивка ручной работы' },
      { id: 'IMG_03', category: 'swing', title: 'Подвесные качели' },
      { id: 'IMG_04', category: 'swing', title: 'Качели интерьерные' },
      { id: 'IMG_05', category: 'macrame', title: 'Подвесное кашпо' },
      { id: 'IMG_06', category: 'embroidery', title: 'Вышивка монограмма' },
      { id: 'IMG_07', category: 'macrame', title: 'Шторы макраме' },
      { id: 'IMG_08', category: 'embroidery', title: 'Декоративная вышивка' },
      { id: 'IMG_09', category: 'macrame', title: 'Декор стены' },
      { id: 'IMG_10', category: 'swing', title: 'Лонграйдер' },
      { id: 'IMG_11', category: 'macrame', title: 'Панно крупное' },
      { id: 'IMG_12', category: 'embroidery', title: 'Картина вышивка' }
    ];

    galleryGrid.innerHTML = '';

    photoList.forEach(function(photo) {
      var item = document.createElement('div');
      item.className = 'gitem';
      item.setAttribute('data-category', photo.category);
      item.setAttribute('data-title', photo.title);
      item.setAttribute('role', 'listitem');
      item.setAttribute('tabindex', '0');

      var picture = document.createElement('picture');
      
      var sourceWebp = document.createElement('source');
      sourceWebp.srcset = '/assets/img/works/' + photo.id + '.webp';
      sourceWebp.type = 'image/webp';
      
      var sourceJpg = document.createElement('source');
      sourceJpg.srcset = '/assets/img/works/' + photo.id + '.jpg';
      sourceJpg.type = 'image/jpeg';

      var img = document.createElement('img');
      img.src = '/assets/img/works/' + photo.id + '.jpg';
      img.alt = photo.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      
      img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23F8F5F2"/%3E%3Ctext x="50%25" y="45%25" font-family="Space Grotesk" font-size="24" fill="%23FF6B35" text-anchor="middle"%3ESilkSoul%3C/text%3E%3Ctext x="50%25" y="65%25" font-family="Outfit" font-size="14" fill="%236B5F55" text-anchor="middle"%3E' + photo.title + '%3C/text%3E%3C/svg%3E';
      };

      var button = document.createElement('button');
      button.className = 'gitem-button';
      button.setAttribute('aria-label', 'Открыть ' + photo.title);
      button.innerHTML = '<span class="gitem-icon" aria-hidden="true">🔍</span>';

      picture.appendChild(sourceWebp);
      picture.appendChild(sourceJpg);
      picture.appendChild(img);
      item.appendChild(picture);
      item.appendChild(button);
      galleryGrid.appendChild(item);
    });

    // --- Фильтрация ---
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var filter = btn.getAttribute('data-filter');
        var items = galleryGrid.querySelectorAll('.gitem');

        items.forEach(function(item) {
          var category = item.getAttribute('data-category');
          item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
        });
      });
    });

    // --- Лайтбокс ---
    function openLightbox(src, alt, title) {
      if (!lightbox || !lbImg) return;
      lbImg.src = src;
      lbImg.alt = alt || title || 'Фото';
      if (lbCaption) lbCaption.textContent = title || alt || '';
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 100);
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.style.opacity = '0';
      setTimeout(function() {
        if (lbImg) lbImg.src = '';
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lbCaption) lbCaption.textContent = '';
      }, 300);
    }

    galleryGrid.addEventListener('click', function(e) {
      var item = e.target.closest('.gitem');
      if (item) {
        var img = item.querySelector('img');
        var title = item.getAttribute('data-title') || img.alt;
        openLightbox(img.src, img.alt, title);
      }
    });

    galleryGrid.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var item = e.target.closest('.gitem');
        if (item) {
          e.preventDefault();
          var img = item.querySelector('img');
          var title = item.getAttribute('data-title') || img.alt;
          openLightbox(img.src, img.alt, title);
        }
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });

    // --- Анимация ---
    if (shouldAnimate) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      var animateElements = document.querySelectorAll(
        '.card, .process-step, .review-card, .about-stats, .contact-form, .faq-list details'
      );

      animateElements.forEach(function(el) {
        el.classList.add('fade-up');
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('.fade-up').forEach(function(el) {
        el.classList.add('visible');
      });
    }
  }

  // --- 5. Форма ---
  if (contactForm) {
    var honeypot = contactForm.querySelector('input[name="bot-field"]');
    if (honeypot) {
      contactForm.addEventListener('submit', function(e) {
        if (honeypot.value) {
          e.preventDefault();
          return;
        }
      });
    }

    if (!contactForm.hasAttribute('data-netlify')) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = contactForm.querySelector('button[type="submit"]');
        var original = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon" aria-hidden="true">✓</span> Отправлено!';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        var name = contactForm.querySelector('input[name="name"]');
        var contact = contactForm.querySelector('input[name="contact"]');
        var consent = contactForm.querySelector('input[name="consent"]');

        if (!name.value.trim() || !contact.value.trim() || !consent.checked) {
          alert('Пожалуйста, заполните все обязательные поля.');
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.opacity = '1';
          return;
        }

        setTimeout(function() {
          alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
          contactForm.reset();
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 1000);
      });
    }
  }

  // --- 6. Защита ---
  function sanitizeInput(value) {
    var div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      var inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(function(input) {
        if (input.type !== 'checkbox' && input.type !== 'radio') {
          input.value = sanitizeInput(input.value);
        }
      });
    });
  }

  (function sanitizeUrlParams() {
    var url = new URL(window.location.href);
    var params = url.searchParams;
    var hasXss = false;
    
    params.forEach(function(value, key) {
      if (value.includes('<') || value.includes('>') || value.includes('"') || value.includes("'")) {
        hasXss = true;
        params.set(key, sanitizeInput(value));
      }
    });
    
    if (hasXss) {
      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    }
  })();

  console.log('✅ SilkSoul: сайт загружен и защищен');

})();
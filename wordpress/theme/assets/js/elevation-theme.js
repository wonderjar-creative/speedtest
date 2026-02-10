/**
 * Elevation Theme - Frontend Scripts
 *
 * jQuery-based interactions for the theme.
 * Counter animations, smooth scroll, back-to-top, mobile menu, scroll animations.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

(function ($) {
  'use strict';

  /* ==========================================================================
     Counter Animation
     Uses scroll events to detect when stat counters enter the viewport,
     then animates numbers from 0 to their target value.
     ========================================================================== */

  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    $('.elevation-counter').each(function () {
      var $counter = $(this);
      var target = parseInt($counter.data('target'), 10);
      var suffix = $counter.data('suffix') || '';
      var prefix = $counter.data('prefix') || '';
      var duration = 2000;
      var startTime = null;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutQuart(progress);
        var current = Math.floor(easedProgress * target);
        $counter.text(prefix + current.toLocaleString() + suffix);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          $counter.text(prefix + target.toLocaleString() + suffix);
        }
      }

      window.requestAnimationFrame(step);
    });

    countersAnimated = true;
  }

  function isElementInViewport($el) {
    var elementTop = $el.offset().top;
    var elementBottom = elementTop + $el.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  /* ==========================================================================
     Smooth Scroll
     Handles anchor links with smooth scrolling behavior.
     ========================================================================== */

  function initSmoothScroll() {
    $('a[href*="#"]:not([href="#"])').on('click', function (e) {
      var hash = this.hash;
      if (!hash) return;

      var $target = $(hash);
      if (!$target.length) {
        $target = $('[name="' + hash.slice(1) + '"]');
      }

      if ($target.length) {
        e.preventDefault();
        $('html, body').animate(
          {
            scrollTop: $target.offset().top - 80,
          },
          800,
          'swing'
        );

        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, hash);
        }
      }
    });
  }

  /* ==========================================================================
     Back to Top Button
     Shows a button after scrolling down, smooth scrolls back to top.
     ========================================================================== */

  function initBackToTop() {
    var $btn = $(
      '<button class="elevation-back-to-top" aria-label="Back to top" title="Back to top">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="18 15 12 9 6 15"></polyline>' +
        '</svg>' +
        '</button>'
    );

    $('body').append($btn);

    $(window).on('scroll.backToTop', function () {
      if ($(this).scrollTop() > 600) {
        $btn.addClass('is-visible');
      } else {
        $btn.removeClass('is-visible');
      }
    });

    $btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
    });
  }

  /* ==========================================================================
     Scroll Reveal
     Fade in elements as they scroll into view. Classic jQuery approach
     using scroll events instead of IntersectionObserver.
     ========================================================================== */

  function initScrollReveal() {
    var $reveals = $(
      '.wp-block-column, .wp-block-group.has-gray-100-background-color, .wp-block-image'
    );

    $reveals.each(function () {
      $(this).css({
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      });
    });

    function checkReveals() {
      var windowBottom = $(window).scrollTop() + $(window).height();

      $reveals.each(function () {
        var $el = $(this);
        var elTop = $el.offset().top;

        if (windowBottom > elTop + 60) {
          $el.css({
            opacity: 1,
            transform: 'translateY(0)',
          });
        }
      });
    }

    // Use a throttled scroll handler (typical slow approach)
    var scrollTimer;
    $(window).on('scroll.reveal', function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(checkReveals, 50);
    });

    // Initial check
    checkReveals();
  }

  /* ==========================================================================
     Mobile Menu
     Adds a hamburger toggle for the WP navigation on mobile.
     ========================================================================== */

  function initMobileMenu() {
    var $nav = $('.wp-block-navigation');
    if (!$nav.length) return;

    var $toggle = $(
      '<button class="elevation-menu-toggle" aria-label="Toggle menu" aria-expanded="false">' +
        '<span class="elevation-menu-toggle__bar"></span>' +
        '<span class="elevation-menu-toggle__bar"></span>' +
        '<span class="elevation-menu-toggle__bar"></span>' +
        '</button>'
    );

    $nav.before($toggle);

    $toggle.on('click', function () {
      var isOpen = $nav.hasClass('is-menu-open');
      $nav.toggleClass('is-menu-open');
      $toggle.toggleClass('is-active');
      $(this).attr('aria-expanded', !isOpen);
      $('body').toggleClass('menu-open');
    });
  }

  /* ==========================================================================
     Header Scroll Effect
     Adds a shadow to the header when the page is scrolled.
     ========================================================================== */

  function initHeaderScroll() {
    var $header = $('.wp-site-blocks > header');
    if (!$header.length) return;

    $(window).on('scroll.header', function () {
      if ($(this).scrollTop() > 10) {
        $header.css('box-shadow', '0 2px 20px rgba(0,0,0,0.1)');
      } else {
        $header.css('box-shadow', 'none');
      }
    });
  }

  /* ==========================================================================
     Dropdown Menus
     Handles hover/focus behavior for submenu items.
     ========================================================================== */

  function initDropdowns() {
    var $menuItems = $('.wp-block-navigation-item.has-child');

    $menuItems
      .on('mouseenter', function () {
        $(this).addClass('is-dropdown-open');
        $(this).find('> .wp-block-navigation__submenu-container').stop(true).slideDown(200);
      })
      .on('mouseleave', function () {
        $(this).removeClass('is-dropdown-open');
        $(this).find('> .wp-block-navigation__submenu-container').stop(true).slideUp(150);
      });

    // Keyboard accessibility for dropdowns
    $menuItems
      .find('> .wp-block-navigation-item__content')
      .on('focus', function () {
        $(this).parent().addClass('is-dropdown-open');
        $(this).parent().find('> .wp-block-navigation__submenu-container').slideDown(200);
      });

    // Close dropdowns when tabbing out
    $menuItems
      .find('.wp-block-navigation__submenu-container a:last-child')
      .on('focusout', function () {
        var $parent = $(this).closest('.has-child');
        setTimeout(function () {
          if (!$parent.find(':focus').length) {
            $parent.removeClass('is-dropdown-open');
            $parent.find('> .wp-block-navigation__submenu-container').slideUp(150);
          }
        }, 100);
      });
  }

  /* ==========================================================================
     Testimonial Carousel (if multiple testimonials on homepage)
     Auto-rotates testimonials with a fade transition.
     ========================================================================== */

  function initTestimonialRotation() {
    var $testimonials = $(
      '.wp-block-group.has-gray-100-background-color .wp-block-group:has([style*="font-style:italic"])'
    );
    if ($testimonials.length <= 1) return;

    // Only on sections with multiple testimonial cards side-by-side
    var $parent = $testimonials.first().closest('.wp-block-columns');
    if (!$parent.length) return;

    // Add subtle pulse to testimonial cards
    $testimonials.each(function (index) {
      var $card = $(this);
      setTimeout(function () {
        $card.css({
          animation: 'testimonialPulse 4s ease-in-out infinite',
          'animation-delay': index * 1.5 + 's',
        });
      }, 500);
    });
  }

  /* ==========================================================================
     Image Lightbox (simple jQuery version)
     Click on portfolio/project images to view larger.
     ========================================================================== */

  function initLightbox() {
    var $overlay = $(
      '<div class="elevation-lightbox">' +
        '<button class="elevation-lightbox__close" aria-label="Close">&times;</button>' +
        '<img class="elevation-lightbox__img" src="" alt="" />' +
        '</div>'
    );

    $('body').append($overlay);

    // Only on project/portfolio images
    $(
      '.wp-block-post-featured-image img, .wp-block-image:not(.is-style-rounded) img'
    ).css('cursor', 'zoom-in');

    $(document).on(
      'click',
      '.wp-block-post-featured-image img, .wp-block-image:not(.is-style-rounded) img',
      function () {
        var src = $(this).attr('src');
        var alt = $(this).attr('alt') || '';
        $overlay.find('.elevation-lightbox__img').attr('src', src).attr('alt', alt);
        $overlay.addClass('is-active');
        $('body').css('overflow', 'hidden');
      }
    );

    $overlay.on('click', function (e) {
      if (
        $(e.target).hasClass('elevation-lightbox') ||
        $(e.target).hasClass('elevation-lightbox__close')
      ) {
        $overlay.removeClass('is-active');
        $('body').css('overflow', '');
      }
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $overlay.hasClass('is-active')) {
        $overlay.removeClass('is-active');
        $('body').css('overflow', '');
      }
    });
  }

  /* ==========================================================================
     Initialize Everything on DOM Ready
     ========================================================================== */

  $(document).ready(function () {
    initSmoothScroll();
    initBackToTop();
    initScrollReveal();
    initMobileMenu();
    initHeaderScroll();
    initDropdowns();
    initTestimonialRotation();
    initLightbox();

    // Counter animation on scroll
    $(window).on('scroll.counters', function () {
      var $counterSection = $('.elevation-counter').first().closest('.wp-block-group');
      if ($counterSection.length && isElementInViewport($counterSection)) {
        animateCounters();
        $(window).off('scroll.counters');
      }
    });

    // Trigger once in case already in view
    $(window).trigger('scroll.counters');
  });

  /* ==========================================================================
     Additional: Window Load (heavier)
     Run after all resources including images have loaded.
     ========================================================================== */

  $(window).on('load', function () {
    // Recalculate scroll reveal positions after images load
    $(window).trigger('scroll.reveal');

    // Add loaded class for any CSS transitions that depend on it
    $('body').addClass('elevation-loaded');
  });
})(jQuery);

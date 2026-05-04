'use client';

import { useEffect } from 'react';

/**
 * Animates `.elevation-counter` elements when scrolled into view.
 *
 * Like ScrollReveal, mounted at root as a sibling of content rather
 * than wrapping it — wrapping captures children into the RSC stream
 * and bloats the HTML.
 */
export function CounterAnimation() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const counters = document.querySelectorAll<HTMLElement>('.wp-site-blocks .elevation-counter');
    if (counters.length === 0) return;

    if (prefersReducedMotion) {
      counters.forEach((el) => {
        const target = parseInt(el.dataset.target || '0', 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      });
      return;
    }

    const animateCounter = (el: HTMLElement) => {
      const target = parseInt(el.dataset.target || '0', 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const start = performance.now();

      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOutQuart(progress) * target);
        el.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}

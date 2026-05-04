'use client';

import { useEffect } from 'react';

/**
 * Reveals matching elements as they scroll into view.
 *
 * Mounted at root as a sibling of content (not a wrapper) so we don't
 * serialize the server tree into the RSC stream — the previous
 * children-capturing version was responsible for ~60% of the page's
 * HTML weight.
 */
export function ScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll(
      '.wp-site-blocks .wp-block-column, .wp-site-blocks .wp-block-image, .wp-site-blocks .wp-block-group.has-gray-100-background-color'
    );
    if (targets.length === 0) return;

    targets.forEach((el) => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';

interface CounterAnimationProps {
  children: React.ReactNode;
}

export function CounterAnimation({ children }: CounterAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = ref.current;
    if (!container) return;

    const counters = container.querySelectorAll<HTMLElement>('.elevation-counter');
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

  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
}

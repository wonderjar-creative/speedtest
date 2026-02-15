'use client';

import { useEffect, useRef } from 'react';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function AnimatedBorder({ children, className, ...rest }: AnimatedBorderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = ref.current?.querySelectorAll('.__border-grow-right');

    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-border-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [children]);

  return <div ref={ref} className={className} {...rest}>{children}</div>;
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 200, suffix: "+", label: "Projects Completed" },
  { value: 15, suffix: "", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Design Awards" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [target, isVisible, duration]);

  return count;
}

function StatItem({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-white mb-2">
        {count}
        {stat.suffix}
      </p>
      <p className="text-gray-400 text-sm">{stat.label}</p>
    </div>
  );
}

export function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div ref={sectionRef}>
      <SectionWrapper bg="dark">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}

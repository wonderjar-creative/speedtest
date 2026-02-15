'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface BlastOffImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  rocketYThreshold?: number;
}

export function BlastOffImage({
  src,
  alt,
  className,
  width = 600,
  height = 600,
  rocketYThreshold = 400
}: BlastOffImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hasBlasted, setHasBlasted] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !src.endsWith('.svg')) return;

    const loadSvg = async () => {
      try {
        const tempImg = document.createElement('img');
        tempImg.crossOrigin = 'anonymous';

        tempImg.onload = async () => {
          try {
            const response = await fetch(`/api/proxy-svg?url=${encodeURIComponent(src)}`);
            if (!response.ok) throw new Error('Failed to fetch SVG');

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'image/svg+xml');
            const svg = doc.querySelector('svg');

            if (svg) {
              svg.classList.add('overflow-visible');
              svg.setAttribute('width', '100%');
              svg.setAttribute('height', '100%');
              svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
              const serializer = new XMLSerializer();
              setSvgContent(serializer.serializeToString(svg));
            }
          } catch (err) {
            console.warn('Could not load SVG inline, using img fallback:', err);
          }
        };

        tempImg.onerror = () => {
          console.warn('Image failed to load, using img fallback');
        };

        tempImg.src = src;
      } catch (err) {
        console.warn('Could not load SVG inline:', err);
      }
    };

    loadSvg();
  }, [src]);

  useEffect(() => {
    if (isInView && !hasBlasted && svgContainerRef.current && svgContent) {
      setHasBlasted(true);

      const animateRocket = () => {
        const svgElement = svgContainerRef.current?.querySelector('svg');
        if (!svgElement) return;

        const paths = svgElement.querySelectorAll('path');

        paths.forEach((path) => {
          try {
            const bbox = path.getBBox();
            const centerY = bbox.y + bbox.height / 2;

            if (centerY < rocketYThreshold) {
              path.style.transition = 'transform 2.5s cubic-bezier(0.43, 0.13, 0.23, 0.96)';
              path.style.transformOrigin = `${bbox.x + bbox.width / 2}px ${bbox.y + bbox.height / 2}px`;
              path.style.transform = 'translateY(-150px) rotate(-5deg)';

              setTimeout(() => {
                path.style.transition = 'transform 0.5s ease-out';
                path.style.transform = 'translateY(0) rotate(0deg)';
                setTimeout(animateRocket, 1000);
              }, 2500);
            }
          } catch (e) {
            console.warn('Could not animate path:', e);
          }
        });
      };

      setTimeout(animateRocket, 100);
    }
  }, [isInView, hasBlasted, svgContent, rocketYThreshold]);

  return (
    <div ref={ref} className="relative inline-block" style={{ width, height, overflow: 'visible' }}>
      <div
        ref={svgContainerRef}
        className={className}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      <motion.div
        className="absolute bottom-24 right-1/3 pointer-events-none -z-10"
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={hasBlasted ? {
          opacity: [0, 0.6, 0.8, 0.4, 0],
          scale: [0.5, 1, 1.5, 2, 2.5],
          y: [0, 20, 40, 60, 80],
          x: [-10, -15, -20, -25, -30],
        } : {}}
        transition={{ duration: 2.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
      >
        <div className="w-32 h-32 bg-gray-400/60 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-1/4 pointer-events-none -z-10"
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={hasBlasted ? {
          opacity: [0, 0.6, 0.8, 0.4, 0],
          scale: [0.5, 1, 1.5, 2, 2.5],
          y: [0, 20, 40, 60, 80],
          x: [10, 15, 20, 25, 30],
        } : {}}
        transition={{ duration: 2.5, ease: 'easeOut', delay: 0.15, repeat: Infinity, repeatDelay: 1.5 }}
      >
        <div className="w-32 h-32 bg-gray-400/60 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-1/4 pointer-events-none -z-10"
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={hasBlasted ? {
          opacity: [0, 0.7, 0.9, 0.5, 0],
          scale: [0.5, 1.2, 1.8, 2.3, 2.8],
          y: [0, 15, 30, 45, 60],
        } : {}}
        transition={{ duration: 2.7, ease: 'easeOut', delay: 0.08, repeat: Infinity, repeatDelay: 1.5 }}
      >
        <div className="w-36 h-36 bg-gray-300/70 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-1/4 pointer-events-none -z-10"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={hasBlasted ? {
          opacity: [0, 1, 1, 0.6, 0],
          scaleY: [0, 1, 1.5, 1.3, 0],
        } : {}}
        transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 2 }}
      >
        <div className="w-24 h-48 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-md opacity-80" />
      </motion.div>

      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-24 right-1/4 w-2 h-2 bg-yellow-300 rounded-full pointer-events-none shadow-lg shadow-yellow-400/50"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={hasBlasted ? {
            opacity: [0, 1, 1, 0.7, 0],
            scale: [0, 1.3, 0.8, 0.4, 0],
            x: [0, (Math.random() - 0.5) * 140],
            y: [0, Math.random() * 120 + 40],
            rotate: [0, Math.random() * 360],
          } : {}}
          transition={{
            duration: 2,
            ease: 'easeOut',
            delay: 0.3 + i * 0.06,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface JumpingTextProps {
  text: string;
  targetLetter?: string;
}

export function JumpingText({ text, targetLetter = 'p' }: JumpingTextProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const letters = text.split('');

  return (
    <span style={{ display: 'inline-block' }}>
      {letters.map((letter, index) => {
        const shouldJump = letter.toLowerCase() === targetLetter.toLowerCase();

        return (
          <motion.span
            key={index}
            style={{ display: 'inline-block' }}
            animate={shouldAnimate && shouldJump ? {
              y: [0, -30, 0, -15, 0, -5, 0],
              rotate: [0, -5, 5, -3, 3, 0],
            } : {}}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </span>
  );
}

'use client';

import { useEffect, useState } from 'react';

const PHRASES = [
  'Build Roblox Games',
  'Generate Worlds',
  'Script Anything',
  'Fix Everything',
];

const TYPING_SPEED   = 65;   // ms per char typing
const DELETING_SPEED = 35;   // ms per char deleting
const PAUSE_AFTER_TYPED   = 1800; // ms pause at full phrase
const PAUSE_AFTER_DELETED = 400;  // ms pause before next phrase

export default function TypewriterText() {
  const [displayed, setDisplayed]   = useState('');
  const [phraseIdx, setPhraseIdx]   = useState(0);
  const [charIdx, setCharIdx]       = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused]     = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const current = PHRASES[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(i => i + 1);
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        // Done typing — pause then start deleting
        setIsPaused(true);
        const t = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, PAUSE_AFTER_TYPED);
        return () => clearTimeout(t);
      }
    } else {
      // Deleting
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(i => i - 1);
        }, DELETING_SPEED);
        return () => clearTimeout(t);
      } else {
        // Done deleting — pause then move to next phrase
        setIsPaused(true);
        const t = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(false);
          setPhraseIdx(i => (i + 1) % PHRASES.length);
        }, PAUSE_AFTER_DELETED);
        return () => clearTimeout(t);
      }
    }
  }, [charIdx, isDeleting, isPaused, phraseIdx]);

  return (
    <span
      className="text-gold-gradient"
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        fontSize: 'inherit',
        display: 'inline-block',
        minWidth: '1ch',
      }}
    >
      {displayed}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          background: 'var(--gold-400)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          borderRadius: '1px',
          animation: 'typewriterBlink 1s step-end infinite',
        }}
      />
      <style>{`
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

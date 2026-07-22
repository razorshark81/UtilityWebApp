'use client';
import { useMemo, useEffect } from 'react';

// A fresh <template> instance mounts on every client navigation, so this is
// the perfect place to give each page a randomized entrance animation.
const ANIMS = ['pt-fade', 'pt-up', 'pt-down', 'pt-left', 'pt-right', 'pt-scale', 'pt-blur', 'pt-rotate'];

// Module-level flag: stays false through the very first (server-matched)
// render so hydration markup is identical, then true for every later nav.
let hydrated = false;

export default function Template({ children }) {
  const anim = useMemo(() => {
    if (!hydrated) return ''; // first paint: match SSR (no class) → no hydration mismatch
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return '';
    return ANIMS[(Math.random() * ANIMS.length) | 0];
  }, []);

  useEffect(() => { hydrated = true; }, []);

  return <div className={`page-transition ${anim}`.trim()}>{children}</div>;
}

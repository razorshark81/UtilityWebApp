'use client';
import { useEffect, useRef, useState } from 'react';

// The site is a static export (no backend), so a real global visit count uses
// a tiny free hit-counter service. It only ever sends an anonymous page hit —
// never any tool input — and fails silently so it can never break the page.
const BASE = 'https://abacus.jasoncameron.dev';
const NS = 'utilitywebapps-vercel-app';
const KEY = 'site-visits';

function useCountUp(target, ms = 900) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (target == null) return;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);
  return val;
}

export default function VisitCounter({ compact = false }) {
  const [total, setTotal] = useState(null);
  const shown = useCountUp(total);

  useEffect(() => {
    let alive = true;
    let counted = false;
    try { counted = !!sessionStorage.getItem('uh-visited'); } catch (e) {}
    const url = counted ? `${BASE}/get/${NS}/${KEY}` : `${BASE}/hit/${NS}/${KEY}`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d || typeof d.value !== 'number') return;
        setTotal(d.value);
        try { sessionStorage.setItem('uh-visited', '1'); } catch (e) {}
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));

    return () => { alive = false; ctrl.abort(); clearTimeout(timer); };
  }, []);

  if (total == null) return null;

  return (
    <div className={`visit-counter${compact ? ' vc-compact' : ''}`} title="Total visits to UtilityHub" aria-live="polite">
      <span className="vc-dot" aria-hidden="true" />
      <b>{shown.toLocaleString()}</b>
      <span className="vc-label">{compact ? 'visits' : 'visitors and counting'}</span>
    </div>
  );
}

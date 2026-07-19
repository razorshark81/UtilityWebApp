'use client';
import { useEffect, useRef } from 'react';
import { mountTool } from '@/lib/runtime';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if ([...document.scripts].some((s) => s.src === src)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// A few tools depend on external libs loaded lazily, only on their own page.
const NEEDS = {
  qr: 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
};

export default function ToolRunner({ id }) {
  const ref = useRef(null);

  // remember this tool as "recently used" (for the homepage)
  useEffect(() => {
    try {
      const key = 'uh-recent';
      const prev = JSON.parse(localStorage.getItem(key) || '[]').filter((x) => x !== id);
      localStorage.setItem(key, JSON.stringify([id, ...prev].slice(0, 8)));
    } catch (e) {}
  }, [id]);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const dep = NEEDS[id];
      if (dep && !window.QRCode) {
        try { await loadScript(dep); } catch (e) { /* tool will show its own error */ }
      }
      if (!cancelled && ref.current) {
        cleanup = mountTool(ref.current, id);
      }
    })();

    return () => {
      cancelled = true;
      try { cleanup && cleanup(); } catch (e) {}
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [id]);

  return <div ref={ref} className="tool-body" />;
}

'use client';
import { useEffect, useState } from 'react';

// A one-time-per-session splash. Rendered on the client only (after mount) so
// it never blocks SSR/SEO content, and it respects reduced-motion.
const WORD = 'UtilityHub';

export default function IntroAnimation({ count = 200 }) {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('uh-intro')) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem('uh-intro', '1');
        return;
      }
    } catch (e) { return; }

    setShow(true);
    document.documentElement.style.overflow = 'hidden';
    const t1 = setTimeout(() => setLeaving(true), 2050);
    const t2 = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = '';
      try { sessionStorage.setItem('uh-intro', '1'); } catch (e) {}
    }, 2750);

    return () => { clearTimeout(t1); clearTimeout(t2); document.documentElement.style.overflow = ''; };
  }, []);

  if (!show) return null;

  return (
    <div className={`intro-overlay${leaving ? ' leaving' : ''}`} aria-hidden="true">
      <div className="intro-mesh" />
      <div className="intro-inner">
        <span className="intro-logo">
          <span className="intro-ring" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 22V12" />
          </svg>
        </span>
        <div className="intro-word" aria-label={WORD}>
          {WORD.split('').map((ch, i) => (
            <span key={i} className={i >= 7 ? 'iw-accent' : ''} style={{ animationDelay: `${0.32 + i * 0.045}s` }}>{ch}</span>
          ))}
        </div>
        <div className="intro-tag">Every little tool, all in one place.</div>
        <div className="intro-pill"><span className="intro-pill-dot" /> {count}+ tools ready</div>
      </div>
      <div className="intro-progress"><span /></div>
    </div>
  );
}

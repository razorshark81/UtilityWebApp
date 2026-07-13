'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORIES, CATEGORY_ORDER, toolsByCat } from '@/lib/catalog';
import ThemeToggle from './ThemeToggle';
import { useUI } from './UIStore';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { q, setQ } = useUI();

  const [openCat, setOpenCat] = useState(null);
  const [dd, setDd] = useState({ left: 0, top: 0, width: 560 });
  const [arrows, setArrows] = useState({ left: false, right: false });
  const scrollRef = useRef(null);

  const goHome = () => { if (pathname !== '/') router.push('/'); };

  const openFor = (key, btn) => {
    if (openCat === key) { setOpenCat(null); return; }
    const r = btn.getBoundingClientRect();
    const width = Math.min(600, window.innerWidth - 24);
    let left = r.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - 12 - width;
    setDd({ left: Math.max(12, left), top: r.bottom + 4, width });
    setOpenCat(key);
  };

  // close dropdown on escape / resize / outside / scroll
  useEffect(() => {
    if (!openCat) return;
    const close = () => setOpenCat(null);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [openCat]);

  // show scroll arrows only when the category row overflows
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setArrows({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => { updateArrows(); setOpenCat(null); };
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateArrows);
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', updateArrows); };
  }, [updateArrows]);

  const scrollByDir = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setQ('')}>
          <span className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 22V12" />
            </svg>
          </span>
          <span className="brand-name">Utility<b>Hub</b></span>
        </Link>

        <form className="nav-search" onSubmit={(e) => { e.preventDefault(); goHome(); }} role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={goHome} placeholder="Search 200+ tools…" aria-label="Search tools" autoComplete="off" />
        </form>

        <ThemeToggle />
      </div>

      <div className="catbar">
        <button className={`catbar-arrow ${arrows.left ? 'show' : ''}`} onClick={() => scrollByDir(-1)} aria-label="Scroll categories left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="catbar-scroll" ref={scrollRef}>
          {CATEGORY_ORDER.map((key) => {
            const c = CATEGORIES[key];
            return (
              <button key={key} className={`catbar-item ${openCat === key ? 'open' : ''}`} style={{ '--pc': c.color }} onClick={(e) => openFor(key, e.currentTarget)} aria-expanded={openCat === key}>
                <span className="ci-emoji">{c.emoji}</span>
                <span className="ci-name">{c.name}</span>
                <svg className="ci-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            );
          })}
        </div>
        <button className={`catbar-arrow ${arrows.right ? 'show' : ''}`} onClick={() => scrollByDir(1)} aria-label="Scroll categories right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {openCat && (
        <>
          <div className="catbar-backdrop" onClick={() => setOpenCat(null)} />
          <div className="catbar-dd" style={{ left: dd.left, top: dd.top, width: dd.width, '--pc': CATEGORIES[openCat].color }}>
            <div className="catbar-dd-head">
              <span className="cdd-emoji" style={{ background: CATEGORIES[openCat].color }}>{CATEGORIES[openCat].emoji}</span>
              <span className="cdd-title">{CATEGORIES[openCat].name}</span>
              <span className="cdd-count">{toolsByCat(openCat).length} tools</span>
            </div>
            <div className="catbar-dd-grid">
              {toolsByCat(openCat).map((t) => (
                <Link key={t.id} href={`/${t.slug}`} className="catbar-dd-item" onClick={() => setOpenCat(null)}>
                  <span className="cdi-emoji">{t.emoji}</span>
                  <span className="cdi-name">{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

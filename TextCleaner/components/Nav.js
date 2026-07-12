'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CATEGORY_ORDER, toolsByCat } from '@/lib/catalog';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);      // categories dropdown
  const [mobile, setMobile] = useState(false);  // mobile menu
  const [q, setQ] = useState('');
  const wrap = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : '/');
    setMobile(false);
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="UtilityHub home">
          <span className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 22V12" />
            </svg>
          </span>
          <span className="brand-name">Utility<b>Hub</b></span>
        </Link>

        <form className="nav-search" onSubmit={submit} role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 200+ tools…" aria-label="Search tools" />
        </form>

        <div className={`nav-right ${mobile ? 'open' : ''}`}>
          <div className="nav-cat" ref={wrap}>
            <button className="nav-cat-btn" onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} aria-expanded={open}>
              Categories
              <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {open && <div className="mega-backdrop open" onClick={() => setOpen(false)} />}
            <div className={`nav-cat-panel ${open ? 'open' : ''}`}>
              <div className="nav-cat-panel-inner">
                {CATEGORY_ORDER.map((key) => {
                  const c = CATEGORIES[key];
                  return (
                    <Link key={key} href={`/#cat-${key}`} className="nav-cat-item" onClick={() => { setOpen(false); setMobile(false); }}>
                      <span className="nav-cat-emoji" style={{ background: c.color }}>{c.emoji}</span>
                      <div className="nav-cat-text">
                        <span className="nav-cat-name">{c.name}</span>
                        <span className="nav-cat-n">{toolsByCat(key).length} tools</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <ThemeToggle />
        <button className="icon-btn nav-burger" aria-label="Menu" onClick={() => setMobile((v) => !v)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>
        </button>
      </div>
    </nav>
  );
}

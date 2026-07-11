'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES, CATEGORY_ORDER, toolsByCat } from '@/lib/catalog';

export default function ToolDirectory() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q');
    if (initial) setQ(initial);
    const hash = window.location.hash.match(/^#cat-(\w+)/);
    if (hash && CATEGORIES[hash[1]]) setCat(hash[1]);
  }, []);

  const query = q.trim().toLowerCase();
  const match = (t) =>
    !query ||
    t.name.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query) ||
    t.keywords.some((k) => k.includes(query));

  const counts = useMemo(() => {
    const c = { all: 0 };
    CATEGORY_ORDER.forEach((k) => { c[k] = toolsByCat(k).filter(match).length; c.all += c[k]; });
    return c;
  }, [query]);

  const sections = useMemo(
    () =>
      CATEGORY_ORDER.filter((k) => cat === 'all' || cat === k)
        .map((k) => ({ key: k, cat: CATEGORIES[k], tools: toolsByCat(k).filter(match) }))
        .filter((s) => s.tools.length),
    [query, cat]
  );

  return (
    <main className="container">
      <section className="hero">
        <span className="hero-badge"><span className="pulse" />100% in-browser · no uploads · no tracking</span>
        <h1>Every little tool,<br /><span className="grad">all in one place.</span></h1>
        <p>{TOOLS.length} fast, free, privacy-first utilities for text, code, images, conversions and everyday math — no sign-up, nothing ever leaves your device.</p>
        <div className="hero-stats">
          <div className="hero-stat"><div className="num">{TOOLS.length}</div><div className="lbl">Tools</div></div>
          <div className="hero-stat"><div className="num">{CATEGORY_ORDER.length}</div><div className="lbl">Categories</div></div>
          <div className="hero-stat"><div className="num">100%</div><div className="lbl">Private</div></div>
        </div>
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${TOOLS.length} tools…  (try “json”, “color”, “bmi”)`} aria-label="Search tools" autoComplete="off" />
        </div>
      </section>

      <nav className="pills" aria-label="Filter by category">
        <button className={`pill ${cat === 'all' ? 'active' : ''}`} style={{ '--pc': 'var(--accent)' }} onClick={() => setCat('all')}>
          All tools<span>{counts.all}</span>
        </button>
        {CATEGORY_ORDER.map((k) => {
          const c = CATEGORIES[k];
          return (
            <button key={k} className={`pill ${cat === k ? 'active' : ''}`} style={{ '--pc': c.color }} onClick={() => setCat(cat === k ? 'all' : k)}>
              <span className="pill-emoji">{c.emoji}</span>{c.name}<span>{counts[k]}</span>
            </button>
          );
        })}
      </nav>

      {sections.map(({ key, cat: c, tools }) => (
        <section className="cat-section" id={`cat-${key}`} key={key}>
          <div className="cat-head">
            <div className="cat-badge" style={{ background: c.color }}>{c.emoji}</div>
            <h2>{c.name}</h2>
            <span className="cat-count">{tools.length} tools</span>
          </div>
          <div className="tool-grid">
            {tools.map((t) => (
              <Link key={t.id} className="tool-card" href={`/${t.slug}`} style={{ '--cc': c.color }}>
                <span className="tc-emoji" style={{ background: `color-mix(in srgb, ${c.color} 14%, var(--surface-2))` }}>{t.emoji}</span>
                <div className="tc-name">{t.name}</div>
                <div className="tc-desc">{t.desc}</div>
                <svg className="tc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {sections.length === 0 && <div className="no-results">No tools match <b>“{q}”</b>. Try another keyword.</div>}

      <footer>Made with <b>♥</b> · UtilityHub © 2026 · {TOOLS.length} tools that run locally in your browser.</footer>
    </main>
  );
}

'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES, CATEGORY_ORDER, toolsByCat } from '@/lib/catalog';
import { useUI } from './UIStore';

export default function ToolDirectory() {
  const { q, setQ, cat } = useUI();

  const query = q.trim().toLowerCase();
  const match = (t) =>
    !query ||
    t.name.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query) ||
    t.keywords.some((k) => k.includes(query));

  const sections = useMemo(
    () =>
      CATEGORY_ORDER.filter((k) => cat === 'all' || cat === k)
        .map((k) => ({ key: k, cat: CATEGORIES[k], tools: toolsByCat(k).filter(match) }))
        .filter((s) => s.tools.length),
    [query, cat]
  );
  const total = useMemo(
    () => TOOLS.filter((t) => (cat === 'all' || t.cat === cat) && match(t)).length,
    [query, cat]
  );

  return (
    <main className="container">
      <section className="hero">
        <h1>All your everyday tools, <span className="grad">in one place.</span></h1>
        <p>
          UtilityHub is a free collection of <b>{TOOLS.length}</b> fast, private tools for text, code, images, conversions,
          calculators and more — no sign-up, and nothing ever leaves your browser.
        </p>
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${TOOLS.length} tools…  (try “json”, “color”, “bmi”)`} aria-label="Search tools" autoComplete="off" />
        </div>
        <div className="hero-meta">
          Showing <b>{total}</b> {total === 1 ? 'tool' : 'tools'}
          {cat !== 'all' && <> in {CATEGORIES[cat].emoji} {CATEGORIES[cat].name}</>}
          {query && <> matching “{q}”</>}
        </div>
      </section>

      {sections.map(({ key, cat: c, tools }) => (
        <section className="cat-section" id={`cat-${key}`} key={key}>
          <div className="cat-head">
            <div className="cat-badge" style={{ background: c.color }}>{c.emoji}</div>
            <h2>{c.name}</h2>
            <span className="cat-count">{tools.length}</span>
          </div>
          <div className="tool-grid">
            {tools.map((t) => (
              <Link key={t.id} className="tool-card" href={`/${t.slug}`} style={{ '--cc': c.color }}>
                <span className="tc-emoji" style={{ background: `color-mix(in srgb, ${c.color} 14%, var(--surface-2))` }}>{t.emoji}</span>
                <span className="tc-body">
                  <span className="tc-name">{t.name}</span>
                  <span className="tc-desc">{t.desc}</span>
                </span>
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

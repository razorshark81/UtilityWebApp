'use client';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOOLS, CATEGORIES, CATEGORY_ORDER, toolsByCat, byId } from '@/lib/catalog';
import { popularTools } from '@/lib/seo';
import { useUI } from './UIStore';
import VisitCounter from './VisitCounter';

function Star({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

function ToolCard({ t, fav, onFav }) {
  const c = CATEGORIES[t.cat];
  return (
    <Link className="tool-card" href={`/${t.slug}`} style={{ '--cc': c.color }}>
      <span className="tc-emoji" style={{ background: `color-mix(in srgb, ${c.color} 14%, var(--surface-2))` }}>{t.emoji}</span>
      <span className="tc-body">
        <span className="tc-name">{t.name}</span>
        <span className="tc-desc">{t.desc}</span>
      </span>
      <button
        className={`tc-fav${fav ? ' on' : ''}`}
        aria-label={fav ? `Remove ${t.name} from favorites` : `Add ${t.name} to favorites`}
        aria-pressed={fav}
        title={fav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFav(t.id); }}
      >
        <Star active={fav} />
      </button>
    </Link>
  );
}

function Row({ icon, title, tools, favs, onFav }) {
  if (!tools.length) return null;
  return (
    <section className="cat-section">
      <div className="cat-head">
        <div className="cat-badge" style={{ background: 'var(--grad)' }}>{icon}</div>
        <h2>{title}</h2>
        <span className="cat-count">{tools.length}</span>
      </div>
      <div className="tool-grid">{tools.map((t) => <ToolCard key={t.id} t={t} fav={favs.has(t.id)} onFav={onFav} />)}</div>
    </section>
  );
}

export default function ToolDirectory() {
  const { q, setQ, cat } = useUI();
  const router = useRouter();
  const [recent, setRecent] = useState([]);
  const [favs, setFavs] = useState(() => new Set());
  const mainRef = useRef(null);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('uh-recent') || '[]');
      setRecent(ids.map((id) => byId[id]).filter(Boolean));
    } catch (e) {}
    try {
      const f = JSON.parse(localStorage.getItem('uh-favorites') || '[]');
      setFavs(new Set(f.filter((id) => byId[id])));
    } catch (e) {}
  }, []);

  const onFav = useCallback((id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('uh-favorites', JSON.stringify([...next])); } catch (e) {}
      return next;
    });
  }, []);

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

  const showExtras = cat === 'all' && !query;
  const favTools = useMemo(() => [...favs].map((id) => byId[id]).filter(Boolean), [favs]);

  const surprise = () => {
    const pool = sections.flatMap((s) => s.tools);
    const list = pool.length ? pool : TOOLS;
    const t = list[Math.floor(Math.random() * list.length)];
    if (t) router.push(`/${t.slug}`);
  };

  // Scroll-reveal for category sections (above-the-fold ones reveal instantly).
  useEffect(() => {
    const root = mainRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const secs = [...root.querySelectorAll('.cat-section')];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    secs.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.92 && r.bottom > 0;
      if (inView) sec.classList.add('revealed');
      else { sec.classList.add('pre-reveal'); io.observe(sec); }
    });
    return () => io.disconnect();
  }, [query, cat, favTools.length, recent.length]);

  return (
    <main className="container" ref={mainRef}>
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
        <div className="hero-actions">
          <button className="btn-surprise" onClick={surprise} type="button">🎲 Surprise me</button>
        </div>
        <div className="hero-meta">
          Showing <b>{total}</b> {total === 1 ? 'tool' : 'tools'}
          {cat !== 'all' && <> in {CATEGORIES[cat].emoji} {CATEGORIES[cat].name}</>}
          {query && <> matching “{q}”</>}
        </div>
        <VisitCounter />
      </section>

      {showExtras && <Row icon="⭐" title="Your favorites" tools={favTools} favs={favs} onFav={onFav} />}
      {showExtras && <Row icon="🕘" title="Recently used" tools={recent} favs={favs} onFav={onFav} />}
      {showExtras && <Row icon="🔥" title="Popular tools" tools={popularTools()} favs={favs} onFav={onFav} />}

      {sections.map(({ key, cat: c, tools }) => (
        <section className="cat-section" id={`cat-${key}`} key={key}>
          <div className="cat-head">
            <div className="cat-badge" style={{ background: c.color }}>{c.emoji}</div>
            <h2>{c.name}</h2>
            <span className="cat-count">{tools.length}</span>
          </div>
          <div className="tool-grid">{tools.map((t) => <ToolCard key={t.id} t={t} fav={favs.has(t.id)} onFav={onFav} />)}</div>
        </section>
      ))}

      {sections.length === 0 && <div className="no-results">No tools match <b>“{q}”</b>. Try another keyword.</div>}

      <footer>Made with <b>♥</b> · UtilityHub © 2026 · {TOOLS.length} tools that run locally in your browser.</footer>
    </main>
  );
}

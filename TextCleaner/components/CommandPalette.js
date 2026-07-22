'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS, CATEGORIES } from '@/lib/catalog';

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TOOLS.slice(0, 8);
    const scored = [];
    for (const t of TOOLS) {
      const name = t.name.toLowerCase();
      let score = 0;
      if (name === s) score = 100;
      else if (name.startsWith(s)) score = 82;
      else if (name.includes(s)) score = 64;
      else if (t.keywords.some((k) => k.includes(s))) score = 44;
      else if (t.desc.toLowerCase().includes(s)) score = 24;
      if (score) scored.push([score, t]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    return scored.slice(0, 14).map((x) => x[1]);
  }, [q]);

  useEffect(() => { setActive(0); }, [q]);

  const close = useCallback(() => { setOpen(false); setQ(''); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === 'Escape') setOpen((o) => (o ? false : o));
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('uh-open-cmdk', onOpen);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('uh-open-cmdk', onOpen); };
  }, []);

  useEffect(() => {
    if (open) { document.documentElement.style.overflow = 'hidden'; const t = setTimeout(() => inputRef.current?.focus(), 25); return () => clearTimeout(t); }
    document.documentElement.style.overflow = '';
  }, [open]);

  const go = useCallback((t) => { if (!t) return; close(); router.push(`/${t.slug}`); }, [close, router]);

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onClick={close}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search all tools" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey} placeholder="Search all tools…" aria-label="Search all tools" autoComplete="off" />
          <kbd className="cmdk-esc">Esc</kbd>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {results.length ? results.map((t, i) => {
            const c = CATEGORIES[t.cat];
            return (
              <button
                key={t.id}
                className="cmdk-item"
                data-active={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(t)}
              >
                <span className="cmdk-emoji" style={{ background: `color-mix(in srgb, ${c.color} 15%, var(--surface-2))` }}>{t.emoji}</span>
                <span className="cmdk-text">
                  <span className="cmdk-name">{t.name}</span>
                  <span className="cmdk-desc">{t.desc}</span>
                </span>
                <span className="cmdk-cat" style={{ color: c.color }}>{c.name}</span>
              </button>
            );
          }) : <div className="cmdk-empty">No tools match “{q}”.</div>}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

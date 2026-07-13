'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/catalog';
import ThemeToggle from './ThemeToggle';
import { useUI } from './UIStore';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { q, setQ, cat, setCat } = useUI();

  const goHome = () => { if (pathname !== '/') router.push('/'); };

  const onCat = (key) => { setCat(key); setQ(''); goHome(); };
  const submitSearch = (e) => { e.preventDefault(); goHome(); };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => { setCat('all'); setQ(''); }}>
          <span className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 22V12" />
            </svg>
          </span>
          <span className="brand-name">Utility<b>Hub</b></span>
        </Link>

        <form className="nav-search" onSubmit={submitSearch} role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={goHome} placeholder="Search tools…" aria-label="Search tools" autoComplete="off" />
        </form>

        <ThemeToggle />
      </div>

      <nav className="nav-cats" aria-label="Tool categories">
        <div className="nav-cats-inner">
          <button className={`ncat ${cat === 'all' ? 'active' : ''}`} style={{ '--pc': 'var(--accent)' }} onClick={() => onCat('all')}>
            All
          </button>
          {CATEGORY_ORDER.map((key) => {
            const c = CATEGORIES[key];
            return (
              <button key={key} className={`ncat ${cat === key ? 'active' : ''}`} style={{ '--pc': c.color }} onClick={() => onCat(key)}>
                <span className="ncat-emoji">{c.emoji}</span>{c.name}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UICtx = createContext(null);

// Shared search + category state so the top-bar search/menu and the homepage
// stay in sync live (no reload needed). Lives in the root layout, so it
// persists across client-side navigation between pages.
export function UIProvider({ children }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const iq = p.get('q');
      if (iq) setQ(iq);
      const m = window.location.hash.match(/^#cat-([a-z]+)/i);
      if (m) setCat(m[1]);
    } catch (e) {}
  }, []);

  return <UICtx.Provider value={{ q, setQ, cat, setCat }}>{children}</UICtx.Provider>;
}

export function useUI() {
  return useContext(UICtx) || { q: '', setQ: () => {}, cat: 'all', setCat: () => {} };
}

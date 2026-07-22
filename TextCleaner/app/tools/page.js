import Link from 'next/link';
import { SITE, TOOLS, CATEGORIES, CATEGORY_ORDER, toolsByCat } from '@/lib/catalog';

export const metadata = {
  title: { absolute: `All ${TOOLS.length} Tools — Full A-to-Z Directory | UtilityHub` },
  description: `Browse the complete list of all ${TOOLS.length} free UtilityHub tools, organized by category — text, code, image, converters, calculators, generators, SEO and more. Every tool runs privately in your browser.`,
  alternates: { canonical: `${SITE.url}/tools/` },
  openGraph: {
    title: `All ${TOOLS.length} UtilityHub Tools`,
    description: `The complete directory of ${TOOLS.length}+ free, private, in-browser tools.`,
    url: `${SITE.url}/tools/`,
    type: 'website',
  },
};

const itemListLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `All ${TOOLS.length} UtilityHub tools`,
  numberOfItems: TOOLS.length,
  itemListElement: TOOLS.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    url: `${SITE.url}/${t.slug}/`,
  })),
};
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
    { '@type': 'ListItem', position: 2, name: 'All tools', item: `${SITE.url}/tools/` },
  ],
};

export default function ToolsIndex() {
  return (
    <main className="container sitemap-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <span aria-current="page">All tools</span>
      </nav>

      <header className="sitemap-hero">
        <h1>All {TOOLS.length} tools, <span className="grad">A to Z.</span></h1>
        <p>The complete UtilityHub directory — every free, private, in-browser tool, grouped by category. Pick one to get started.</p>
        <div className="sitemap-jump">
          {CATEGORY_ORDER.map((k) => (
            <a key={k} href={`#c-${k}`} className="sitemap-chip" style={{ '--cc': CATEGORIES[k].color }}>
              <span>{CATEGORIES[k].emoji}</span> {CATEGORIES[k].name}
              <b>{toolsByCat(k).length}</b>
            </a>
          ))}
        </div>
      </header>

      {CATEGORY_ORDER.map((k) => {
        const c = CATEGORIES[k];
        const tools = toolsByCat(k);
        return (
          <section className="sitemap-cat" id={`c-${k}`} key={k}>
            <h2><span className="sitemap-badge" style={{ background: c.color }}>{c.emoji}</span>{c.name}<span className="cat-count">{tools.length}</span></h2>
            <ul className="sitemap-list">
              {tools.map((t) => (
                <li key={t.id}>
                  <Link href={`/${t.slug}`}>
                    <span className="sl-emoji">{t.emoji}</span>
                    <span className="sl-name">{t.name}</span>
                    <span className="sl-desc">{t.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer>Made with <b>♥</b> · <Link href="/">UtilityHub home</Link> · {TOOLS.length} tools that run locally in your browser.</footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
}

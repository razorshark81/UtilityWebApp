import { notFound } from 'next/navigation';
import Link from 'next/link';
import { bySlug, TOOLS, CATEGORIES, toolsByCat, seoTitle, seoDescription, SITE } from '@/lib/catalog';
import ToolRunner from '@/components/ToolRunner';

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export function generateMetadata({ params }) {
  const t = bySlug[params.slug];
  if (!t) return {};
  const title = seoTitle(t);
  const description = seoDescription(t);
  const url = `${SITE.url}/${t.slug}/`;
  return {
    title: { absolute: title },
    description,
    keywords: t.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default function ToolPage({ params }) {
  const t = bySlug[params.slug];
  if (!t) notFound();
  const cat = CATEGORIES[t.cat];
  const related = toolsByCat(t.cat).filter((x) => x.id !== t.id).slice(0, 6);
  const url = `${SITE.url}/${t.slug}/`;

  const appLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.name,
    description: seoDescription(t),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any (web browser)',
    url,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
  };
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: cat.name, item: `${SITE.url}/#cat-${t.cat}` },
      { '@type': 'ListItem', position: 3, name: t.name, item: url },
    ],
  };

  return (
    <main className="container tool-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <Link href={`/#cat-${t.cat}`}>{cat.name}</Link><span>›</span>
        <span aria-current="page">{t.name}</span>
      </nav>

      <header className="tool-hero">
        <div className="th-emoji" style={{ background: cat.color }}>{t.emoji}</div>
        <div><h1>{t.name}</h1><p>{t.desc}</p></div>
      </header>

      <ToolRunner id={t.id} />

      <section className="tool-about">
        <h2>About the {t.name}</h2>
        <p>
          {t.name} is a free, browser-based tool. {seoDescription(t)} It works instantly with nothing to install,
          and every calculation runs locally on your device, so your data never leaves your browser.
        </p>
      </section>

      {related.length > 0 && (
        <section className="related">
          <h2>Related {cat.name} tools</h2>
          <div className="tool-grid">
            {related.map((r) => (
              <Link key={r.id} className="tool-card" href={`/${r.slug}`} style={{ '--cc': cat.color }}>
                <span className="tc-emoji" style={{ background: `color-mix(in srgb, ${cat.color} 14%, var(--surface-2))` }}>{r.emoji}</span>
                <div className="tc-name">{r.name}</div>
                <div className="tc-desc">{r.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer>Made with <b>♥</b> · <Link href="/">All UtilityHub tools</Link> · Everything runs locally in your browser.</footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
    </main>
  );
}

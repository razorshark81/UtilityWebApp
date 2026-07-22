import { notFound } from 'next/navigation';
import Link from 'next/link';
import { bySlug, TOOLS, CATEGORIES, toolsByCat, seoTitle, seoDescription, SITE } from '@/lib/catalog';
import { toolFaqs, toolSteps, TOOL_FEATURES, softwareLd, faqLd, howToLd, breadcrumbLd } from '@/lib/seo';
import ToolRunner from '@/components/ToolRunner';
import ShareButton from '@/components/ShareButton';

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
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ToolPage({ params }) {
  const t = bySlug[params.slug];
  if (!t) notFound();
  const cat = CATEGORIES[t.cat];
  const related = toolsByCat(t.cat).filter((x) => x.id !== t.id).slice(0, 6);
  const url = `${SITE.url}/${t.slug}/`;
  const faqs = toolFaqs(t);
  const steps = toolSteps(t);

  const ld = [
    softwareLd(t, url),
    breadcrumbLd(t, cat, SITE.url),
    howToLd(t),
    faqLd(t),
  ];

  return (
    <main className="container tool-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <Link href={`/#cat-${t.cat}`}>{cat.name}</Link><span>›</span>
        <span aria-current="page">{t.name}</span>
      </nav>

      <header className="tool-hero">
        <div className="th-emoji" style={{ background: cat.color }}>{t.emoji}</div>
        <div className="th-text"><h1>{t.name}</h1><p>{t.desc}</p></div>
        <ShareButton title={`${t.name} — UtilityHub`} text={t.desc} />
      </header>

      <ToolRunner id={t.id} />

      <div className="tool-content">
        <section className="tc-block">
          <h2>How to use the {t.name}</h2>
          <ol className="how-steps">
            {steps.map((s, i) => (
              <li key={i}><span className="step-n">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </section>

        <section className="tc-block">
          <h2>Why use this free {t.name}?</h2>
          <ul className="feature-list">
            {TOOL_FEATURES.map((f, i) => (
              <li key={i}><span className="feat-check">✓</span>{f}</li>
            ))}
          </ul>
        </section>

        <section className="tc-block">
          <h2>About the {t.name}</h2>
          <p>
            The {t.name} is a free, browser-based utility. {seoDescription(t)} It works instantly with nothing to
            install, and every calculation happens locally on your device — so your data always stays private.
            It’s part of <Link href="/">UtilityHub</Link>, a collection of {TOOLS.length}+ fast, free online tools.
          </p>
        </section>

        <section className="tc-block faq">
          <h2>Frequently asked questions</h2>
          {faqs.map((f, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>Related {cat.name} tools</h2>
          <div className="tool-grid">
            {related.map((r) => (
              <Link key={r.id} className="tool-card" href={`/${r.slug}`} style={{ '--cc': cat.color }}>
                <span className="tc-emoji" style={{ background: `color-mix(in srgb, ${cat.color} 14%, var(--surface-2))` }}>{r.emoji}</span>
                <span className="tc-body">
                  <span className="tc-name">{r.name}</span>
                  <span className="tc-desc">{r.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer>Made with <b>♥</b> · <Link href="/tools">All {TOOLS.length} UtilityHub tools</Link> · <Link href="/">Home</Link> · Everything runs locally in your browser.</footer>

      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
    </main>
  );
}

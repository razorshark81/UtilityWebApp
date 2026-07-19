import ToolDirectory from '@/components/ToolDirectory';
import { SITE, TOOLS } from '@/lib/catalog';

export const metadata = {
  title: { absolute: `${TOOLS.length}+ Free Online Tools — Text, Code, Image & Calculator Utilities | UtilityHub` },
  description:
    `UtilityHub is a free collection of ${TOOLS.length}+ online tools: JSON formatter, password generator, image editor, unit & color converters, calculators, QR codes and more. No sign-up — everything runs privately in your browser.`,
  alternates: { canonical: `${SITE.url}/` },
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: `${SITE.url}/`,
  description: `${TOOLS.length}+ free, private, in-browser tools for text, code, images and everyday tasks.`,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/icon.svg`,
};

export default function Home() {
  return (
    <>
      <ToolDirectory />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </>
  );
}

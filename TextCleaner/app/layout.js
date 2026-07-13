import './globals.css';
import './ui.css';
import Nav from '@/components/Nav';
import { UIProvider } from '@/components/UIStore';
import { SITE } from '@/lib/catalog';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'UtilityHub — 200+ Free Online Tools for Everyday Tasks',
    template: '%s · UtilityHub',
  },
  description:
    '200+ free, fast, privacy-first browser tools for text, code, images, conversions, calculators, generators and more. No signup, no uploads — everything runs locally.',
  applicationName: 'UtilityHub',
  keywords: ['online tools', 'free tools', 'web tools', 'utilities', 'converters', 'calculators', 'generators'],
  openGraph: {
    type: 'website',
    siteName: 'UtilityHub',
    title: 'UtilityHub — 200+ Free Online Tools',
    description: 'A growing collection of fast, free, privacy-first browser utilities.',
    url: SITE.url,
  },
  twitter: { card: 'summary_large_image', title: 'UtilityHub — 200+ Free Online Tools' },
  robots: { index: true, follow: true },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#6366f1' };

const themeScript =
  "(function(){try{var t=localStorage.getItem('uh-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="aurora" aria-hidden="true"><span></span><span></span><span></span></div>
        <UIProvider>
          <Nav />
          <div className="stage">{children}</div>
        </UIProvider>
        <div id="toast" className="toast" role="status" aria-live="polite"></div>
        <canvas id="scratchCanvas" style={{ display: 'none' }}></canvas>
      </body>
    </html>
  );
}

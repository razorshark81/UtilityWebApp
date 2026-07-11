import ToolDirectory from '@/components/ToolDirectory';
import { SITE, TOOLS } from '@/lib/catalog';

export const metadata = {
  title: { absolute: `UtilityHub — ${TOOLS.length}+ Free Online Tools for Everyday Tasks` },
  description:
    `A directory of ${TOOLS.length}+ free, fast, privacy-first browser tools for text, code, images, conversions, calculators and generators. No signup, no uploads — everything runs locally in your browser.`,
  alternates: { canonical: `${SITE.url}/` },
};

export default function Home() {
  return <ToolDirectory />;
}

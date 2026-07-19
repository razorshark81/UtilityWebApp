import { TOOLS } from '@/lib/catalog';

export default function manifest() {
  return {
    name: 'UtilityHub — Free Online Tools',
    short_name: 'UtilityHub',
    description: `${TOOLS.length}+ free, private, in-browser tools for text, code, images, conversions and calculations.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#eef2fb',
    theme_color: '#6366f1',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    categories: ['productivity', 'utilities'],
  };
}

/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // Static Multi-Page export for production: every tool becomes a real,
  // crawlable /slug/index.html. (Skipped in `next dev`, where on-demand
  // rendering of dynamic routes conflicts with `output: export`.)
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

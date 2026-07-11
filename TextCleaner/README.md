# UtilityHub

A **Next.js (App Router) multi-page app** with **200+ free, private, in-browser tools**.
Every tool is its own statically-generated URL with unique SEO metadata — built for
search visibility (distinct `<title>`/meta per page, canonical URLs, Open Graph, JSON-LD,
`sitemap.xml`, `robots.txt`).

## Why multi-page?

The tools used to live on one giant page (`#hash` routing) — a single URL to Google, so
one `<title>` and one meta description for everything. Now each tool is a real route:

```
/                     → dashboard / directory (links to every tool)
/json-formatter/      → JSON Formatter   (own title, meta, canonical, JSON-LD)
/bmi-calculator/      → BMI Calculator
/password-strength/   → Password Strength Test
… 201 tool pages total
/sitemap.xml  /robots.txt
```

## Project structure

```
src/tools-source.html   ← authoring source of truth for all 201 tool implementations
gen.py                  ← build step: compiles the source into ↓
  ├─ lib/runtime.js     ← every tool's render()/init() (client runtime)  [generated]
  ├─ lib/catalog.js     ← tool metadata + slugs + SEO helpers (server-safe) [generated]
  └─ app/globals.css    ← design system / component styles              [generated]
tools.json              ← categories + SEO slug overrides (edit this)
app/
  layout.js             ← root layout, fonts, theme, <Nav/>
  page.js               ← dashboard (metadata + <ToolDirectory/>)
  [slug]/page.js        ← every tool page: generateStaticParams + generateMetadata + JSON-LD
  sitemap.js  robots.js  not-found.js
  ui.css                ← nav / breadcrumb / tool-page styles (hand-written)
components/
  Nav.js                ← clean header: search, Categories menu, theme toggle
  ToolDirectory.js      ← dashboard grid + live search filter
  ToolRunner.js         ← mounts a tool's vanilla render()/init() into React
  ThemeToggle.js        ← light / dark
```

## Develop

```bash
npm install
npm run dev        # http://localhost:3100
```

## Build the static site

```bash
npm run build      # → ./out  (fully static, deploy to any host / CDN)
```

`next.config.mjs` uses `output: 'export'` for production, so `out/` contains one
`index.html` per tool — no server required.

## Editing / adding tools

1. Edit or add a tool in `src/tools-source.html` (the `reg({ cat, id, emoji, name, desc, render, init })` blocks).
2. Run `python gen.py` to regenerate `lib/runtime.js`, `lib/catalog.js`, `app/globals.css`.
3. `npm run dev` picks it up; the new tool automatically gets a route, a dashboard card,
   a menu entry, and SEO tags.

Nicer SEO slugs live in `tools.json → slugOverrides` (`{ "bmi": "bmi-calculator" }`).

## Set your domain

SEO tags use `SITE.url` (currently `https://utilityhub.example`). Change it in `gen.py`
(the `SITE` line) and re-run `python gen.py`.

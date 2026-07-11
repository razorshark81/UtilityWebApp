# Running & deploying UtilityHub (beginner guide)

## Run it on your own computer

1. Open a terminal in this folder (in VS Code: **Terminal → New Terminal**;
   or right-click the folder → "Open in Terminal").
2. First time only, install the dependencies:
   ```bash
   npm install
   ```
3. Start it:
   ```bash
   npm run dev
   ```
4. Open **http://localhost:3100** in your browser. Edit a file → it refreshes automatically.
   Press `Ctrl+C` in the terminal to stop.

## Put it on the internet with Vercel (easiest, free)

Vercel is made by the creators of Next.js, so it "just works".

### Option A — through GitHub (recommended, gives auto-deploys)
1. Make a free account at **https://github.com** and install **GitHub Desktop**
   (https://desktop.github.com) — it's the no-terminal way to upload code.
2. In GitHub Desktop: **File → Add Local Repository →** pick this folder →
   **Publish repository** (you can keep it private).
3. Go to **https://vercel.com** and **Sign up with GitHub**.
4. Click **Add New… → Project**, pick your `utilityhub` repo, click **Deploy**.
   Vercel detects Next.js automatically — no settings needed.
5. ~1 minute later you get a live URL like `https://utilityhub-xxxx.vercel.app`. Done!
   Every time you push changes to GitHub, Vercel re-deploys automatically.

### Option B — Vercel from the terminal (no GitHub)
```bash
npm install -g vercel
vercel            # answer the prompts; accept the defaults
vercel --prod     # publish the production version
```

## Or host the static files anywhere (Netlify, Cloudflare Pages, GitHub Pages…)

This project builds to a plain static website — no server required.
```bash
npm run build     # creates the ./out folder
```
Upload the **`out`** folder to any static host (drag-and-drop works on
Netlify: https://app.netlify.com/drop).

## One SEO tweak after you have a URL

Search engines like knowing your real address. Once you know your live URL
(e.g. `https://utilityhub-xxxx.vercel.app`):
1. Open `gen.py`, find the line with `SITE = { name: 'UtilityHub', url: 'https://utilityhub.example', ... }`.
2. Change `https://utilityhub.example` to your real URL (no trailing slash).
3. Run `python gen.py`, then redeploy (push to GitHub, or `vercel --prod`, or re-upload `out`).

That's it — your canonical URLs, sitemap and social previews will all use the right domain.

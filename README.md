# COSMOS NextGen IT — Website

Marketing website for [COSMOS NextGen IT LLC](https://cosmosnextgen.com), built with React + Vite and deployed on Cloudflare Pages.

## Stack

- **React 18** + **React Router 7** — single-page app with one nested route (`/training`)
- **Vite 7** — dev server and bundler
- **Cloudflare Pages** — hosting, with [Pages Functions](https://developers.cloudflare.com/pages/functions/) for the contact form API
- **Resend** — transactional email for contact form submissions

No CSS framework. Each component carries its own `<style>` block.

## Project structure

```
cosmosnextgen-site/
├── functions/
│   └── api/
│       └── contact.js          # Cloudflare Pages Function — POST /api/contact
├── public/
│   ├── /* /index.html 200              # SPA fallback for client-side routing
│   ├── favicon.ico
│   └── images/                 # All visual assets (WebP)
├── src/
│   ├── components/
│   │   ├── App.jsx             # Router + page composition
│   │   ├── Navbar.jsx          # Sticky header with active-section scroll-spy
│   │   ├── Hero.jsx            # Landing hero
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── WhyUs.jsx
│   │   ├── Contact.jsx         # Form posts to /api/contact
│   │   ├── Careers.jsx
│   │   ├── Footer.jsx
│   │   ├── Training.jsx        # Standalone /training route
│   │   ├── TrustLogos.jsx
│   │   ├── CaseStudies.jsx     # (unused — not currently rendered)
│   │   └── ScrollToHash.jsx    # Smooth-scroll to #anchor on route change
│   ├── styles/
│   │   └── globals.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Local development

Requirements: **Node 18+** and npm.

```bash
npm install
npm run dev
```

Opens at <http://localhost:5173>. The dev server uses `strictPort: true`, so it will fail loudly rather than pick a different port if 5173 is busy.

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ locally for smoke-testing
```

## Contact form — how it works

The form in `Contact.jsx` POSTs JSON to `/api/contact`. In production, Cloudflare routes that path to `functions/api/contact.js`, which validates the input and forwards the message to Resend.

### Environment variables

Set in the Cloudflare Pages dashboard → **Settings → Environment variables**:

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes | From your [Resend dashboard](https://resend.com/api-keys) |

The function sends from `no-reply@cosmosnextgen.com` (must be a verified domain in Resend) to `hr@cosmosnextgen.com`.

### Security layers in the API

The function applies these defenses, in order:

1. **Origin allow-list** — only requests from `cosmosnextgen.com`, `www.cosmosnextgen.com`, or the preview deployment are accepted (others get 403)
2. **Content-Type gate** — non-JSON gets 415
3. **Per-IP rate limit** — 5 submissions per 10 minutes
4. **Honeypot field** (`website`) — silently 200s submissions where it's filled
5. **Time gate** — submissions <2s after page load are dropped as bot traffic
6. **Header-injection defense** — rejects CR/LF in single-line fields
7. **Length caps** — name 200, email 200, phone 50, message 5000
8. **Email regex validation**

Generic error messages are returned to the client; real errors are logged server-side via `console.error` (visible in the Cloudflare Pages dashboard logs).

If you need stronger rate-limiting, configure Cloudflare's edge rate-limit rules — the in-memory bucket here is a basic abuse brake, not bulletproof.

To update which domains can post to the API, edit `ALLOWED_ORIGINS` at the top of `functions/api/contact.js`.

## Deployment

Deployed automatically on push to `main` via Cloudflare Pages. Build settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/`

`public//* /index.html 200` contains `/* /index.html 200` so client-side routes (like `/training`) resolve correctly when hit directly.

## Routes

| Path | Component | Notes |
|---|---|---|
| `/` | `App.jsx` → `Home()` | Hero, About, Services, WhyUs, Contact, Careers |
| `/training` | `Training.jsx` | Standalone training page |
| `/api/contact` | `functions/api/contact.js` | POST only — contact form handler |

The navbar links Home/About/Services/Why/Careers use hash anchors (`/#about`, `/#services`, etc.) and are tracked by an `IntersectionObserver`-based scroll-spy that highlights the active section.

## Images

All visuals are WebP for size. The hero, services, and contact backgrounds are loaded via CSS `background-image`. Other visuals use `<img loading="lazy">`. The navbar logo uses `loading="eager"` and `fetchPriority="high"` to paint on first frame.

Source dimensions and weights aim for ≤200 KB per visual. Re-encode with [squoosh.app](https://squoosh.app) at quality 75–80 if you add new images.

## Conventions

- One component per file in `src/components/`
- Inline `<style>` blocks per component — no external CSS modules
- Class names are scoped via component prefix (`hero*`, `about*`, `svc*`, `why*`, `contact*`, `footer*`)
- Color palette: orange `#ff6b4a` and gold `#f7b733` accents on dark navy backgrounds (`#07090f`, `#0a0e1a`, `#0f1320`)
- Component grids use `minmax(0, 1fr)` to prevent overflow from long content

## License

Proprietary. © COSMOS NextGen IT LLC.

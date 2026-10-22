# Visa2Grow website

Marketing site for **Visa2Grow — AI-First Software Development**.
React 19 + TypeScript (strict) + Vite, with build-time prerendering so every
public page ships real HTML, metadata and structured data.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 (client-rendered dev mode)
npm run build        # typecheck → client build → SSR build → prerender
npm run preview      # serve dist/ like a clean-URL static host (port 4180)
npm test             # unit/component tests (Vitest + Testing Library)
npm run test:e2e     # end-to-end tests against dist/ (run `npm run build` first)
npm run brand        # regenerate logo files, favicons and the social image
```

Node 22.12+ is required. Playwright needs Chromium once: `npx playwright install chromium`.

## Environment variables

Copy `.env.example` to `.env`. All values are optional for local work.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical origin (default `https://www.visa2grow.com`; the bare domain forwards to it via GoDaddy). Used in canonical tags, Open Graph, JSON-LD, sitemap and robots.txt. |
| `VITE_CONTACT_ENDPOINT` | Where the form posts. Default `/api/inquiry` (the serverless function). Set to `none` on hosts without serverless functions. |
| `VITE_CONTACT_EMAIL` | Public inbox, default `sales@visa2grow.com`. Shown in the footer, contact page and privacy notice, included in structured data, and used as a pre-filled `mailto:` fallback if submission fails. |
| `VITE_NOINDEX` | Set to `true` on staging/preview deploys: every page gets `noindex` and robots.txt disallows all. |

Every `VITE_*` value is compiled into public JavaScript. **Never put a secret
key in one.**

Server-side only (Vercel environment variables, and `.env.local` for local dev):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Use a **Sending access** key, ideally restricted to the visa2grow.com domain. |
| `INQUIRY_NOTIFICATION_EMAIL` | Inbox that receives inquiries, e.g. `sales@visa2grow.com`. |
| `INQUIRY_FROM_EMAIL` | Verified sender, e.g. `Visa2Grow Website <inquiries@visa2grow.com>`. |
| `SITE_URL` / `INQUIRY_ALLOWED_ORIGINS` | Optional. Origins allowed to POST (production apex + www and Vercel deployment URLs are allowed automatically). |

## Project inquiry emails

```
browser form ──POST /api/inquiry──▶ api/inquiry.ts (Vercel) ──▶ server/inquiry.ts ──▶ Resend ──▶ INQUIRY_NOTIFICATION_EMAIL
```

- `src/lib/inquiry.ts`: fields, options and the validation schema, shared by browser and server.
- `server/inquiry.ts`: the handler. Checks, in order: origin (CORS), method (POST/OPTIONS only), JSON content type,
  16 KB size limit, rate limit, schema validation, spam checks, configuration, then sends.
- `server/inquiry-email.ts`: the HTML email (all visitor input escaped) and its plain-text alternative.
- `api/inquiry.ts`: the Vercel function. The same handler also runs inside `npm run dev` (Vite middleware) and
  `npm run preview`.

What the visitor sees: a spinner while sending, the button disabled against double submits, success **only** after
the server confirms Resend accepted the email, field-level messages if the server rejects input, and a clear
error with a pre-filled email link if delivery fails. Retries reuse the same submission id, which is sent to Resend as
an idempotency key, so a retry can't create a duplicate email.

The email: subject `[Visa2Grow] New Project Inquiry — {service} — {name} (#REF)` (unique per inquiry, plus an `X-Entity-Ref-ID` header, so Gmail and Outlook show each inquiry as a separate email rather than one thread), all fields plus the submission time (UTC and IST),
`Reply-To` set to the visitor's address (so replying goes straight to them) and `From` always the verified
`INQUIRY_FROM_EMAIL`, never the visitor's address.

Spam and abuse: a hidden honeypot field and a minimum fill time (2.5 s). Both are silently accepted and dropped, so bots
learn nothing. There is also a per-IP rate limit (5 per 10 minutes). That limit is in memory, per serverless instance, so it
only slows bursts. For a hard limit, add a **Vercel Firewall rate-limit rule** on `/api/inquiry` (e.g. 5 requests / 10 min
per IP). If spam still gets through, add Cloudflare Turnstile and verify its token in `server/inquiry.ts`.

### Set up Resend (production)

1. In Resend → **Domains**, add `visa2grow.com` and create the DNS records it lists at GoDaddy (DNS → Manage
   Zones → visa2grow.com → Add record). Typically: a `TXT` record at `resend._domainkey` (DKIM), an `MX` and a
   `TXT` record at `send` (bounce handling + SPF for that subdomain), and optionally a `TXT` at `_dmarc`. Copy the
   exact values from Resend. Wait until the domain shows **Verified**.

   These records live on `resend._domainkey` and the `send` subdomain, so they **do not touch** the existing
   Microsoft 365 records (root `MX` → `…mail.protection.outlook.com` and root SPF `v=spf1 include:secureserver.net -all`).
   Don't edit or duplicate those, and don't add a second root SPF record.
2. Create an API key with **Sending access** for that domain.
3. In Vercel → Project → Settings → Environment Variables (Production, and Preview if wanted), set
   `RESEND_API_KEY`, `INQUIRY_NOTIFICATION_EMAIL=sales@visa2grow.com` and
   `INQUIRY_FROM_EMAIL=Visa2Grow Website <inquiries@visa2grow.com>`. Redeploy.
4. Submit a real test inquiry on the live site and confirm it arrives, and that **Reply** goes to the address you
   entered in the form.

Until the domain is verified, Resend only lets the test sender `onboarding@resend.dev` deliver to the email address
that owns the Resend account. That is enough for local testing, not for production.

### Local development

Create `.env.local` (git-ignored) with the three server variables, then `npm run dev`. The Vite dev server serves
`/api/inquiry` with the real handler and sends real emails. `npm run preview` serves the built site with the same
route (it reads variables from the shell environment). The Playwright tests run it with a fake sender, so tests never
send email.

### Monitoring and failures

Failed deliveries are never silently dropped. The visitor sees an error with an email fallback, and the function logs
`[inquiry] notification FAILED; inquiry NOT delivered` with the submission id and Resend's error code, never names,
emails or message text. Watch for that line in Vercel → Logs (or a log drain such as Better Stack / Axiom with an
alert on it). Resend's dashboard shows delivery, bounce and complaint status for every message. To add automatic
retries, put failed submissions on a queue (e.g. Upstash QStash) instead of returning 502.

### Hosting note

The serverless function is Vercel-specific (`api/` directory). On Netlify or Cloudflare Pages, either port
`api/inquiry.ts` to their function format (the handler takes a standard `Request` and returns a `Response`, so it's a
few lines) or set `VITE_CONTACT_ENDPOINT=none`.

## How SEO works here (Vite, no Next.js)

1. `vite build` produces the client bundle; `vite build --ssr` builds
   `src/entry-server.tsx`.
2. `scripts/prerender.mjs` renders every route from `src/app/routes.ts` with
   `renderToString`, injects that route's `<title>`, description, canonical,
   Open Graph/Twitter tags and JSON-LD, and writes `dist/<route>.html`.
3. It also writes `404.html` (noindex), `sitemap.xml` and `robots.txt`, and adds
   `<link rel="modulepreload">` for each route's code-split page chunk.
4. In the browser, `main.tsx` loads the current page's chunk, then hydrates.
   On client-side navigation, `<Seo>` updates the head.

Page metadata lives in `src/data/seo.ts` (static pages) and in each content file
(services, projects, articles). Structured data builders are in `src/lib/jsonld.ts`.
They only emit facts: no ratings, reviews, address or employee counts.

**Adding a page:** create it in `src/pages`, add it to `src/app/routeTable.ts`,
and add its path to `getStaticPaths()` in `src/app/routes.ts` (that list drives
prerendering and the sitemap). The test suite fails if any internal link
points to a route that isn't prerendered.

**Limitations:** pages are static at build time. Content changes need a rebuild
and deploy. Query strings (e.g. `/contact?service=…`) are applied after
hydration; the canonical URL ignores them.

## Deploying

**AWS (S3 + CloudFront + Lambda), with a GitHub Actions pipeline:** see [docs/deploy-aws.md](docs/deploy-aws.md).
In short: `scripts/aws/deploy-infra.sh` once, add the `AWS_DEPLOY_ROLE_ARN` secret in GitHub, then every push to `master`
is tested and deployed by `.github/workflows/deploy-aws.yml`.

Other static hosts:


Build command `npm run build`, output directory `dist`. Files are emitted as
`about.html`, `services/web-development.html` etc., so the host must serve
`/about` from `about.html` ("clean URLs"):

- **Vercel** (recommended; required for the inquiry function): `vercel.json` is included (`cleanUrls`, no trailing slash, caching headers). `api/inquiry.ts` deploys automatically as a serverless function.
- **Netlify**: `netlify.toml` is included; Netlify serves `.html` files at clean URLs and uses `404.html` automatically. `public/_headers` sets caching/security headers.
- **Cloudflare Pages**: works as-is (clean URLs and `404.html` are built in); `_headers` applies.
- **Other static hosts / nginx**: use `try_files $uri $uri.html =404;` and `error_page 404 /404.html;`.

Make sure the host compresses text assets (gzip/brotli). All the hosts above do.
Set `VITE_SITE_URL` (and `VITE_CONTACT_*`) in the host's build environment.

Not done yet (needs your accounts/decisions): domain and DNS, Resend domain
verification, Search Console verification and sitemap submission, and analytics
(none is installed, and the privacy notice says so; update it if you add any).

## Project structure

```
src/
  app/            routing (route table, lazy pages, static path list)
  components/
    brand/        V2G logo (geometry.ts is the single source for every logo file)
    layout/       header, footer, layout
    navigation/   breadcrumbs
    sections/     page sections and cards
    forms/        contact form + field primitives
    illustrations/ decorative product visuals
    ui/           buttons, sections, tags, icon registry
  data/           all copy: services, details, projects, articles, process, SEO
  hooks/          scroll + reveal behaviour
  lib/            SEO head system, JSON-LD, contact submission, site config
  pages/          one component per route
  styles/         Tailwind v4 theme tokens and global styles
scripts/          prerender, preview server, brand asset generator
e2e/              Playwright tests
```

## Content rules (please keep)

Visa2Grow is a new company. The site deliberately contains **no** client logos,
testimonials, project counts, satisfaction rates, awards, certifications or
vendor partnerships. "10+ years" always refers to the founding team's industry
experience, not company age. Portfolio entries are concept studies, labelled
as such. Add `kind: 'client'` projects only with the client's permission and
only measured outcomes in `verifiedOutcomes`. `src/test/seo-and-routes.test.tsx`
fails the build's test run if common fabricated-credibility phrases appear.

## Brand assets

`npm run brand` regenerates, from `src/components/brand/geometry.ts`:
`public/brand/visa2grow-logo{,-dark,-mono,-mono-white}.svg` (wordmark outlined
in Geist, so no font needed), `visa2grow-symbol.svg`, `visa2grow-symbol-512.png`,
`og-image.png` (1200×630), `favicon.svg`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png` and `site.webmanifest`.
Geist is © Vercel, SIL Open Font License (`scripts/brand/fonts/OFL-LICENSE.txt`).

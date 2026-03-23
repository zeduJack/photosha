---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-23'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/research/market-photographer-portfolio-ux-design-research-2026-03-22.md'
workflowType: 'architecture'
project_name: 'photosha'
user_name: 'jack'
date: '2026-03-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements — 37 FRs across 7 capability areas:**

| Area | FRs | Architectural Complexity |
|---|---|---|
| Visual presentation (hero, gallery scroll, lightbox) | FR1–FR3, FR9–FR14 | **High** — native touch physics, SSG image delivery, lightbox state |
| Content pages (About, Impressum, Privacy) | FR4, FR6 | **Low** — static SSG pages |
| Navigation & contact accessibility | FR5, FR20–FR24 | **Medium** — fixed nav, API route, transactional email |
| Spam protection & analytics | FR21, FR25–FR27 | **Medium** — Turnstile server-side verify, Umami goal events |
| Bilingual i18n (DE/EN) | FR16–FR18 | **Medium** — Next.js i18n routing, locale files, full content parity |
| SEO & structured data | FR19, FR28–FR32 | **Medium** — SSG metadata, sitemap, hreflang, JSON-LD |
| Accessibility & reduced motion | FR15, FR33–FR35 | **Medium** — WCAG AA, keyboard nav, prefers-reduced-motion |

**Non-Functional Requirements — 24 NFRs across 5 areas:**

| Area | NFRs | Binding Constraints |
|---|---|---|
| Performance | NFR1–NFR7 | LCP < 1.5s Swiss 4G; CLS < 0.1; FCP < 1.0s; INP < 200ms; JS bundle < 150kb gzip; touch response ≤ 1 frame |
| Security | NFR8–NFR11 | All API keys server-side only; HTTPS only; Turnstile verified server-side; zero data persistence |
| Accessibility | NFR12–NFR16 | Lighthouse ≥ 95; WCAG AA contrast; 44×44px touch targets; full keyboard operation; prefers-reduced-motion |
| Integration reliability | NFR17–NFR22 | 100% Resend delivery; auto-response ≤ 30s; Turnstile graceful degradation; R2 independent of app server; Umami non-blocking |
| Operations | NFR21, NFR23–NFR24 | ≥ 99% uptime; all content pages served from SSG cache; analytics failure must not block loads |

**Gallery Library Decision — PhotoSwipe 5:**

During context analysis, the gallery lightbox library was evaluated. The UX spec originally referenced `@use-gesture/react` + `react-spring`, but both were evaluated against PhotoSwipe 5 (`photoswipe` + `react-photoswipe-gallery`). PhotoSwipe 5 was selected based on proven touch physics (pinch-to-zoom, momentum deceleration, rubber-banding) that match the native-app feel required by NFR7. Trade-off: PhotoSwipe requires preset `width` and `height` per image at build time (used for aspect-ratio layout to satisfy NFR2 / CLS < 0.1). This is addressed by a developer setup task (dimension extraction script), not an epic story.

**Scale & Complexity:**

- Primary domain: Web application (SSG-first, single server boundary)
- Complexity level: **Medium** — no database, no auth, no real-time; complexity concentrated in gallery touch physics and bilingual routing
- Pages: 9 (Home, 5 category galleries, About, Contact, Impressum+Privacy)
- Architectural components estimated: ~15 (NavBar, HeroImage, CategoryCard, GalleryScroll, GalleryLightbox, LanguageSwitcher, ContactForm, TestimonialCard, PricingSignal, FooterBar, AutoResponseEmail, API route, SEO metadata layer, i18n routing, analytics integration)

### Technical Constraints & Dependencies

**Fixed stack (non-negotiable):**
- Next.js 16.2.1 · React 19 · App Router · TypeScript · Tailwind CSS
- Cloudflare R2 image storage + CDN
- CapRover self-hosted deployment (single environment)
- Resend transactional email
- Cloudflare Turnstile spam protection
- Umami analytics (self-hosted on CapRover)
- PhotoSwipe 5 (`photoswipe` + `react-photoswipe-gallery`)

**Zero-persistence architecture:**
- No database of any kind
- No CMS — all content in TypeScript data files and Next.js locale files
- Contact form data transmitted to Sha's email inbox only (NFR11)
- Gallery images sourced from R2 bucket via CDN URLs

**R2 bucket structure (existing bucket: `photosha-photos`):**
```
photos/
  portrait/    0010.jpg, 0020.jpg, …  (step-10 zero-padded filenames)
  wedding/     0010.jpg, 0020.jpg, …  (rename from hochzeit/)
  event/       0010.jpg, 0020.jpg, …
  family/      0010.jpg, 0020.jpg, …  (rename from familie/)
  landscape/   0010.jpg, 0020.jpg, …
```
Canonical URL pattern: `https://images.photosha.ch/photos/{category}/{filename}`

**PhotoSwipe dimension requirement:**
TypeScript data files `src/data/gallery/{category}.ts` must contain `{ src, width, height, alt }` per image. Dimensions populated by a one-time developer setup task (probe-dimensions script) — not an epic story.

**Pre-development setup tasks (before Epic 1):**
1. Re-upload images: rename `hochzeit/` → `wedding/` and `familie/` → `family/` in R2 bucket
2. Run dimension extraction script → generate `src/data/gallery/*.ts` data files

**App Router constraints:**
- All page components are Server Components by default
- Client Components only where interactivity is required (GalleryLightbox, ContactForm, LanguageSwitcher, NavBar scroll behaviour)
- Single server boundary: `POST /api/contact` Route Handler
- All other pages: SSG (`generateStaticParams` for i18n routes)

### Cross-Cutting Concerns Identified

| Concern | Scope | Implication |
|---|---|---|
| Bilingual i18n (DE/EN) | All pages, all components | Every page route has `[locale]` segment; locale files for all copy; `generateStaticParams` produces 2× static pages; `hreflang` on all pages |
| Image delivery performance | Gallery pages, HeroImage | All images via `next/image`; `placeholder="blur"` + `blurDataURL`; explicit `sizes` prop; hero `priority=true`; gallery lazy-loaded; WebP/AVIF served by R2/CDN |
| Performance budget | All pages | JS bundle < 150kb gzip initial; LCP < 1.5s requires SSG + CDN; CLS < 0.1 requires explicit image dimensions (PhotoSwipe data files) |
| Accessibility (WCAG AA) | All components | Lighthouse ≥ 95; focus management in GalleryLightbox (Radix Dialog); keyboard nav; 44×44 touch targets; `prefers-reduced-motion` suppresses all animations |
| SSG/SSR boundary | Architecture-wide | All content pages pre-rendered at build; only `/api/contact` is a live server route; analytics (Umami) loaded client-side, non-blocking |
| Security | API route, env vars | Turnstile token verified server-side on every submission; all API keys (Resend, Turnstile, R2) in server-only env vars; HTTPS enforced |

## Starter Template Evaluation

### Primary Technology Domain

Web application (SSG-first, single server boundary) — established from project requirements analysis.

### Starter: `create-next-app` (already initialized)

The project was bootstrapped using `create-next-app` at commit `d6e3c45`. The stack matches the PRD specification exactly.

**Initialization Command (reference):**

```bash
npx create-next-app@16.2.1 photosha \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

**Architectural Decisions Established by Starter:**

**Language & Runtime:**
TypeScript 5 with strict mode; `@/*` path alias mapped to `./src/*`; `moduleResolution: bundler` (required for App Router); React 19.2.4.

**Styling Solution — Tailwind CSS v4 (deviation from UX spec):**
The starter installed Tailwind CSS **v4** (`tailwindcss: ^4`, `@tailwindcss/postcss: ^4`). Tailwind v4 replaces `tailwind.config.ts` with a CSS-native configuration model:
- Custom tokens defined via `@theme` directive in the main CSS file
- No `tailwind.config.ts` or `tailwind.config.js`
- `@tailwindcss/postcss` replaces the old PostCSS plugin

**Impact on UX spec:** UX-DR1/2/3/23 reference `tailwind.config.ts`. These are re-interpreted as CSS `@theme` configuration in `src/app/globals.css`. Functionality is equivalent — all design tokens, custom spacing scales, and breakpoints are fully implementable. Only the syntax location changes.

**Decision: Keep Tailwind v4** — downgrading to v3 would conflict with the initialized project and lose v4 performance improvements. UX-DR1/2/3/23 are implemented via CSS-based `@theme` configuration, not `tailwind.config.ts`.

**Build Tooling:**
Next.js 16.2.1 with Turbopack (dev) + SWC (build). `next.config.ts` is TypeScript-native. App Router only — Pages Router not initialized.

**Linting:**
ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next` 16.2.1.

**Code Organization:**
`src/` directory convention. App Router file-system routing under `src/app/`. `@/*` import alias for all internal modules.

**Development Experience:**
`next dev` (Turbopack), `next build` (SWC), `next start`. TypeScript incremental compilation.

### Additional Packages Required

| Package | Purpose |
|---|---|
| `photoswipe` | Gallery lightbox core (v5) |
| `react-photoswipe-gallery` | React wrapper for PhotoSwipe 5 |
| `@radix-ui/react-dialog` | Focus trap for lightbox (accessibility) |
| `@radix-ui/react-select` | Session type dropdown in contact form |
| `react-hook-form` | Contact form state management |
| `resend` | Transactional email (server-side only) |
| `react-email` | Auto-response email template |
| `@marsidev/react-turnstile` | Cloudflare Turnstile widget |
| `next-intl` | i18n routing + locale messages |

**Note:** Project initialization is complete. The first implementation epic begins from this initialized state. Additional packages are installed as part of their respective implementation epics.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (block implementation):**
- i18n routing + library selection → `next-intl` with App Router `[locale]` segment
- Gallery library → PhotoSwipe 5 (`photoswipe` + `react-photoswipe-gallery`)
- SSG/SSR boundary → all pages SSG, only `POST /api/contact` is live server route
- Tailwind v4 CSS-based token configuration (deviation from UX spec's `tailwind.config.ts`)

**Important (shape architecture):**
- Content model → TypeScript data files, no CMS, no database
- Client Component boundary → NavBar, GalleryLightbox, ContactForm, LanguageSwitcher
- Environment variable strategy → server-only via CapRover env, `.env.local` for dev

**Deferred (post-MVP):**
- Automated testing framework → TypeScript + ESLint sufficient for MVP
- CI/CD pipeline → manual CapRover deploy for MVP
- Error monitoring → CapRover logs sufficient for MVP

---

### Data Architecture

**No database. No CMS. Zero-persistence.**

- Gallery image data: TypeScript data files `src/data/gallery/{category}.ts`
  — `{ src: string, width: number, height: number, alt: string }[]`
  — `src` is a full CDN URL: `https://images.photosha.ch/photos/{category}/{filename}`
  — Populated once by dimension extraction setup task; updated manually when new images added
- Testimonials: TypeScript data files `src/data/testimonials/{category}.ts`
- Pricing signals: TypeScript constants `src/data/pricing.ts`
- i18n copy: locale JSON files `messages/de.json` + `messages/en.json` via `next-intl`
- Contact form data: transmitted to Sha's inbox via Resend; stored nowhere

**Rationale:** NFR11 (no data storage), FR36 (image updates without code changes), FR37 (copy updates without component changes). TypeScript data files satisfy FR36/37 while remaining type-safe and CMS-free.

---

### Authentication & Security

**No user authentication** — no login, no sessions, no cookies, no auth middleware.

- **Spam protection:** Cloudflare Turnstile — client-side widget (`@marsidev/react-turnstile`) renders challenge; token submitted with form; `POST /api/contact` verifies token server-side against Turnstile secret before processing (NFR10)
- **Secret management:** All API keys (Resend API key, Turnstile secret key, R2 credentials) stored as server-only environment variables. Never referenced in Client Components or exported from `src/` modules without `server-only` guard (NFR8)
- **Transport:** HTTPS enforced at Cloudflare/CapRover ingress level (NFR9)
- **Contact form data:** Transmitted directly to Sha's inbox via Resend; not stored in any database, log, or variable beyond the request lifecycle (NFR11)
- **Analytics:** Umami is cookieless; no GDPR consent banner required

---

### API & Communication Patterns

**Single server endpoint: `POST /api/contact`**

- Route Handler at `src/app/api/contact/route.ts`
- Request body: `{ name, email, sessionType, approximateDate?, message, turnstileToken }`
- Server actions: not used (Route Handler preferred for explicit HTTP boundary + Turnstile verification clarity)
- Processing sequence:
  1. Parse and validate request body
  2. Verify Turnstile token server-side (Cloudflare API)
  3. Send notification email to Sha via Resend
  4. Send auto-response email to visitor via Resend (React Email template)
  5. Return `{ success: true }` or `{ error: string }`
- Error handling: inline form feedback only — no toast notifications (UX-DR19)
  — Success: form replaced with confirmation message
  — Failure: inline error above submit button + Sha's direct email as fallback
- No rate limiting beyond Turnstile for MVP (NFR21 volume doesn't require it)
- Resend delivery failure: surfaced as error response; visitor sees fallback email (NFR17)

---

### Frontend Architecture

**React Server Components for all pages. Client Components only where interactivity is required.**

| Component | Type | Reason |
|---|---|---|
| All page layouts | Server Component | SSG, no interactivity |
| NavBar | Client Component | Scroll-triggered backdrop blur |
| GalleryLightbox | Client Component | PhotoSwipe touch events |
| ContactForm | Client Component | React Hook Form + Turnstile |
| LanguageSwitcher | Client Component | Locale switching without reload |
| All others | Server Component | Static render only |

**i18n:** `next-intl` with `[locale]` dynamic segment in `src/app/[locale]/`.
- Supported locales: `de` (default), `en`
- Locale detection: Next.js middleware (`src/middleware.ts`) redirects `/` → `/de`
- `generateStaticParams` produces 2× static pages for all routes
- `useTranslations` hook in Client Components; `getTranslations` in Server Components
- `hreflang` links on all pages via `next-intl` `alternates`

**State management:** No global state library. Component-local state only.
- Gallery lightbox state: managed by `react-photoswipe-gallery` internally
- Contact form state: React Hook Form
- Locale: `next-intl` routing (URL-based, persisted via `[locale]` segment)

**Performance strategy:**
- All content pages: SSG via `generateStaticParams` (NFR3, NFR23)
- Images: `next/image` with `placeholder="blur"` + explicit `sizes` + descriptive `alt` (UX-DR18)
- Hero: `priority={true}` (NFR1)
- Gallery: lazy-loaded (UX-DR7)
- JS bundle: Server Components reduce client bundle; PhotoSwipe + React Hook Form are the largest client dependencies — target < 150kb gzip (NFR5)
- `prefers-reduced-motion`: all animations suppressed via CSS media query (NFR16, UX-DR22)

---

### Infrastructure & Deployment

**CapRover — self-hosted, Docker-based, single environment.**

- Hosting: CapRover on self-hosted VPS
- Domain: `photosha.ch` (main site), `images.photosha.ch` (R2 CDN custom domain)
- Environment variables: `.env.local` for development; CapRover app environment variables for production (Resend key, Turnstile keys, R2 config)
- Deploy: manual via `caprover deploy` CLI or CapRover dashboard webhook
- Image delivery: Cloudflare R2 (`photosha-photos` bucket) + CDN — independent of app server (NFR20); images served from cache even during app restarts
- Analytics: Umami self-hosted on CapRover (separate app instance)
- Uptime: CapRover health checks + Cloudflare proxy (NFR21)
- CI/CD: none for MVP — manual deploy on release
- Error monitoring: CapRover container logs for MVP

### Decision Impact Analysis

**Implementation Sequence:**
1. Project configuration (Tailwind v4 tokens, next-intl routing, `next.config.ts` for R2 domain)
2. Design system (tokens, type scale, spacing) → enables all visual components
3. Layout components (NavBar, FooterBar) → required by all pages
4. Home page (HeroImage, CategoryCard grid) → first visible milestone
5. Gallery category pages (GalleryScroll, GalleryLightbox) → highest complexity
6. Contact page (ContactForm, Turnstile, Resend, React Email)
7. Content pages (About, Impressum, Privacy)
8. SEO layer (metadata, sitemap, structured data, hreflang)
9. Analytics integration (Umami + goal event)

**Cross-Component Dependencies:**
- `next-intl` routing must be set up before any page components (all pages consume translations)
- Tailwind v4 `@theme` tokens must be defined before any visual component
- `src/data/gallery/*.ts` dimension files must exist before GalleryScroll/GalleryLightbox
- `POST /api/contact` depends on Resend + Turnstile env vars being set

## Implementation Patterns & Consistency Rules

### Naming Patterns

**File & Directory Naming — kebab-case for all files:**
- Components: `gallery-lightbox.tsx`, `nav-bar.tsx`, `contact-form.tsx`
- Pages: `src/app/[locale]/page.tsx`, `src/app/[locale]/wedding/page.tsx`
- Data files: `src/data/gallery/portrait.ts`, `src/data/testimonials/wedding.ts`
- Utilities: `src/lib/turnstile.ts`, `src/lib/email.ts`
- Types: `src/types/gallery.ts`, `src/types/contact.ts`

**Component Naming — PascalCase exports, kebab-case files:**
```tsx
// File: src/components/gallery-lightbox.tsx
export function GalleryLightbox({ ... }) { ... }

// File: src/components/nav-bar.tsx
export function NavBar({ ... }) { ... }
```

**Function & Variable Naming — camelCase:**
```ts
const galleryImages = await getGalleryData('portrait')
function buildImageUrl(category: string, filename: string): string
```

**i18n Translation Key Naming — dot-notation, section.key:**
```json
{
  "nav.contact": "Kontakt",
  "home.hero.name": "Sha",
  "gallery.portrait.title": "Portrait",
  "contact.form.name.label": "Name",
  "contact.form.submit.sending": "Senden…"
}
```
Keys always mirror the component/page hierarchy. Never use flat keys like `"contactName"`.

**Category Identifiers — English lowercase, matches R2 folder name:**
Valid values: `portrait` | `wedding` | `event` | `family` | `landscape`
Used in: URL segments, data file names, R2 paths, TypeScript union types.

---

### Structure Patterns

**`src/` Directory Layout:**
```
src/
  app/
    [locale]/
      page.tsx              ← home page
      portrait/page.tsx
      wedding/page.tsx
      event/page.tsx
      family/page.tsx
      landscape/page.tsx
      about/page.tsx
      contact/page.tsx
      impressum/page.tsx
    api/
      contact/route.ts      ← ONLY server route handler
    globals.css             ← Tailwind v4 @theme tokens
    layout.tsx              ← root layout
  components/
    nav-bar.tsx
    hero-image.tsx
    category-card.tsx
    gallery-scroll.tsx
    gallery-lightbox.tsx
    language-switcher.tsx
    contact-form.tsx
    testimonial-card.tsx
    pricing-signal.tsx
    footer-bar.tsx
  data/
    gallery/
      portrait.ts
      wedding.ts
      event.ts
      family.ts
      landscape.ts
    testimonials/
      portrait.ts
      wedding.ts
      event.ts
      family.ts
    pricing.ts
  emails/
    auto-response.tsx       ← React Email template
  lib/
    turnstile.ts            ← server-side Turnstile verification
    email.ts                ← Resend send helpers
  types/
    gallery.ts
    contact.ts
  middleware.ts             ← next-intl locale detection
messages/
  de.json
  en.json
```

**No `pages/` directory.** App Router only. Never create `src/pages/`.

**Component co-location:** All shared components in `src/components/`. No page-specific component subdirectories for MVP.

---

### Format Patterns

**TypeScript Gallery Data Shape (mandatory structure):**
```ts
// src/data/gallery/portrait.ts
import type { GalleryImage } from '@/types/gallery'

export const portraitImages: GalleryImage[] = [
  {
    src: 'https://images.photosha.ch/photos/portrait/0010.jpg',
    width: 4000,
    height: 6000,
    alt: 'Portrait of a woman in warm light, Zürich studio',
  },
]
```
Every entry MUST have all four fields. `alt` must be descriptive (FR34). Never use empty `alt=""` on gallery images.

**API Response Shape — `POST /api/contact`:**
```ts
// Success
{ success: true }

// Failure
{ success: false, error: 'turnstile_failed' | 'send_failed' | 'invalid_input' }
```
No nested `data` wrapper. Never return user-submitted data in the response.

**TypeScript Union for Category:**
```ts
// src/types/gallery.ts
export type GalleryCategory = 'portrait' | 'wedding' | 'event' | 'family' | 'landscape'
```
Never use plain `string` where `GalleryCategory` is appropriate.

---

### Component Patterns

**`'use client'` directive — placement rules:**
- Only add `'use client'` to the specific component that requires it
- Never add `'use client'` to a page or layout that only renders Server Components

**`'use client'` required for:** NavBar, GalleryLightbox, ContactForm, LanguageSwitcher

**`'use client'` MUST NOT appear on:** page.tsx files, layout.tsx, GalleryScroll, HeroImage, CategoryCard, TestimonialCard, PricingSignal, FooterBar

**Props pattern — explicit interfaces, no inline types:**
```tsx
// ✅ Correct
interface GalleryScrollProps {
  images: GalleryImage[]
  category: GalleryCategory
}
export function GalleryScroll({ images, category }: GalleryScrollProps) { ... }
```

**Image pattern — `next/image` always, never raw `<img>`:**
```tsx
import Image from 'next/image'
<Image
  src={image.src}
  width={image.width}
  height={image.height}
  alt={image.alt}
  sizes="100vw"
  placeholder="blur"
  blurDataURL="..."
/>
```

---

### Process Patterns

**Error Handling:**
- `POST /api/contact` errors: return `{ success: false, error: string }`, let ContactForm render inline message
- Server-side errors: log with `console.error` server-side, return structured error to client
- Always `try/catch` in Route Handlers — never throw unhandled exceptions

**Loading State — ContactForm only:**
Button shows spinner + "Sending…" + disabled during submission (UX-DR19). No loading indicators elsewhere — all pages are SSG.

**No toast notifications anywhere.** Success and error states are always inline (UX-DR19). Never import a toast library.

**`prefers-reduced-motion` — always via CSS, never JS:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
PhotoSwipe reduced-motion: pass `reduceMotion: true` when media query matches.

---

### Enforcement Guidelines

**All AI agents MUST:**
- Use kebab-case for file names, PascalCase for component exports
- Import gallery data from `@/data/gallery/{category}`, never hardcode image URLs inline
- Use `GalleryImage` and `GalleryCategory` types from `@/types/gallery`
- Add `'use client'` only to the four designated Client Components
- Use `next/image` for every image — no raw `<img>` tags
- Use `useTranslations` / `getTranslations` for all visible copy — no hardcoded strings
- Follow `{ success: boolean, error?: string }` response shape for `POST /api/contact`
- Handle form errors inline — no toasts

**Anti-patterns to avoid:**
- `<img>` instead of `<Image>` from `next/image`
- Hardcoded copy strings in component JSX (all copy via `next-intl`)
- `'use client'` on page.tsx or layout.tsx files
- Category identifiers in German (`hochzeit`, `familie`) — English only
- Flat i18n keys (`"contactName"`) instead of dot-notation (`"contact.form.name.label"`)
- Empty `alt=""` on gallery images

## Project Structure & Boundaries

### Complete Project Directory Structure

```
photosha/
├── .env.local                        ← dev secrets (gitignored)
├── .env.example                      ← committed template with key names
├── .gitignore
├── .caproverapp                      ← CapRover deploy config
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── package.json
├── Dockerfile                        ← CapRover container build
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml                   ← generated at build
├── messages/
│   ├── de.json                       ← German locale (default)
│   └── en.json                       ← English locale
└── src/
    ├── middleware.ts                  ← next-intl locale detection + redirect
    ├── app/
    │   ├── layout.tsx                ← root layout (html, body, font links)
    │   ├── globals.css               ← Tailwind v4 @theme tokens + base styles
    │   ├── [locale]/
    │   │   ├── layout.tsx            ← locale layout (NavBar, FooterBar, next-intl provider)
    │   │   ├── page.tsx              ← home page (HeroImage + CategoryCard grid)
    │   │   ├── portrait/
    │   │   │   └── page.tsx          ← gallery + pricing + testimonial + CTA
    │   │   ├── wedding/
    │   │   │   └── page.tsx
    │   │   ├── event/
    │   │   │   └── page.tsx
    │   │   ├── family/
    │   │   │   └── page.tsx
    │   │   ├── landscape/
    │   │   │   └── page.tsx
    │   │   ├── about/
    │   │   │   └── page.tsx
    │   │   ├── contact/
    │   │   │   └── page.tsx
    │   │   └── impressum/
    │   │       └── page.tsx          ← Impressum + Privacy Policy combined
    │   └── api/
    │       └── contact/
    │           └── route.ts          ← POST /api/contact (Turnstile + Resend)
    ├── components/
    │   ├── nav-bar.tsx               ← 'use client' — scroll blur, locale links
    │   ├── hero-image.tsx            ← Server Component — next/image priority
    │   ├── category-card.tsx         ← Server Component — link + image overlay
    │   ├── gallery-scroll.tsx        ← Server Component — vertical image stack
    │   ├── gallery-lightbox.tsx      ← 'use client' — PhotoSwipe 5 wrapper
    │   ├── language-switcher.tsx     ← 'use client' — locale toggle
    │   ├── contact-form.tsx          ← 'use client' — RHF + Turnstile
    │   ├── testimonial-card.tsx      ← Server Component — quote + attribution
    │   ├── pricing-signal.tsx        ← Server Component — "From CHF X" text
    │   └── footer-bar.tsx            ← Server Component — copyright + links
    ├── data/
    │   ├── gallery/
    │   │   ├── portrait.ts           ← GalleryImage[] with src/width/height/alt
    │   │   ├── wedding.ts
    │   │   ├── event.ts
    │   │   ├── family.ts
    │   │   └── landscape.ts
    │   ├── testimonials/
    │   │   ├── portrait.ts           ← Testimonial[] for Portrait page
    │   │   ├── wedding.ts
    │   │   ├── event.ts
    │   │   └── family.ts
    │   └── pricing.ts                ← { portrait: 350, wedding: 2800, ... }
    ├── emails/
    │   └── auto-response.tsx         ← React Email template
    ├── lib/
    │   ├── turnstile.ts              ← verifyTurnstileToken(token): Promise<boolean>
    │   └── email.ts                  ← sendNotification(), sendAutoResponse()
    └── types/
        ├── gallery.ts                ← GalleryImage, GalleryCategory
        └── contact.ts                ← ContactFormData, ContactApiResponse
```

---

### Architectural Boundaries

**API Boundary — single server crossing:**

```
Browser (Client)          │  Next.js Server (CapRover)    │  External Services
──────────────────────────┼───────────────────────────────┼──────────────────────
ContactForm.tsx           │  POST /api/contact/route.ts   │  Cloudflare Turnstile
  └─ fetch('/api/contact')│    ├─ verifyTurnstile()       │  Resend API
     └─ { turnstileToken  │    ├─ sendNotification()      │  (Sha's inbox)
          name, email...} │    └─ sendAutoResponse()      │  (visitor's inbox)
```

All other pages: no server crossing — pre-rendered HTML + CDN images.

**Component Boundary — Server vs. Client:**

```
src/app/[locale]/portrait/page.tsx   ← Server Component (SSG)
  ├── <NavBar />                      ← 'use client' boundary
  ├── <GalleryScroll images={...} />  ← Server Component, receives data as props
  │     └── <GalleryLightbox />       ← 'use client' boundary (PhotoSwipe)
  ├── <PricingSignal />               ← Server Component
  ├── <TestimonialCard />             ← Server Component
  └── <FooterBar />                   ← Server Component
```

**Data Boundary — build time vs. runtime:**

```
Build time (SSG):
  src/data/gallery/*.ts  ──────────────────→  GalleryScroll, GalleryLightbox props
  src/data/testimonials/*.ts  ─────────────→  TestimonialCard props
  src/data/pricing.ts  ────────────────────→  PricingSignal props
  messages/de.json, en.json  ─────────────→  All page copy via next-intl

Runtime (POST only):
  ContactForm  →  POST /api/contact  →  Resend  →  Sha's inbox
```

---

### Requirements to Structure Mapping

| FR Category | Location |
|---|---|
| FR1 — Hero image | `hero-image.tsx` + home `page.tsx` |
| FR2–FR3 — Gallery categories | `category-card.tsx` + `[locale]/*/page.tsx` + `src/data/gallery/` |
| FR4 — About page | `[locale]/about/page.tsx` |
| FR5 — Contact access | `nav-bar.tsx` (persistent link) |
| FR6 — Impressum/Privacy | `[locale]/impressum/page.tsx` |
| FR7 — Pricing signals | `pricing-signal.tsx` + `src/data/pricing.ts` |
| FR8 — Testimonials | `testimonial-card.tsx` + `src/data/testimonials/` |
| FR9–FR14 — Lightbox + touch | `gallery-lightbox.tsx` (PhotoSwipe 5) |
| FR15 — Reduced motion | `globals.css` CSS media query |
| FR16–FR18 — Bilingual DE/EN | `messages/*.json` + `next-intl` + `[locale]` routing |
| FR19 — SEO hreflang | `next-intl` `alternates` in page metadata |
| FR20–FR24 — Contact form + email | `contact-form.tsx` + `api/contact/route.ts` + `emails/auto-response.tsx` |
| FR21 — Turnstile spam protection | `contact-form.tsx` (widget) + `lib/turnstile.ts` (server verify) |
| FR25–FR27 — Analytics + goals | Umami script in `[locale]/layout.tsx` |
| FR28–FR32 — SEO metadata | `generateMetadata()` in each `page.tsx` + `public/sitemap.xml` |
| FR33–FR35 — Accessibility | All components (ARIA labels, keyboard nav) |
| FR36 — Image updates | `src/data/gallery/*.ts` (edit + redeploy) |
| FR37 — Copy updates | `messages/de.json` + `messages/en.json` |

---

### Integration Points

**External service integrations:**

| Service | Integration Point | Direction | Secret Location |
|---|---|---|---|
| Cloudflare R2 | CDN URLs in `src/data/gallery/*.ts` | Read (build time) | None (public CDN) |
| Cloudflare Turnstile | `contact-form.tsx` widget + `lib/turnstile.ts` verify | Client → CF → Server | `TURNSTILE_SECRET_KEY` (server env) |
| Resend API | `lib/email.ts` | Server → Resend | `RESEND_API_KEY` (server env) |
| Umami Analytics | Script tag in `[locale]/layout.tsx` | Client → Umami server | `NEXT_PUBLIC_UMAMI_*` (public env) |
| Google Fonts | `<link>` in root `layout.tsx` | Client → Google | None |

**Data flow — contact form submission:**
```
1. Visitor fills form  →  ContactForm validates (RHF)
2. Turnstile widget runs challenge  →  returns token
3. ContactForm POSTs { fields + token }  →  /api/contact
4. route.ts verifies token  →  Cloudflare Turnstile API
5. route.ts sends notification  →  Resend  →  Sha's inbox
6. route.ts sends auto-response  →  Resend  →  visitor's inbox
7. route.ts returns { success: true }
8. ContactForm replaces form with success message
9. ContactForm fires Umami goal event
```

**Data flow — gallery page load:**
```
1. Build time: next build reads src/data/gallery/portrait.ts
2. generateStaticParams produces /de/portrait + /en/portrait
3. Page pre-rendered as HTML with image dimensions baked in
4. CDN serves pre-rendered HTML (no app server involved)
5. Browser requests images from images.photosha.ch (R2 CDN)
6. Visitor taps image → GalleryLightbox hydrates (PhotoSwipe 5)
```

---

### Environment Configuration

**`.env.example` (committed):**
```bash
# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@photosha.ch
SHA_EMAIL=sha@photosha.ch

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=...           # public — used in contact-form.tsx
TURNSTILE_SECRET_KEY=...         # server-only — used in api/contact/route.ts

# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
NEXT_PUBLIC_UMAMI_URL=https://analytics.photosha.ch

# Image CDN
NEXT_PUBLIC_IMAGE_CDN=https://images.photosha.ch
```

`NEXT_PUBLIC_` prefix = safe for client bundle. All others are server-only.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices are compatible. Next.js 16.2.1 + React 19 + TypeScript + Tailwind v4 + next-intl + PhotoSwipe 5 + Radix UI + React Hook Form all support React 19 and App Router. No version conflicts identified.

**Pattern Consistency:** Naming conventions (kebab-case files, PascalCase exports, dot-notation i18n keys), component boundaries ('use client' on 4 components only), and data patterns (TypeScript data files → Server Component props) are consistently applied across all decisions.

**Structure Alignment:** Directory structure directly maps to architectural decisions. Each component has a single owner file. API boundary is exactly one route handler.

### Issues Resolved During Validation

**Issue 1 — NFR6 image format gap in lightbox:**
GalleryScroll uses `next/image` (WebP/AVIF auto). GalleryLightbox (PhotoSwipe) uses raw CDN URLs — would serve original JPEG. NFR6 requires modern formats for all gallery images.
**Resolution:** All images uploaded to R2 as WebP (converted from source JPEG before upload). Added to pre-development setup tasks alongside dimension extraction.

**Issue 2 — blurDataURL source not defined:**
UX-DR18 requires `placeholder="blur"` + `blurDataURL` on all images. The GalleryImage type was missing `blurDataURL`.
**Resolution:** `GalleryImage` type updated to `{ src, width, height, alt, blurDataURL }`. The dimension extraction setup script generates all five fields: probe dimensions + generate 10px base64 blur placeholder per image.

**Issue 3 — sitemap.xml strategy:**
`public/sitemap.xml` (static) would require manual updates when pages change.
**Resolution:** Implemented as `src/app/sitemap.ts` (Next.js App Router built-in dynamic sitemap). Generates all `[locale]` URL variants automatically. No `public/sitemap.xml` file needed.

### Requirements Coverage Validation ✅

All 37 FRs and 24 NFRs are architecturally supported. Complete mapping in Project Structure section above.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (37 FRs, 24 NFRs, 23 UX-DRs)
- [x] Scale and complexity assessed (medium — gallery touch physics + i18n)
- [x] Technical constraints identified (fixed stack, zero-persistence, PhotoSwipe dimensions)
- [x] Cross-cutting concerns mapped (i18n, image delivery, performance, accessibility, SSG/SSR)

**✅ Architectural Decisions**
- [x] Critical decisions documented (PhotoSwipe 5, next-intl, Tailwind v4, SSG boundary)
- [x] Technology stack fully specified with all additional packages listed
- [x] Integration patterns defined (Turnstile, Resend, Umami, R2)
- [x] Security model documented (server-only secrets, Turnstile server-side, HTTPS)

**✅ Implementation Patterns**
- [x] Naming conventions established (kebab-case files, PascalCase exports, dot-notation i18n)
- [x] Structure patterns defined (src/ layout, no pages/)
- [x] `'use client'` boundary rules specified (4 components only)
- [x] Process patterns documented (error handling, loading states, no toasts)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established (Server vs. Client Component per component)
- [x] Integration points mapped (API boundary, external services, data flow)
- [x] All 37 FRs mapped to specific files/components

### Pre-Development Setup Tasks (before Epic 1)

These are developer tasks, not implementation stories:

1. **R2 image preparation:** Convert all source JPEG images to WebP. Re-upload to `photosha-photos` bucket with English folder names (`wedding/` not `hochzeit/`, `family/` not `familie/`).
2. **Dimension + blur extraction script:** Run script to probe all R2 images → output `src/data/gallery/*.ts` files with `{ src, width, height, alt, blurDataURL }` per image. Filenames in step-10 format (`0010.webp`, `0020.webp`, …).

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence Level: High** — all decisions are specific, all requirements are covered, all patterns are actionable with concrete examples and anti-patterns.

**Key Strengths:**
- Zero-persistence architecture eliminates entire complexity classes (no DB, no auth, no CMS)
- PhotoSwipe 5 handles the highest-complexity requirement (touch physics) as a proven library
- SSG-first approach means the live server is only ever touched for contact form POST
- Tailwind v4 + next-intl + TypeScript data files provide a consistent, type-safe content layer

**Areas for Future Enhancement (post-MVP):**
- Automated test suite (Playwright for E2E accessibility + form testing)
- CI/CD pipeline (GitHub Actions → CapRover deploy webhook)
- Cloudflare Image Resizing for on-the-fly format/size optimization (if traffic grows)
- Blog/journal section (requires CMS or MDX setup — currently out of scope)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently — refer to naming and structure rules before creating any file
- Respect `'use client'` boundary — only NavBar, GalleryLightbox, ContactForm, LanguageSwitcher
- All visible copy goes through `next-intl` `useTranslations` / `getTranslations` — never hardcoded
- All images via `next/image` with explicit dimensions from `src/data/gallery/*.ts` — never raw `<img>`

**First Implementation Priority:**
Project is initialized. Pre-development setup tasks must be completed first (R2 WebP re-upload + dimension extraction script). Then: Epic 1 — project configuration (Tailwind tokens, next-intl routing, next.config.ts).

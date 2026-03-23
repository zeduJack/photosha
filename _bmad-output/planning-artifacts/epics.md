---
stepsCompleted: [1, 2, 3, 4]
lastStep: 4
status: 'complete'
completedAt: '2026-03-23'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# photosha - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for photosha, decomposing the requirements from the PRD, UX Design Specification, and Architecture (pending) into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can view a full-bleed hero image that fills the viewport on first load of the home page
FR2: Visitors can navigate to five photography category galleries (Portrait, Wedding, Event, Family, Landscape) from the home page
FR3: Visitors can view a curated set of images within each gallery category
FR4: Visitors can access the About page to read about Sha's background, personality, and approach to photography
FR5: Visitors can access the Contact page from any page on the site without scrolling
FR6: Visitors can read the Impressum and Privacy Policy pages
FR7: Visitors can see a starting price signal on Portrait, Wedding, Family, and Event category pages before reaching the contact form
FR8: Visitors can read attributed testimonials from past clients on gallery category pages
FR9: Visitors can open a full-screen view of any gallery image from the category grid
FR10: Visitors can pinch to zoom into a full-screen gallery image on a touch device
FR11: Gallery zoom momentum decelerates naturally after a pinch gesture is released
FR12: Gallery zoom rubber-bands at the image limits and returns to a bounded state on release
FR13: Visitors can swipe between gallery images while in full-screen view, with swipe velocity preserved across the transition
FR14: Visitors can dismiss the full-screen gallery view and return to the category grid
FR15: Visitors who prefer reduced motion can browse the gallery without animated transitions
FR16: Visitors can switch the site language between German and English
FR17: Language selection persists across page navigation without requiring re-selection
FR18: All content pages are available with full content parity in both German and English
FR19: Search engines can discover and index both language versions of each page as distinct documents
FR20: Visitors can submit a contact inquiry via a form providing their name, email address, session type, approximate date, and a message
FR21: The contact form rejects automated spam submissions before they reach the email delivery system
FR22: Submitted contact inquiries are delivered to Sha's email inbox
FR23: Visitors receive an automatic acknowledgement email after submitting a contact inquiry
FR24: Visitors receive a clear success confirmation on the page after submitting the contact form
FR25: Each successful contact form submission is recorded as a discrete goal event in the analytics system
FR26: The analytics system captures session-level data including traffic source, pages visited, and time on page, without collecting or storing personal visitor data
FR27: The developer can access analytics data (session counts, goal completions, traffic sources, bounce rates) via a self-hosted dashboard
FR28: Each page is accessible to search engine crawlers and renders complete content without requiring JavaScript execution
FR29: Each page exposes a unique title, description, and preview image for search engine results and social sharing
FR30: The site exposes structured data identifying Sha as a local business photographer in the Greater Zürich region
FR31: The site publishes a sitemap covering all pages in both language variants for search engine indexing
FR32: Canonical URLs and language relationship declarations are present on all pages
FR33: All interactive elements on the site are operable via keyboard navigation alone
FR34: All gallery images expose a descriptive text alternative for screen readers
FR35: All contact form fields are programmatically associated with their visible labels and any error messages
FR36: The developer can add images to a gallery category by uploading files to cloud storage and updating a data file, without modifying page or component code
FR37: The developer can update all visitor-facing copy in both languages by editing locale files, without modifying component code

### NonFunctional Requirements

NFR1: The Largest Contentful Paint (LCP) for the hero image on the home page must be less than 1.5 seconds on a simulated Swiss 4G connection, measured by Lighthouse
NFR2: The Cumulative Layout Shift (CLS) score across all pages must be less than 0.1, measured by Lighthouse
NFR3: The First Contentful Paint (FCP) must be less than 1.0 second on all static pages, achieved through SSG pre-rendering
NFR4: The Interaction to Next Paint (INP) must be less than 200 milliseconds for all interactive elements
NFR5: The initial JavaScript bundle size delivered to the client must not exceed 150kb gzip
NFR6: Gallery images must be served in modern formats (WebP or AVIF) with responsive sizes appropriate to the requesting device's viewport
NFR7: Gallery touch gesture response (pinch, swipe) must begin within one animation frame of the gesture starting — no perceptible lag between touch input and visual response
NFR8: All API keys (Resend, Turnstile, R2) must be stored as server-side environment variables and must never be exposed to the client browser
NFR9: Contact form submissions must be transmitted over HTTPS — no plaintext transport of visitor data
NFR10: The Cloudflare Turnstile token must be verified server-side on every form submission — client-side validation alone is not sufficient
NFR11: Contact form data must not be stored in any database or log file — it is transmitted to Sha's email inbox and exists nowhere else in the system
NFR12: The Lighthouse accessibility score must be ≥ 95 on all pages
NFR13: All colour combinations of text on background must meet WCAG 2.1 AA contrast ratios: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components
NFR14: All touch targets must be at minimum 44×44 CSS pixels
NFR15: The site must be fully operable without a pointer device — all interactions must be achievable via keyboard alone
NFR16: Gallery animations and physics must be suppressed for users with the `prefers-reduced-motion: reduce` media feature active
NFR17: Contact form submissions must be delivered to Sha's inbox with 100% success rate under normal operating conditions — Resend delivery failures must not silently discard submissions
NFR18: The auto-response email must arrive in the visitor's inbox within 30 seconds of form submission under normal operating conditions
NFR19: Cloudflare Turnstile widget must degrade gracefully if the third-party script fails to load — the form must remain submittable with server-side fallback handling
NFR20: Image delivery from Cloudflare R2 must function independently of the CapRover application server — if the application is restarting, previously cached images remain available via CDN
NFR21: The site must target ≥ 99% uptime, measured monthly — acceptable downtime is planned maintenance only
NFR22: The Umami analytics goal event for form submission must fire on every successful submission from day one of launch — analytics data gaps are not acceptable for the primary KPI
NFR23: All SSG-rendered pages must be served from cache — no page should require a live application server response for a standard gallery or content page load
NFR24: The site must remain functional if the Umami analytics server is unreachable — analytics failure must not block page loads or form submissions

### Additional Requirements

_Derived from architecture.md (completed 2026-03-23)._

**AR1:** Tailwind CSS v4 is installed. All design tokens (colours, type scale, spacing) are configured via `@theme` directive in `src/app/globals.css` — not `tailwind.config.ts` (which does not exist in v4). UX-DR1/2/3/23 are implemented using CSS-based config.

**AR2:** Gallery library is PhotoSwipe 5 (`photoswipe` + `react-photoswipe-gallery`). Every gallery image requires preset `width` and `height` at build time (required by PhotoSwipe for layout + CLS prevention).

**AR3:** `GalleryImage` TypeScript type is `{ src: string, width: number, height: number, alt: string, blurDataURL: string }`. The `blurDataURL` field is required for `next/image` `placeholder="blur"` (UX-DR18).

**AR4:** Gallery image data files (`src/data/gallery/{category}.ts`) must be populated before any gallery component can be implemented. These are generated by a pre-development setup script (developer task, not a story).

**AR5:** i18n is handled by `next-intl`. All pages live under `src/app/[locale]/`. Locale detection via `src/middleware.ts`. `generateStaticParams` produces `/de/*` + `/en/*` variants for all routes.

**AR6:** SSG-first architecture. All pages are Server Components pre-rendered at build time. The only runtime server route is `POST /api/contact` at `src/app/api/contact/route.ts`.

**AR7:** `'use client'` directive is restricted to four components only: NavBar, GalleryLightbox, ContactForm, LanguageSwitcher. All other components are Server Components.

**AR8:** All API keys (Resend, Turnstile, R2) must be stored as server-only environment variables. `NEXT_PUBLIC_` prefix is used only for Umami script IDs and Image CDN base URL.

**AR9:** Sitemap is generated dynamically via `src/app/sitemap.ts` (Next.js App Router built-in), not a static `public/sitemap.xml`. It must cover all pages in both `/de/*` and `/en/*` variants.

**AR10:** All images must be uploaded to R2 as WebP (not JPEG) to satisfy NFR6 for both GalleryScroll (`next/image` optimises) and GalleryLightbox (PhotoSwipe serves raw CDN URL). This is a pre-development setup task.

**AR11:** Deployment is on CapRover via Docker. A `Dockerfile` is required in the project root. Environment variables are set in CapRover app config for production; `.env.local` for development.

**AR12:** Radix UI Dialog (`@radix-ui/react-dialog`) provides the focus trap and ARIA attributes for GalleryLightbox. Radix UI Select (`@radix-ui/react-select`) provides the session type dropdown in ContactForm.

### UX Design Requirements

UX-DR1: Implement Tailwind design token system with full warm neutral colour palette (#FAF8F5 background, #1A1814 text, #C4A882 accent and full token set) as CSS custom properties via tailwind.config.ts
UX-DR2: Implement dual typeface system: Cormorant Garamond (Google Fonts, display/headings, weights 300/400/600) + Inter (Google Fonts, body/UI, weights 400/500) with complete type scale from Display (96–120px) to Caption (13px) as Tailwind utilities
UX-DR3: Implement extended spacing scale in tailwind.config.ts (18, 22, 26, 30, 36, 44 custom units) for editorial section spacing at 1.5–2× platform-template norms
UX-DR4: Build NavBar component — fixed position, z-index over hero, transparent-to-blur scroll transition (backdrop-filter: blur(12px) after 80px), mobile category scroll row, desktop inline links, integrated LanguageSwitcher, role="navigation" aria-label="Main navigation", aria-current="page" on active link
UX-DR5: Build HeroImage component — height: 100svh (svh not vh), next/image with priority prop, gradient scrim via CSS ::after (linear-gradient to top, rgba overlay), Cormorant display type for name/location overlaid at bottom, placeholder="blur"
UX-DR6: Build CategoryCard component — full card as accessible <a> with descriptive aria-label, hover scale(1.03) 400ms ease transition with overflow:hidden on container, Cormorant 28px category name + Inter 11px pricing label overlaid, 2-col desktop grid / 1-col mobile, Landscape card spans full width
UX-DR7: Build GalleryScroll component — full-width vertical image stack, next/image with sizes="100vw", aspect-ratio from image metadata (prevents CLS), lazy loading, blur placeholder, opacity 0→1 200ms fade on load, 16px gap mobile / 40px desktop
UX-DR8: Build GalleryLightbox component — Radix Dialog (focus trap, aria-modal="true", role="dialog", aria-label="Photo viewer") + @use-gesture/react (pinch, swipe, drag events) + react-spring (momentum deceleration, rubber-banding physics); pinch zoom 1×–4× with rubber-band at limits; swipe between images with velocity carry; swipe-down to close on mobile; keyboard: arrow keys ←/→ to navigate, Escape to close; preloads adjacent images on open; body scroll lock; focus returns to trigger on close; scroll position restored
UX-DR9: Build LanguageSwitcher component — client-side locale switch (no page reload), locale persists via Next.js i18n routing, aria-current="true" on active locale, hreflang attributes on anchor tags, active locale at full opacity / inactive at text-tertiary with hover underline
UX-DR10: Build ContactForm component — React Hook Form state management; 5 fields: Name (text/autocomplete=name), Email (type=email/inputmode=email/autocomplete=email), Session type (Radix Select: Wedding/Portrait/Family/Events/Other), Approximate date (text, optional), Message (textarea); Cloudflare Turnstile via @marsidev/react-turnstile; server-side delivery via POST /api/contact Route Handler + Resend API; all fields with visible <label>, aria-required, errors via aria-describedby; aria-live region for submit result; all 5 fields + submit visible without scroll on iPhone SE
UX-DR11: Build TestimonialCard component — quote + attribution (first name, session type, year minimum); max 3 sentences; placed within 200px scroll distance of primary CTA on Portrait/Wedding/Family/Event pages; no anonymous testimonials
UX-DR12: Build PricingSignal component — "From CHF X" text in Inter body weight, same visual weight as surrounding body text (not a badge, callout, or promotional treatment); displayed on Portrait, Wedding, Event, Family pages only; positioned above/adjacent to primary CTA
UX-DR13: Build FooterBar component — single-row layout: copyright · Impressum link · Privacy Policy link · LanguageSwitcher; background: surface colour token
UX-DR14: Build AutoResponseEmail React Email template — personalised greeting using submitted name, warm personal acknowledgement, "Sha will reply within 24 hours" promise, first-name signature; plain text fallback; no logo or header image; tone matches About page warmth
UX-DR15: Implement Direction A home page layout — fixed nav z-index over hero; hero height 100svh; 5-category card grid (2-col desktop / 1-col mobile); cards below fold with CSS grid; category name + pricing overlay on each card
UX-DR16: Implement gallery category page layout — same nav treatment as home; full-width vertical image stack (GalleryScroll); tap/click on image → GalleryLightbox; pricing signal + testimonial + primary CTA after gallery
UX-DR17: Implement button hierarchy — Primary: bg-[#1A1814] white text, Inter 11px 500 weight, letter-spacing 0.1em, uppercase, padding 16px 40px, no border-radius, hover background accent-hover 150ms; Secondary: transparent bg, 1px border solid text colour; Ghost: no bg, no border, underline on hover; one Primary per page maximum
UX-DR18: Implement image loading pattern — all images via next/image (never raw <img>), placeholder="blur" + blurDataURL on every image, explicit sizes prop always set, descriptive alt text, hero priority=true, gallery images lazy-loaded
UX-DR19: Implement form feedback patterns — loading state: button spinner + "Sending…" label + disabled; success: inline message replaces form ("Thanks [Name]. Sha will be in touch within 24 hours."); submit failure: inline error above submit + Sha's direct email as fallback, submit re-enables; no toast notifications anywhere on site
UX-DR20: Implement overlay/lightbox interaction patterns — open: 200ms opacity fade, immediate body scroll lock, focus trapped; while open: full keyboard support (←/→/Escape/Tab); close: Escape/tap backdrop/swipe-down/pinch below 1×, 150ms fade out, focus returns to trigger, scroll position restored
UX-DR21: Implement hover/focus consistency — outline: 2px solid var(--text), outline-offset: 2px on all interactive elements; no outline:none without equivalent replacement; max 200ms hover transitions; cursor:zoom-in on gallery images; cursor:pointer on all non-link clickables
UX-DR22: Implement prefers-reduced-motion support — all gallery animations, lightbox transitions, image fade-ins, and category card hover transitions disabled when prefers-reduced-motion: reduce is active
UX-DR23: Implement xs breakpoint (375px) in Tailwind config for iPhone SE minimum viewport compatibility verification across all components

### FR Coverage Map

| FR | Epic | Component / File |
|---|---|---|
| FR1 — Hero image | E1 | `hero-image.tsx` |
| FR2 — 5 category navigation | E1 | `category-card.tsx` + home `page.tsx` |
| FR3 — Gallery images per category | E2 | `gallery-scroll.tsx` + `[locale]/*/page.tsx` |
| FR4 — About page | E4 | `[locale]/about/page.tsx` |
| FR5 — Contact accessible from any page | E1 | `nav-bar.tsx` |
| FR6 — Impressum + Privacy | E4 | `[locale]/impressum/page.tsx` |
| FR7 — Pricing signal | E2 | `pricing-signal.tsx` + `src/data/pricing.ts` |
| FR8 — Testimonials | E2 | `testimonial-card.tsx` + `src/data/testimonials/` |
| FR9–FR14 — Lightbox touch UX | E2 | `gallery-lightbox.tsx` (PhotoSwipe 5) |
| FR15 — Reduced motion | E2 | `globals.css` + PhotoSwipe `reduceMotion` option |
| FR16 — Language switching | E1 | `language-switcher.tsx` + `next-intl` |
| FR17 — Language persistence | E1 | `next-intl` URL-based routing |
| FR18 — Full bilingual content parity | E5 | `messages/de.json` + `messages/en.json` |
| FR19 — Search indexable both languages | E5 | `next-intl` alternates + hreflang |
| FR20 — Contact form (5 fields) | E3 | `contact-form.tsx` |
| FR21 — Turnstile spam protection | E3 | `contact-form.tsx` + `lib/turnstile.ts` |
| FR22 — Email to Sha | E3 | `lib/email.ts` + Resend |
| FR23 — Auto-response email | E3 | `emails/auto-response.tsx` + Resend |
| FR24 — Success confirmation | E3 | `contact-form.tsx` success state |
| FR25 — Analytics goal event | E3 | Umami event in `contact-form.tsx` |
| FR26 — Session analytics | E1 | Umami script in `[locale]/layout.tsx` |
| FR27 — Analytics dashboard | E1 | Umami self-hosted (infrastructure) |
| FR28 — SSG / no-JS rendering | E5 | `generateStaticParams` on all pages |
| FR29 — Unique metadata per page | E5 | `generateMetadata()` in each `page.tsx` |
| FR30 — Structured data (local business) | E5 | JSON-LD in home `page.tsx` |
| FR31 — Sitemap | E5 | `src/app/sitemap.ts` |
| FR32 — Canonical URLs + hreflang | E5 | `next-intl` alternates |
| FR33 — Keyboard navigation | E2 | All interactive components |
| FR34 — Alt text on gallery images | E2 | `GalleryImage.alt` in data files |
| FR35 — Form field labels | E3 | `contact-form.tsx` (RHF labels + aria) |
| FR36 — Image updates via data files | E2 | `src/data/gallery/*.ts` |
| FR37 — Copy updates via locale files | E1 | `messages/*.json` |

## Epic List

### Epic 1: Visitors can discover Sha's portfolio on the home page

Delivers a fully working, bilingual home page: editorial hero image, 5 category preview cards, fixed navigation, language switcher, and footer — the complete first impression with analytics instrumented from day one.

**FRs covered:** FR1, FR2, FR5, FR16, FR17, FR26, FR27
**UX-DRs:** UX-DR1–5, UX-DR9, UX-DR13, UX-DR15, UX-DR17, UX-DR21, UX-DR22, UX-DR23
**ARs:** AR1, AR5, AR6, AR7, AR8, AR11

---

## Epic 1: Visitors can discover Sha's portfolio on the home page

Delivers a fully working, bilingual home page: editorial hero image, 5 category preview cards, fixed navigation, language switcher, and footer — the complete first impression with analytics instrumented from day one.

### Story 1.1: Project Foundation — Design Tokens, i18n Routing, and Configuration

As a developer,
I want the project configured with Tailwind v4 design tokens, next-intl bilingual routing, Next.js image domain settings, and a production Dockerfile,
So that all subsequent pages can be built with consistent visual identity, served in both German and English, and deployed to CapRover.

**Acceptance Criteria:**

**Given** the project root, **when** `npm run dev` starts, **then** the app serves at `http://localhost:3000` without errors

**Given** a visitor navigates to `/`, **when** locale middleware runs, **then** they are redirected to `/de/` (default locale)

**Given** a visitor navigates to `/en/`, **when** the page loads, **then** English locale is active (confirmed by `<html lang="en">`)

**Given** `src/app/globals.css`, **when** any component uses the warm neutral palette, **then** CSS custom properties `--color-background: #FAF8F5`, `--color-text: #1A1814`, `--color-accent: #C4A882` and the full token set resolve correctly (UX-DR1)

**Given** `src/app/globals.css`, **when** any component uses the extended spacing scale, **then** custom units 18/22/26/30/36/44 are available as Tailwind utilities (UX-DR3)

**Given** `next.config.ts`, **when** `next/image` renders a URL from `images.photosha.ch`, **then** the domain is on the allowed list and no security error occurs

**Given** the root layout, **when** any page loads, **then** Cormorant Garamond (weights 300/400/600) and Inter (weights 400/500) load from Google Fonts via `<link>` preconnect (UX-DR2)

**Given** a `Dockerfile` in the project root, **when** `docker build` runs, **then** the image builds successfully using a `node:20-alpine` multi-stage build with `next build` + `next start`

**Given** `.env.example`, **when** it is committed to git, **then** it contains all required environment variable key names with no secret values

---

### Story 1.2: NavBar — Fixed Navigation Bar

As a visitor,
I want a persistent navigation bar available on every page without scrolling,
So that I can reach any section of the site — including the contact form — at all times.

**Acceptance Criteria:**

**Given** any page, **when** it loads, **then** the NavBar is fixed at the top with z-index above the hero image (UX-DR4)

**Given** the page scroll position is below 80px, **when** the NavBar renders, **then** its background is fully transparent

**Given** the page scroll position is at or beyond 80px, **when** the NavBar transitions, **then** it shows `backdrop-filter: blur(12px)` background (UX-DR4)

**Given** a desktop viewport (≥768px), **when** the NavBar renders, **then** Portrait, Wedding, Event, Family, Landscape, and Contact links appear inline alongside the LanguageSwitcher

**Given** a mobile viewport (<768px), **when** the NavBar renders, **then** category links appear in a horizontally scrollable row and the Contact link is accessible

**Given** any page, **when** the NavBar renders, **then** `role="navigation"` and `aria-label="Main navigation"` are present (UX-DR4)

**Given** the active page is `/de/portrait/`, **when** the NavBar renders, **then** the Portrait link carries `aria-current="page"` (UX-DR4)

**Given** all NavBar links, **when** focused via keyboard Tab, **then** a visible `outline: 2px solid var(--color-text)` appears (UX-DR21, FR33)

**Given** `prefers-reduced-motion: reduce` is active, **when** the scroll transition triggers, **then** no animated blur transition occurs (UX-DR22)

---

### Story 1.3: LanguageSwitcher — Bilingual Locale Toggle

As a visitor,
I want to switch the site between German and English from any page,
So that I can read Sha's content in my preferred language without losing my place.

**Acceptance Criteria:**

**Given** any page, **when** a visitor activates the DE/EN toggle, **then** the locale switches without a full page reload (FR16)

**Given** a visitor switches to English on the Portrait page, **when** they navigate to the Wedding page, **then** the Wedding page also renders in English (FR17)

**Given** the LanguageSwitcher, **when** the active locale is `de`, **then** the DE label is at full opacity and EN is styled at `text-tertiary` colour (UX-DR9)

**Given** the inactive locale label, **when** hovered, **then** an underline appears (UX-DR9)

**Given** the LanguageSwitcher, **when** rendered, **then** `aria-current="true"` is set on the active locale button (UX-DR9)

**Given** the LanguageSwitcher anchor tags, **when** rendered, **then** `hreflang` attributes correctly reference the alternate language URL for the current page (UX-DR9)

**Given** the switcher, **when** operated via keyboard alone, **then** both options are reachable and activatable (FR33)

---

### Story 1.4: HeroImage — Full-Bleed Hero Photograph

As a visitor,
I want to see a full-viewport hero photograph when I first arrive on Sha's site,
So that her photography immediately makes a powerful visual impact before I scroll.

**Acceptance Criteria:**

**Given** the home page loads, **when** the hero renders, **then** it fills exactly `100svh` height and full viewport width (UX-DR5)

**Given** the hero `next/image`, **when** rendered, **then** `priority={true}` is set to trigger LCP optimisation (NFR1)

**Given** the hero, **when** it renders, **then** a CSS `::after` pseudo-element applies a `linear-gradient(to top, rgba...)` gradient scrim over the bottom portion (UX-DR5)

**Given** the hero, **when** it renders, **then** Sha's name and location are overlaid at the bottom in Cormorant Garamond display type (UX-DR5)

**Given** the hero image, **when** the network is slow, **then** the `blurDataURL` placeholder is shown until the image loads (UX-DR18, AR3)

**Given** the hero `next/image`, **when** the `alt` attribute is read by a screen reader, **then** it provides a meaningful description of the image (FR34)

**Given** `npm run build`, **when** Lighthouse measures LCP on a simulated Swiss 4G connection, **then** LCP is below 1.5 seconds (NFR1)

---

### Story 1.5: CategoryCard Grid — 5 Photography Category Cards

As a visitor,
I want to see all 5 photography categories as visual cards below the hero,
So that I can understand Sha's full offering at a glance and navigate directly to my area of interest.

**Acceptance Criteria:**

**Given** the home page, **when** it loads, **then** five CategoryCards render below the hero for Portrait, Wedding, Event, Family, and Landscape (FR2)

**Given** a desktop viewport (≥768px), **when** the card grid renders, **then** cards appear in a 2-column layout (UX-DR6)

**Given** a mobile viewport (<768px), **when** the card grid renders, **then** cards appear in a 1-column stack (UX-DR6)

**Given** the Landscape card, **when** it renders on any viewport, **then** it spans the full grid width (UX-DR6)

**Given** a CategoryCard, **when** rendered, **then** the entire card is an `<a>` element with a descriptive `aria-label` (e.g. "View Portrait gallery") (UX-DR6)

**Given** a CategoryCard, **when** hovered on a pointer device, **then** the image scales to `1.03` over 400ms ease with `overflow:hidden` on the container (UX-DR6)

**Given** CategoryCard overlays, **when** rendered, **then** Cormorant Garamond 28px for category name and Inter 11px for pricing label appear over the image (UX-DR6)

**Given** `prefers-reduced-motion: reduce` is active, **when** a card is hovered, **then** no scale animation occurs (UX-DR22)

**Given** a CategoryCard link, **when** focused via keyboard Tab, **then** a visible 2px solid outline appears and Enter activates the link (UX-DR21, FR33)

**Given** a 375px viewport (iPhone SE), **when** the card grid renders, **then** all cards are fully visible without horizontal overflow (UX-DR23)

---

### Story 1.6: Home Page Assembly, FooterBar, and Analytics

As a visitor and developer,
I want the home page fully assembled with a footer and Umami analytics active,
So that the complete first-impression experience is live and Sha can track visitor sessions from day one.

**Acceptance Criteria:**

**Given** the home page at `/de/` and `/en/`, **when** it loads, **then** NavBar → HeroImage → CategoryCard grid → FooterBar render in the correct sequence (UX-DR15)

**Given** the FooterBar, **when** it renders, **then** copyright text, Impressum link, Privacy Policy link, and LanguageSwitcher appear in a single row on the surface colour background (UX-DR13)

**Given** the home page, **when** viewed with JavaScript disabled, **then** all content — hero, cards, footer — is visible in the rendered HTML (FR28, SSG)

**Given** `npm run build`, **when** the build completes, **then** static HTML files exist for `/de/` and `/en/` with no runtime server dependency (NFR23)

**Given** the Umami script tag in `[locale]/layout.tsx`, **when** any page loads in a browser, **then** Umami begins tracking the session including traffic source and pages visited (FR26)

**Given** the Umami self-hosted instance on CapRover, **when** the developer accesses the dashboard, **then** session counts, traffic sources, and bounce rates are visible (FR27)

**Given** `npm run build` completes, **when** `docker build` runs against the project Dockerfile, **then** the production container starts and serves the home page on the configured port

---

## Epic 2: Visitors can browse and explore photo galleries with native mobile experience

Delivers all 5 gallery category pages with full-width image stacks, full-screen lightbox with pinch-to-zoom, momentum, rubber-banding, and swipe-between-images — plus pricing signals, testimonials, and CTAs. Reduced motion fully supported.

### Story 2.1: GalleryScroll — Full-Width Vertical Image Stack

As a visitor,
I want to browse a gallery category as a flowing vertical stack of full-width photographs,
So that I can view Sha's work at large scale and decide which image to explore further.

**Acceptance Criteria:**

**Given** `src/data/gallery/portrait.ts` exists (pre-dev setup task, AR4), **when** GalleryScroll receives the image array, **then** images render as a full-width vertical stack with 16px gap on mobile and 40px gap on desktop (UX-DR7)

**Given** each image entry has `width` and `height` in the data file, **when** GalleryScroll renders, **then** each `next/image` uses those dimensions with `sizes="100vw"` to prevent CLS (NFR2, AR3)

**Given** an image in the stack, **when** rendered, **then** `next/image` is used with `placeholder="blur"` and the `blurDataURL` from the data file (UX-DR18, AR3)

**Given** gallery images below the fold, **when** the stack renders, **then** they are lazy-loaded (not `priority`) (UX-DR7)

**Given** an image enters the viewport, **when** it loads, **then** it fades from opacity 0 to 1 over 200ms (UX-DR7)

**Given** `prefers-reduced-motion: reduce` is active, **when** images load, **then** no opacity fade animation occurs — images appear immediately (UX-DR22, FR15)

**Given** `npm run build`, **when** Lighthouse measures CLS on a gallery page, **then** CLS score is below 0.1 (NFR2)

**Given** an image in the stack, **when** `alt` is read by a screen reader, **then** it provides a meaningful description from the data file's `alt` field (FR34)

---

### Story 2.2: GalleryLightbox — Full-Screen View with Native Touch Physics

As a visitor,
I want to tap any gallery image to view it full-screen with native pinch-to-zoom and swipe navigation,
So that I can experience Sha's photography at its highest quality with the fluid feel of a native app.

**Acceptance Criteria:**

**Given** a visitor taps or clicks any image in GalleryScroll, **when** the lightbox opens, **then** PhotoSwipe 5 opens with that image full-screen with a 200ms opacity fade (FR9, UX-DR20)

**Given** the lightbox opens, **when** it renders, **then** body scroll is locked and focus is trapped within the dialog (Radix Dialog, UX-DR8, UX-DR20)

**Given** the lightbox is open, **when** a visitor performs a pinch gesture, **then** the image zooms between 1× and 4× with no perceptible lag (≤1 animation frame, FR10, NFR7)

**Given** the image is zoomed and the pinch gesture is released, **when** momentum decelerates, **then** it slows naturally rather than stopping abruptly (FR11)

**Given** the image is panned beyond its bounds, **when** released, **then** it rubber-bands back to the nearest valid boundary (FR12)

**Given** the lightbox is open, **when** a visitor swipes horizontally, **then** the next or previous image loads with swipe velocity preserved across the transition (FR13)

**Given** the lightbox is open on mobile, **when** a visitor swipes down, **then** the lightbox closes (UX-DR8)

**Given** the lightbox is open, **when** a visitor presses ←/→ arrow keys, **then** the previous/next image is shown (UX-DR8, FR33)

**Given** the lightbox is open, **when** a visitor presses Escape or taps the backdrop, **then** the lightbox closes with a 150ms fade out (FR14, UX-DR20)

**Given** the lightbox closes, **when** it dismisses, **then** focus returns to the gallery image that triggered it and scroll position is restored (UX-DR8, UX-DR20)

**Given** the lightbox opens, **when** it initialises, **then** the adjacent images (previous + next) are preloaded (UX-DR8)

**Given** `prefers-reduced-motion: reduce` is active, **when** the lightbox opens or closes, **then** PhotoSwipe `reduceMotion: true` suppresses all transition animations (FR15, NFR16, UX-DR22)

**Given** the lightbox is open, **when** Tab is pressed, **then** focus cycles only within the lightbox controls (UX-DR8, FR33)

---

### Story 2.3: PricingSignal and TestimonialCard Components

As a visitor on a gallery category page,
I want to see a starting price and a client testimonial before I reach the contact button,
So that I arrive at the inquiry form with Swiss pricing expectations set and social proof established.

**Acceptance Criteria:**

**Given** `src/data/pricing.ts` contains starting prices, **when** PricingSignal renders on Portrait/Wedding/Event/Family pages, **then** it displays "From CHF X" in Inter body weight — same visual weight as surrounding body text, no badge or callout treatment (FR7, UX-DR12)

**Given** the Landscape page, **when** it renders, **then** PricingSignal is absent (FR7)

**Given** `src/data/testimonials/{category}.ts` contains testimonials, **when** TestimonialCard renders, **then** it displays the quote, first name, session type, and year — no anonymous testimonials (FR8, UX-DR11)

**Given** a gallery category page, **when** it is scrolled, **then** a TestimonialCard appears within 200px scroll distance of the primary CTA (UX-DR11)

**Given** the TestimonialCard, **when** rendered in DE locale, **then** the quote is in German; in EN locale, in English

**Given** both components, **when** rendered, **then** they are Server Components with no `'use client'` directive (AR7)

---

### Story 2.4: Portrait Gallery Page — Complete Category Page Assembly

As a visitor,
I want to explore the Portrait gallery with a full-width image stack, lightbox, pricing signal, testimonial, and a clear contact call-to-action,
So that I have everything I need to decide whether to book Sha for a portrait session.

**Acceptance Criteria:**

**Given** the `/de/portrait/` and `/en/portrait/` pages, **when** they load, **then** they render: NavBar → GalleryScroll (portrait images) → PricingSignal → TestimonialCard → primary CTA → FooterBar (UX-DR16)

**Given** the primary CTA button, **when** rendered, **then** it follows Primary button style: `bg-[#1A1814]` white text, Inter 11px 500 weight, letter-spacing 0.1em, uppercase, 16px×40px padding, no border-radius, hover to accent-hover at 150ms (UX-DR17)

**Given** the CTA button, **when** rendered, **then** it is the only Primary button on the page (UX-DR17)

**Given** a gallery image, **when** tapped or clicked, **then** GalleryLightbox opens with that image (FR9)

**Given** `npm run build`, **when** the build completes, **then** static HTML exists for `/de/portrait/` and `/en/portrait/` (NFR23)

**Given** the page, **when** viewed without JavaScript, **then** all images, pricing, testimonial, and CTA are visible in the rendered HTML (FR28)

**Given** all touch targets on the page, **when** measured, **then** they are at minimum 44×44 CSS pixels (NFR14)

**Given** Lighthouse on the Portrait page, **when** the accessibility score is measured, **then** it is ≥ 95 (NFR12)

---

### Story 2.5: Remaining Gallery Pages — Wedding, Event, Family, Landscape

As a visitor,
I want to browse all 5 photography categories with the same quality experience,
So that I can explore any category and find the right fit for my session type.

**Acceptance Criteria:**

**Given** `/de/wedding/`, `/de/event/`, `/de/family/`, `/de/landscape/` (and `/en/` variants), **when** they load, **then** each renders GalleryScroll wired from `src/data/gallery/{category}.ts` (FR3, FR36)

**Given** the Wedding, Event, and Family pages, **when** they render, **then** PricingSignal and TestimonialCard are present with category-specific data (FR7, FR8)

**Given** the Event page, **when** it renders, **then** the copy mentions photobooks as a deliverable option

**Given** the Landscape page, **when** it renders, **then** no PricingSignal is shown but a CTA to Contact is present

**Given** any gallery image on any category page, **when** tapped or clicked, **then** GalleryLightbox opens correctly with that category's full image set (FR9)

**Given** `npm run build`, **when** the build completes, **then** static HTML exists for all 10 gallery page variants (5 categories × 2 locales) (NFR23)

**Given** `prefers-reduced-motion: reduce` is active on any gallery page, **when** images load and the lightbox opens/closes, **then** all animations are suppressed (FR15, NFR16)

---

### Epic 3: Visitors can submit a contact inquiry and receive confirmation

Delivers the contact form with spam protection, server-side email delivery to Sha's inbox, instant auto-response to the visitor, inline success/failure feedback, and analytics goal tracking on every successful submission.

**FRs covered:** FR20, FR21, FR22, FR23, FR24, FR25, FR35
**UX-DRs:** UX-DR10, UX-DR14, UX-DR19
**ARs:** AR6, AR7, AR8, AR12

---

## Epic 3: Visitors can submit a contact inquiry and receive confirmation

Delivers the contact form with spam protection, server-side email delivery to Sha's inbox, instant auto-response to the visitor, inline success/failure feedback, and analytics goal tracking on every successful submission.

### Story 3.1: ContactForm — Inquiry Form with Validation and Spam Protection

As a visitor,
I want to submit a contact inquiry to Sha through a form on the contact page,
So that I can reach her with my session details without needing to find an email address.

**Acceptance Criteria:**

**Given** the `/de/contact/` and `/en/contact/` pages, **when** they load, **then** the ContactForm renders with 5 fields: Name (text), Email (email), Session type (Radix Select dropdown), Approximate date (text, optional), and Message (textarea) (FR20, UX-DR10)

**Given** the Session type dropdown, **when** opened, **then** options are: Wedding, Portrait, Family, Events, Other — implemented with Radix Select (AR12)

**Given** all 5 fields plus the submit button, **when** rendered on an iPhone SE (375px viewport), **then** all are visible without scrolling (UX-DR10)

**Given** each form field, **when** rendered, **then** it has a visible `<label>`, `aria-required` on required fields, and `autocomplete` attributes (Name: `name`, Email: `email`) (FR35, UX-DR10)

**Given** a field has a validation error, **when** the error message renders, **then** the field references it via `aria-describedby` (FR35)

**Given** the Cloudflare Turnstile widget, **when** the form loads, **then** the widget renders using `@marsidev/react-turnstile` with the public site key (FR21, UX-DR10)

**Given** the submit button is clicked with valid fields and a Turnstile token, **when** the form is submitted, **then** the button shows a spinner, displays "Sending…", and is disabled during the request (UX-DR19)

**Given** the API returns `{ success: true }`, **when** the response is received, **then** the form is replaced inline with: "Thanks [Name]. Sha will be in touch within 24 hours." (FR24, UX-DR19)

**Given** the API returns `{ success: false }`, **when** the response is received, **then** an inline error appears above the submit button, the button re-enables, and Sha's direct email is shown as a fallback (UX-DR19)

**Given** the Turnstile script fails to load, **when** the form renders, **then** the form remains submittable — the server handles the missing token gracefully (NFR19)

**Given** all form inputs, **when** operated via keyboard alone, **then** Tab order is logical and all fields are reachable and activatable (FR33)

**Given** the submit result area, **when** it updates (success or error), **then** it is announced via an `aria-live` region (UX-DR10)

---

### Story 3.2: Contact API Route — Email Delivery and Analytics Goal

As a visitor who has submitted the contact form,
I want my inquiry delivered to Sha's inbox and to receive an automatic confirmation email,
So that Sha can follow up and I know my message was received.

**Acceptance Criteria:**

**Given** a POST to `/api/contact` with a valid body and Turnstile token, **when** the Route Handler processes it, **then** the Turnstile token is verified server-side against the Cloudflare API using `TURNSTILE_SECRET_KEY` before any email is sent (FR21, NFR10)

**Given** the Turnstile token fails verification, **when** the server responds, **then** it returns `{ success: false, error: 'turnstile_failed' }` and no email is sent (NFR10)

**Given** Turnstile verification passes, **when** Resend sends the notification, **then** Sha's inbox receives an email with the visitor's name, email, session type, approximate date, and message (FR22)

**Given** Sha's notification email, **when** it sends, **then** it is addressed to `SHA_EMAIL` from `RESEND_FROM_EMAIL` — both from server-only environment variables (NFR8)

**Given** the notification sends successfully, **when** the auto-response sends, **then** the visitor receives a personalised email with their first name, a warm acknowledgement, and "Sha will reply within 24 hours" (FR23, UX-DR14)

**Given** the auto-response template (`src/emails/auto-response.tsx`), **when** rendered, **then** it has no logo or header image, tone matches the About page warmth, and includes a plain text fallback (UX-DR14)

**Given** both emails send successfully, **when** the Route Handler responds, **then** it returns `{ success: true }` and ContactForm fires the Umami goal event for form submission (FR25, NFR22)

**Given** Resend fails to deliver, **when** the Route Handler catches the error, **then** it logs server-side and returns `{ success: false, error: 'send_failed' }` (NFR17)

**Given** all API keys, **when** the Route Handler executes, **then** `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` are only accessed server-side — never in the client bundle (NFR8)

**Given** the contact form data, **when** the Route Handler completes, **then** no visitor data is stored in any database, log file, or persistent variable (NFR11)

**Given** the auto-response email, **when** Resend delivers it, **then** it arrives within 30 seconds under normal conditions (NFR18)

---

## Epic 4: Visitors can learn about Sha and access legal pages

Delivers the About page with Sha's story and personality, and the Impressum + Privacy Policy page — both in full bilingual DE/EN. Static, accessible, linked from footer.

### Story 4.1: About Page — Sha's Story and Personality

As a visitor,
I want to read about Sha's background, values, and approach to photography,
So that I can decide whether her style and personality are the right fit before I contact her.

**Acceptance Criteria:**

**Given** the `/de/about/` and `/en/about/` pages, **when** they load, **then** they render Sha's story, values, "locker drauf" personality, and a portrait photo of Sha (FR4)

**Given** the About page portrait photo, **when** rendered, **then** it uses `next/image` with a descriptive `alt` text, explicit `width` and `height`, and `placeholder="blur"` (UX-DR18, FR34)

**Given** the About page copy, **when** read in DE locale, **then** it is in authentic German; in EN locale, in authentic English — both capturing Sha's warm, personal tone

**Given** `npm run build`, **when** the build completes, **then** static HTML exists for `/de/about/` and `/en/about/` (NFR23, FR28)

**Given** the About page, **when** viewed without JavaScript, **then** all copy and the portrait photo are visible in the rendered HTML (FR28)

**Given** Lighthouse on the About page, **when** the accessibility score is measured, **then** it is ≥ 95 (NFR12)

---

### Story 4.2: Impressum and Privacy Policy Page

As a visitor,
I want to access Sha's legal pages — Impressum and Privacy Policy — from the footer on any page,
So that I can verify her legal compliance and understand how my data is handled.

**Acceptance Criteria:**

**Given** the `/de/impressum/` and `/en/impressum/` pages, **when** they load, **then** they render the Impressum section and Privacy Policy section as a single combined page (FR6)

**Given** the Impressum content, **when** read in DE locale, **then** it contains the legally required German Impressum fields (name, address, contact); in EN locale, an equivalent English version

**Given** the Privacy Policy content, **when** rendered, **then** it reflects the zero-cookie, zero-personal-data-storage architecture (Umami cookieless, contact data not stored)

**Given** the FooterBar on every page, **when** rendered, **then** the Impressum link navigates to the correct locale-prefixed URL (e.g. `/de/impressum/`)

**Given** `npm run build`, **when** the build completes, **then** static HTML exists for `/de/impressum/` and `/en/impressum/` (NFR23)

**Given** the page, **when** viewed without JavaScript, **then** all legal content is visible (FR28)

---

## Epic 5: Sha's site is fully discoverable by search engines and social platforms

Delivers the complete SEO and discoverability layer across all pages: unique metadata, Open Graph preview images, JSON-LD local business structured data, dynamic sitemap, canonical URLs, and hreflang — with full bilingual content parity verified across all 9 pages.

### Story 5.1: Page Metadata and Open Graph — All Pages

As a potential client discovering Sha's site through search or social sharing,
I want each page to show a compelling title, description, and preview image when shared or indexed,
So that Sha's site stands out in search results and social previews rather than showing generic placeholder text.

**Acceptance Criteria:**

**Given** each of the 9 page types (home, portrait, wedding, event, family, landscape, about, contact, impressum), **when** `generateMetadata()` runs, **then** it returns a unique `title` and `description` in the correct locale (FR29)

**Given** the home page metadata, **when** rendered in DE locale, **then** the title references "Fotografin Zürich" and related primary keywords; in EN, "Photographer Zurich"

**Given** each gallery category page, **when** `generateMetadata()` runs, **then** the title and description are specific to that category (e.g. "Wedding Photographer Zurich | Sha")

**Given** each page, **when** the `<head>` is inspected, **then** `og:title`, `og:description`, `og:image`, and `og:type` are present and populated (FR29)

**Given** the `og:image` for each page, **when** a social platform fetches the URL, **then** a valid image URL from `images.photosha.ch` is returned (no broken preview images)

**Given** each page, **when** it renders, **then** `<html lang="de">` or `<html lang="en">` matches the active locale

**Given** all page titles, **when** reviewed, **then** no two pages share the same title tag in the same locale

---

### Story 5.2: Sitemap, Structured Data, Canonical URLs, and Bilingual Parity

As Sha's website,
I want to expose a complete sitemap, structured business data, and correct canonical and hreflang signals to search engines,
So that both language versions of every page are independently indexed and Sha appears in local photographer searches in Zürich.

**Acceptance Criteria:**

**Given** `src/app/sitemap.ts`, **when** the build generates it, **then** it lists all 9 page types × 2 locales = 18 URLs, each with a `lastModified` date and correct `alternates` for hreflang (FR31, AR9)

**Given** the sitemap URL (`/sitemap.xml`), **when** fetched by a search engine crawler, **then** all 18 URLs resolve to pre-rendered HTML pages (FR28, FR31)

**Given** `public/robots.txt`, **when** fetched, **then** it allows all crawlers and references the sitemap URL

**Given** the home page, **when** its `<head>` is inspected, **then** it includes a JSON-LD `LocalBusiness` script identifying Sha as a photographer in the Greater Zürich region with `@type`, `name`, `address`, `url`, and `priceRange` (FR30)

**Given** every page, **when** its `<head>` is inspected, **then** a `<link rel="canonical">` points to the correct locale-prefixed URL for that page (FR32)

**Given** every page, **when** its `<head>` is inspected, **then** `<link rel="alternate" hreflang="de">` and `<link rel="alternate" hreflang="en">` point to the correct DE and EN URLs respectively (FR19, FR32)

**Given** `messages/de.json` and `messages/en.json`, **when** reviewed, **then** every key present in one file has a corresponding key in the other — no missing translations in either language (FR18, FR37)

**Given** Lighthouse on any page, **when** the SEO score is measured, **then** it is ≥ 95

**Given** Google Search Console, **when** the sitemap is submitted, **then** all 18 URLs are eligible for indexing (FR19, FR31)

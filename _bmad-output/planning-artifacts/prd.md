---
stepsCompleted: [1, 2, '2b', '2c', 3, 4, 5, 6, 7, 8, 9, 10, 11]
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: greenfield
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-photosha-2026-03-22.md'
  - '_bmad-output/planning-artifacts/research/market-photographer-portfolio-ux-design-research-2026-03-22.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
workflowType: 'prd'
---

# Product Requirements Document - photosha

**Author:** jack
**Date:** 2026-03-23

## Executive Summary

photosha is a custom-built photography portfolio website for Sha, a Thai-Swiss photographer based in the Greater Zürich region, covering weddings, portrait, family, events, and landscape photography. The site replaces an outdated 2020 website that fails to project Swiss market pricing, lacks visual differentiation, and delivers a degraded experience to the mobile-majority audience.

The core business problem is a mismatch between Sha's work quality and her current client mix. Her existing online presence attracts predominantly community-referred clients with below-market price expectations. The new site must signal Swiss premium positioning to cold-traffic visitors discovering her via Google Search — converting them into genuine inquiries at CHF 3,500–9,000+ price points — without alienating the community segment that forms her current base.

**Primary users:** Six personas across two trust journeys. Cold traffic (Swiss wedding couples on mobile; international destination wedding clients on a single visit from search; birthday/celebration clients discovering the option on-site) must be won on first impression. Warm traffic (Thai–Swiss community clients needing premium price reframe; Swiss family/portrait clients arriving via referral; corporate event clients via professional network) uses the site to confirm an existing decision. All six journeys converge at the same outcome: a contact form submission.

**Success target:** 3–4 genuine inquiries per month within 3 months of launch, growing to 5–8 by month 12, with at least one inquiry from a non-community discovery channel within the first 3 months.

**Tech stack:** Next.js 16.2.1, React 19, App Router, TypeScript, Tailwind CSS. Cloudflare R2 for image storage and CDN delivery. Resend for transactional email, Cloudflare Turnstile for spam protection. Self-hosted on CapRover. Bilingual DE/EN via Next.js i18n. Umami analytics (self-hosted, nFADS-compliant). No CMS — content managed directly in code by the developer.

### What Makes This Special

Two capabilities, neither of which exists in the Zürich photographer market, working as a compound differentiator:

**1. Mobile-native gallery UX.** Native pinch-to-zoom with correct physics — momentum deceleration, rubber-banding at image limits, velocity-preserving swipe between photos — implemented via Pointer Events API + `@use-gesture/react` + `react-spring`. Every platform-template competitor (Squarespace, Pixieset, Format) delivers a degraded touch gallery. No competitor in the market currently offers native-quality touch interaction. The moment a visitor pinches to zoom and feels correct rubber-band resistance, they register that this site is categorically different — and that signal transfers to the photographer.

**2. Editorial Quiet Luxury design.** Direction A full-bleed overlay layout: hero image fills 100% of the viewport on first load, nav floated in white over the image, category navigation as full-width image cards below the fold. Cormorant Garamond (editorial serif, display/headings) + Inter (neutral sans, body/UI). Warm neutral palette: `#FAF8F5` background, `#1A1814` near-black text, `#C4A882` warm sand accent. Extended spacing scale at 1.5–2× platform-template norms. No decoration — photography carries all visual weight.

**Core insight:** The bar for visual differentiation in the Zürich photographer market is low. All major competitors use visually interchangeable platform templates. A custom build that occupies the premium visual space they've left empty, combined with gallery touch physics they cannot replicate without a custom build, creates a defensible position that is difficult for template-based competitors to match.

## Project Classification

| Attribute | Value |
|---|---|
| Project type | Web application (multi-page, SSR/SSG, SEO-critical) |
| Domain | General — creative services / local business |
| Complexity | Medium (technically: i18n routing, native touch physics, image CDN pipeline, email integration; domain: standard, no regulatory requirements) |
| Project context | Greenfield — complete rebuild, no migration from existing system |
| Deployment | Self-hosted CapRover, single environment |

## Success Criteria

### User Success

**Cold traffic visitor (Lena & Marco, James & Mei):**
- Hero image loads in under 1 second — visitor does not register a load wait
- Gallery pinch-to-zoom responds with native physics on first touch — visitor experiences the differentiator without instruction
- Visitor browses at least one full gallery category before navigating away
- Visitor reaches the About page on at least one visit before submitting inquiry
- Contact form completes without friction — no abandoned submissions due to UX confusion
- Auto-response email arrives within 30 seconds — visitor feels the process has begun

**Warm traffic visitor (Sophie, Narin, HR Anna):**
- Site immediately communicates premium positioning — pricing signal visible before CTA
- About page creates personal connection — visitor feels "I want to work with this person"
- Contact form submission requires no more than 3 minutes from first field to submit confirmation

**Self-selection:** Visitors who are not the right fit exit after gallery browse — this is a success, not a failure.

### Business Success

| Milestone | Metric | Target |
|---|---|---|
| 3 months | Contact form submissions/month | 3–4 |
| 3 months | Non-community discovery channel inquiries | ≥ 1 |
| 3 months | Analytics baseline | Established (Umami + Search Console live) |
| 6 months | Average session duration site-wide | > 2 min 30 sec |
| 6 months | Mobile gallery page bounce rate | < 55% |
| 6 months | Contact form conversion rate | ≥ 2% of sessions |
| 6 months | Non-community bookings | ≥ 1 confirmed |
| 12 months | Contact form submissions/month | 5–8 |
| 12 months | International destination wedding inquiry | ≥ 1 |
| 12 months | Google Search Console impressions | Visible for "Fotografin Zürich", "Wedding Photographer Zurich", "Familienfotograf Zürich Region" |
| 12 months | Non-community referral bookings | Beginning to appear |

**Adjustment signals:**
- Session duration < 1:30 or gallery bounce > 70% → gallery load speed or image curation needs attention
- < 2 contact form submissions/month after 3 months → review pricing signal placement and About page strength

### Technical Success

Measurable performance and integration targets are defined in full in the Non-Functional Requirements section. The qualitative criteria unique to this product:

| Requirement | Target |
|---|---|
| Touch physics — iOS Safari | Pinch-zoom, momentum, rubber-band indistinguishable from native iOS Photos app |
| Touch physics — Android Chrome | Equivalent physics behaviour on Android |
| DE/EN language switch | Instant — no reload, locale state persists across navigation |
| SEO indexing timeline | Sitemap submitted at launch; site indexed within 2 weeks |

### Measurable Outcomes

**Primary metric:** Contact form submissions per month (Umami goal event). Everything else is diagnostic.

**Critical technical gate:** Sub-1-second first image load on Swiss 4G. Every other metric depends on visitors staying long enough to experience the product.

## Product Scope

### MVP — Minimum Viable Product

Launch-ready when all of the following are complete:

**Pages (9):**
- Home — full-bleed hero (Direction A), category card grid
- Portrait — gallery (15–20 images), pricing signal "from CHF 350", testimonial, CTA
- Wedding — gallery (15–20 images), pricing signal "from CHF 3,500", testimonial, CTA
- Event — gallery (15–20 images, corporate + Thai festivals + birthdays), photobook mention, CTA
- Family — gallery (15–20 images), pricing signal "from CHF 500", testimonial, CTA
- Landscape — gallery (15–20 images), CTA
- About — Sha's story, personal portrait photo, warm "locker drauf" energy in copy
- Contact — 5-field form (Name, Email, Session type, Approximate date, Message), Turnstile, Resend, auto-response
- Impressum + Privacy — nFADS/GDPR-compliant (DE primary, EN secondary)

**Technical (all required for launch):**
- Next.js 16.2.1, React 19, App Router, TypeScript, Tailwind CSS
- Native mobile gallery: pinch-to-zoom, momentum, rubber-banding — iOS Safari + Android Chrome
- Cloudflare R2 image storage + CDN delivery
- Bilingual DE/EN via Next.js i18n — full content parity, natively written
- Resend transactional email + Cloudflare Turnstile spam protection
- CapRover self-hosted deployment
- Umami analytics self-hosted on CapRover, form submission goal configured
- Google Search Console: sitemap.xml, robots.txt, local business structured data
- WCAG 2.1 AA compliance

**Content (required before launch):**
- All 5 gallery categories: 15–20 curated images each
- All copy in both DE and EN — natively written, not translated
- 3–5 testimonials — attributed with first name, session type, year
- Sha's portrait photo for About page

### Growth Features (Post-MVP)

**v1.1 — 3–6 months post-launch:**
- Blog / journal section — shoot stories and Swiss location features for SEO
- Dedicated Birthday / Celebration landing page if Event generates specific inquiry volume
- Pricing page with full package breakdowns

**v1.2 — 6–12 months:**
- Dedicated Corporate / Events B2B page with client references
- Private client gallery portal (replacing WeTransfer / Pixieset)
- Online booking / availability calendar

### Vision (Future)

**v2.0 — 12+ months:**
- Photobook showcase and ordering flow
- Video integration — shoot recaps and BTS reels from Instagram
- National Swiss market expansion if analytics show demand beyond Greater Zürich

## User Journey Mapping

### Journey 1 — Lena & Marco, Swiss Wedding Couple (Cold Traffic)

**Entry:** Instagram Reel from Sha's account shows a candid wedding moment — a laugh during signing. The image feels real. Lena taps the profile link.

**Mobile landing:** The home page hero fills the screen — a full-bleed wedding image, no loading delay. The nav floats white over the image. Lena instinctively scrolls. The category cards appear: Wedding, Portrait, Family, Event, Landscape.

**Gallery exploration:** She taps Wedding. The gallery opens — a grid of warm, natural images. She pinches to zoom on a ceremony moment. The zoom responds with rubber-band physics. She swipes to the next image without releasing. *This feels different.* Marco leans over: "Who is this?" They scroll through all 20 images.

**Trust verification:** She taps About. Sha's portrait. A personal paragraph about why she photographs weddings — not corporate language, actual warmth. Lena reads it twice. She screenshots it.

**Return visit:** Two days later, Marco opens the site on desktop while comparing three photographers. He notices "Starting from CHF 3,500" — mid-range in their budget. He zooms into specific images. He reads the testimonial: "Sha was calm the whole day and made us forget there was a camera." He forwards the link to Lena.

**Conversion:** Lena submits the contact form from her phone. Five fields. "Approximate date" — she types their wedding date. Sends. An auto-reply arrives in 22 seconds: Sha's name, a warm acknowledgment, a promise to respond within 48 hours. Lena texts Marco: "Done."

---

### Journey 2 — Sophie, Swiss Family/Portrait Client (Warm Referral)

**Entry:** Her colleague at work says "We used Sha for our family photos — she was so good with the kids, look at these." Sophie sees the photos on a phone screen. They're warm, relaxed, full of movement. "How do I contact her?" "Just go to the website."

**Direct to About:** Sophie types photosha.ch on her phone. She goes straight to About — she needs to know who this person is before she looks at any photos. She reads about Sha. The language is personal, not professional. "I want every person in front of my lens to feel comfortable." Sophie exhales.

**Gallery check:** She browses Family. She sees kids running, parents laughing, a grandmother holding a baby. Nobody looks stiff. She zooms in on a child's expression — natural, unselfconscious. She relaxes.

**Pricing calibration:** She scrolls down and sees "Starting from CHF 500." She expected more. She's in.

**Testimonial confirmation:** She reads the testimonial from a family client: "Our kids were shy at first but Sha had them laughing within 10 minutes." This is exactly what Sophie needed to hear.

**Conversion:** She fills the contact form in under 3 minutes. In the "Message" field she writes: "My kids are 4 and 7 and a bit shy. Is that okay?" Auto-response arrives. She shows her husband: "I found our photographer."

---

### Journey 3 — James & Mei, International Destination Wedding Couple (Cold Search Traffic)

**Entry:** Google search: "wedding photographer Zurich English speaking." Photosha.ch appears. James clicks.

**Single-visit decision window:** This is their only visit. They're in Singapore planning from abroad. James has 20 minutes before a call. He opens the site — hero loads immediately, full-bleed mountain ceremony image. He switches to EN in the language toggle (one click, instant, no reload).

**Portfolio validation:** He navigates to Wedding. He's looking for Swiss location photography — Alps, lakes, architecture. He finds it across the gallery. He zooms into a lakeside shot. The physics are correct. He's used to apps — this feels like an app.

**Process confidence:** He navigates to About. He reads about Sha's bilingual background, her Swiss and Thai cultural references. He thinks: *She'll understand an international couple.* He checks for any process or FAQ information in the nav — none in MVP. He goes to Contact.

**Conversion under time pressure:** He fills the form. "Session type: Wedding." "Approximate date: [their date]." "Message: We are an international couple planning a lake Geneva ceremony. Do you travel outside Zürich?" He submits. Auto-response arrives in 18 seconds. He screenshots it and forwards to Mei: "Found someone. Check her wedding gallery — it's stunning."

---

### Journey 4 — Narin, Thai–Swiss Community Client (Warm, Existing Relationship)

**Entry:** Narin already knows Sha. She's booked her before, or her cousin has. She wants to book a family session for her parents visiting from Thailand next month.

**Price recalibration moment:** She opens the site to get the contact form. She sees the Family page: "Starting from CHF 500." The last time she booked, she paid CHF 250. The site tells her, without a conversation, that pricing has changed. She processes this quietly.

**About page anchor:** She reads about Sha. She already knows this person — but the site version of Sha is professional, positioned, premium. It reframes her perception. Narin doesn't begrudge the new price; she understands it.

**Conversion:** She submits the contact form. She adds in the message: "It's for my parents who are visiting." The form is fast and friendly. She knows Sha will recognise her name.

---

### Journey 5 — HR Anna, Corporate Events Manager (Professional Network Referral)

**Entry:** Anna is the HR manager at a Zürich-based company. A colleague from another firm mentions they used "a photographer called Sha" for their company anniversary event — "very professional, fast turnaround." Anna searches for the website directly.

**Credibility scan:** Anna is efficient. She opens the Events page. She looks at the gallery — she needs corporate event imagery alongside cultural events. She sees both. She looks for indicators of professionalism: clear contact process, pricing signal, deliverables mentioned. She finds the photobook mention on Events. She notes the "Starting from CHF X" approach — no package details, but enough to know this is in the right range for a company budget.

**About page assessment:** She reads About. Professional tone combined with warmth — she concludes Sha will handle a professional event environment appropriately.

**Contact preference:** Anna prefers email to a form for corporate inquiries, but the form is acceptable. She uses the "Session type" field to select "Event." In the Message field she writes a brief, process-oriented note: "We are looking for coverage of a team day for 80 people on [date]. Can you provide a quote and sample corporate event gallery?" She submits.

**Follow-up expectation:** The auto-response arrives. She files it. She'll wait 48 hours for Sha's reply.

---

### Journey 6 — Beatrice, Birthday/Celebration Client (Discovery)

**Entry:** Beatrice is turning 40. Her friend posted stunning portraits on Instagram. "Who took these?" "A photographer called Sha." She searches for Sha on Instagram, finds the profile, taps the link.

**Discovery moment:** She lands on the home page. She didn't know you could book a photographer for a birthday. The category cards show Portrait and Event. She taps Event — she sees birthday photos. Adults, champagne, genuine emotion, not staged grimaces. She didn't know this was possible.

**Price discovery:** She scrolls down and sees the pricing signal. CHF 500 starting. She calculates. For her 40th, this is a gift to herself. She's in.

**About page emotional connection:** She reads About. Sha's warmth comes through. Beatrice imagines the session — being made to feel relaxed, not stiff, not posed. She reads a testimonial from a birthday client.

**Conversion — impulse with warmth:** She submits the contact form within 10 minutes of first landing. "Session type: Event." "Message: I'm turning 40 in [month] and would love to do a birthday shoot. Is this something you offer?" Auto-response arrives immediately. She saves it to her calendar.

---

### Journey 7 — Jack, Website Maintainer (Developer Admin)

**Entry (maintenance task):** Three months post-launch, Sha has a new set of wedding photos from a summer shoot. She sends Jack the files. Jack uploads the new images to the Cloudflare R2 bucket in the correct category folder.

**Code update:** Jack opens the codebase, navigates to the Wedding gallery data file, adds the new image filenames to the array. No CMS, no deployment pipeline complexity — a straightforward edit. He runs the dev server locally to verify the images load and the gallery physics work correctly with the new additions.

**Deployment:** Jack pushes to the CapRover-connected branch. The site redeploys. He verifies the live site. Done in under 20 minutes.

**Ongoing monitoring:** Jack checks Umami weekly — contact form submission count, session duration, traffic sources. He checks Google Search Console monthly — impressions for target keywords. He flags any anomalies to Sha.

---

### Journey Requirements Summary

| Journey | Key requirement | Technical dependency |
|---|---|---|
| Lena & Marco | Hero loads < 1s; gallery touch physics correct | R2 CDN, `@use-gesture/react`, `react-spring` |
| Sophie | About page trust signal; testimonials adjacent to CTA | Static content; testimonials component |
| James & Mei | EN language instant switch; no reload | Next.js i18n, client-side locale toggle |
| Narin | Pricing signal visible without contact; form fast | Pricing copy on category pages |
| HR Anna | Events gallery includes corporate examples; form "Session type" covers Event | Gallery curation; form field options |
| Beatrice | Event gallery shows birthday examples; discovery path from home → Event | Gallery curation; home category cards |
| Jack | R2 upload → code edit → redeploy cycle is simple; Umami accessible | R2 bucket structure; Umami dashboard |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Native Mobile Gallery Touch Physics**

The defining technical innovation: a web-based photography gallery that replicates the exact physics of native iOS/Android touch interactions — momentum deceleration, rubber-band resistance at image limits, velocity-preserving swipe transitions between photos. Implemented via Pointer Events API + `@use-gesture/react` + `react-spring`.

This is a new interaction paradigm for the photographer portfolio category. Every platform-based competitor (Squarespace, Pixieset, Format, Showit) delivers a degraded mobile gallery because their template systems cannot implement custom pointer physics. A visitor pinching to zoom and feeling correct rubber-band resistance registers — without being told — that this site is categorically different from the alternatives. The signal transfers to the photographer: if her website has native-quality engineering, her craft deserves attention.

**2. Editorial Quiet Luxury in a Template-Uniform Market**

The visual design innovation: occupying a premium aesthetic position that the entire local market has left empty. All identified Zürich-area photographer websites use one of three or four visually interchangeable platform templates — clean, minimal, white, safe. None use editorial typography at display scale. None use full-bleed viewport-height hero layouts with floating navigation. None pair a high-contrast serif (Cormorant Garamond) with a restrained sans (Inter) at the scale this site will use.

This is not the same as "better design." It is design that occupies an unoccupied category. A visitor who has seen five template sites and then lands on photosha sees something that reads as premium in the same way a magazine editorial reads as premium — through restraint, scale, and typographic confidence, not decoration.

**Combined differentiator:** Neither innovation alone is as powerful as the two together. The design creates the first impression and signals category. The gallery physics create the moment of surprise and confirmation. Together they create a compound signal that a template-based competitor cannot replicate without also building a custom site — which requires exactly the same investment that distinguishes photosha in the first place.

### Market Context & Competitive Landscape

The Zürich photographer market (competitors researched: Patrick Eberle, Gabriela Brandenstein, Pascal Gaudez, Simone Schiess) shows uniform platform adoption. No competitor currently:
- Offers native-quality touch gallery physics on mobile
- Uses editorial typography at display scale
- Deploys a full-bleed overlay home layout

The unoccupied position is not a gap that will be filled quickly. Template-based competitors would need to commission a custom build — the same investment as this project — to match either differentiator. This makes the competitive position durable.

### Validation Approach

**Touch physics validation:**
- iOS Safari: pinch-to-zoom, momentum scroll, rubber-band resistance must be indistinguishable from native iOS Photos app — tested manually on real devices (iPhone, iPad)
- Android Chrome: equivalent behaviour tested on real Android device
- Failure mode: physics feel "web-like" (no momentum, no rubber-band) → root cause in gesture handler configuration, not fundamental limitation

**Design differentiation validation:**
- First-impression test: show the home page (full-bleed, no nav context) to someone unfamiliar with the project — do they perceive it as premium? Do they perceive it as a photographer's site?
- Comparison test: side-by-side with a Squarespace photographer template — is the difference immediately legible?

**Business validation:**
- Primary signal: contact form inquiry quality improves (clients arriving with Swiss price expectations, not community pricing assumptions)
- Secondary signal: non-community inquiry within 3 months of launch (baseline from current site is zero)

### Risk Mitigation

| Risk | Mitigation |
|---|---|
| Performance penalty from physics library | `@use-gesture/react` + `react-spring` are tree-shakeable; profile bundle size at build |
| Design perceived as "too cold" for warm community clients | About page copy explicitly counterbalances with personal warmth; testimonials anchor trust |
| Market copies the design language quickly | Custom build creates ongoing divergence opportunity; template platforms cannot clone custom touch physics |

*Touch physics implementation risk and full operational risk register: see Project Scoping & Phased Development > Risk Mitigation Strategy.*

## Web Application Specific Requirements

### Project-Type Overview

photosha is a **multi-page application (MPA)** built on Next.js App Router with a hybrid rendering strategy: static generation (SSG) for all gallery and content pages, server-side rendering (SSR) for the contact form route handler. There is no client-side routing shell or SPA shell — each page is a discrete, independently indexable document. This is the correct choice for an SEO-critical portfolio site where every gallery page must be discoverable by search crawlers.

### Browser Support Matrix

**Primary targets (must be flawless):**

| Browser | Platform | Priority | Notes |
|---|---|---|---|
| Safari (iOS 16+) | iPhone, iPad | P0 | Touch physics, pinch-to-zoom — the core differentiator experience |
| Chrome (Android 10+) | Android phone/tablet | P0 | Touch physics parity with iOS |
| Safari (macOS 13+) | Desktop | P1 | Primary desktop browser for Swiss users |
| Chrome (latest) | Desktop | P1 | Secondary desktop |
| Firefox (latest) | Desktop | P2 | Baseline functional support |
| Edge (latest) | Desktop | P2 | Baseline functional support |

**Explicitly out of scope:** Internet Explorer, legacy Edge (EdgeHTML), Chrome < 90, iOS < 16. No graceful degradation for touch physics on unsupported browsers — modern browser requirement is acceptable for this audience.

### Responsive Design Requirements

The site is **mobile-first** by design and audience:
- Breakpoints: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px (Tailwind defaults)
- Gallery grid: 1 column mobile → 2 columns tablet → 3 columns desktop
- Hero: 100svh on all breakpoints (uses `svh` not `vh` to handle mobile browser chrome correctly)
- Navigation: floating overlay on mobile and desktop; burger/drawer pattern on narrow viewports
- Typography scale: fluid — larger display sizes unlock at `md` and above
- Touch targets: minimum 44×44px on all interactive elements (WCAG 2.5.5)
- Image aspect ratios locked — no layout shift on image load (width/height attributes required on all `<img>`)

### Performance Targets

| Metric | Target | Method |
|---|---|---|
| LCP (hero image) | < 1.5s on simulated Swiss 4G | Lighthouse, PageSpeed Insights |
| CLS | < 0.1 | Explicit image dimensions, no late-loading layout shifts |
| FCP | < 1.0s | SSG pre-rendering, minimal JS on initial load |
| INP | < 200ms | Minimal blocking JS, deferred non-critical scripts |
| Bundle size (JS) | < 150kb gzip (initial load) | Next.js bundle analysis, tree-shaking |
| Image delivery | WebP/AVIF via Cloudflare R2 CDN | Next.js `<Image>` with R2 loader |
| TTFB | < 200ms | SSG CDN edge delivery via CapRover |

**Critical path:** Hero image must be pre-loaded — `<link rel="preload">` for the above-the-fold image. Gallery images below the fold use lazy loading with `loading="lazy"`.

### SEO Strategy

SEO is a primary acquisition channel — not an afterthought. Requirements:

**Technical SEO (all required for launch):**
- `sitemap.xml` — auto-generated, includes all category pages and both language variants
- `robots.txt` — permissive for all crawlers, no blocked paths
- Canonical URLs — explicit per page, with `hreflang` for DE/EN variants
- Open Graph tags — per page: `og:title`, `og:description`, `og:image` (gallery preview), `og:locale`
- Structured data — `LocalBusiness` schema for Sha's photography business (name, location, service area, contact)
- No client-side rendering for content — all text and images in SSG HTML, crawlable without JS

**Target keywords:**
- Primary (DE): "Fotografin Zürich", "Hochzeitsfotografin Zürich", "Familienfotograf Zürich Region", "Portrait Fotografin Zürich"
- Primary (EN): "Wedding Photographer Zurich", "Portrait Photographer Zurich", "Family Photographer Zurich Switzerland"
- Long-tail: "Hochzeitsfotografin Thai-Schweiz", "destination wedding photographer Switzerland"

**Page-level metadata strategy:**
- Each gallery category page has unique `<title>` and `<meta description>` — not templated
- About page metadata focuses on Sha's personal brand and location
- Contact page metadata targets booking intent queries

### Accessibility Level

**Target: WCAG 2.1 AA** · Lighthouse accessibility score ≥ 95 · see NFR12–NFR16 for measurable criteria.

Implementation notes: `<html lang>` set per active locale; focus indicators preserved on all interactive elements; `prefers-reduced-motion` respected throughout gallery.

### Implementation Considerations

**i18n routing (Next.js App Router):**
- Route structure: `/de/...` and `/en/...` — locale prefix on all routes
- Default locale: `de` — redirects from `/` to `/de/`
- Language switcher: client-side locale change without full page reload, locale persists in cookie/localStorage across navigation
- Content: separate string files per locale — no auto-translation, all copy natively written

**Image pipeline:**
- All images stored in Cloudflare R2, organised by category: `r2://photosha/{category}/{filename}`
- Delivered via Cloudflare CDN with cache headers (`Cache-Control: public, max-age=31536000, immutable`)
- Next.js `<Image>` component with custom R2 loader — handles WebP/AVIF conversion and responsive `srcset`
- Gallery image manifest: a TypeScript data file per category listing filenames and alt text — edited directly in code when images are added

**Contact form:**
- Route handler: `POST /api/contact` — server-side Resend API call, never exposes API key to client
- Cloudflare Turnstile: client-side widget, server-side token verification in route handler
- Rate limiting: Cloudflare-level (no additional application-level rate limiting required for MVP)
- Form state: React controlled components, client-side validation before submit, server-side validation in route handler

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — the minimum version that must deliver the full emotional impact of the product, because the differentiation *is* the experience. A degraded version (without touch physics, without the full-bleed design, without bilingual content) would not test the actual value proposition; it would test a different, weaker product. There is no meaningful way to launch a partial version of this site.

**Resource requirements:** One developer (Jack), full-stack. Single environment (CapRover). No CMS, no third-party content workflows. Content requires Sha's direct input: image selection (5 galleries × 15–20 images), bilingual copy (DE + EN, natively written), 3–5 testimonials, About page portrait photo.

**Launch gate:** The MVP is complete when all launch blockers are resolved — not when a feature subset is live. The site either functions as designed or it does not launch.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
All six client personas supported from day one:
- Lena & Marco (Swiss wedding, cold Instagram traffic) — Wedding gallery + About + Contact
- Sophie (family/portrait, warm referral) — Family/Portrait gallery + About + Testimonials + Contact
- James & Mei (international destination, cold search traffic) — EN-language Wedding gallery + Contact
- Narin (Thai–Swiss community, existing relationship) — Pricing signal on category pages + Contact
- HR Anna (corporate events, network referral) — Events gallery + Contact
- Beatrice (birthday, discovery) — Events/Portrait gallery + Contact

**Must-Have Capabilities:**

| Category | Requirement | Rationale |
|---|---|---|
| Pages | 9 pages (Home, Portrait, Wedding, Event, Family, Landscape, About, Contact, Impressum+Privacy) | Each serves a distinct persona or legal need |
| Gallery | Native touch physics (pinch-to-zoom, momentum, rubber-band) | Core differentiator; absent = product fails |
| Image delivery | Cloudflare R2 + CDN, WebP/AVIF, < 1.5s LCP | Hero load speed is the #1 drop-off risk |
| Design | Direction A full-bleed overlay, Cormorant + Inter, warm palette | Premium signal; degraded design = no differentiation |
| i18n | Bilingual DE/EN, full content parity, natively written | James & Mei persona; Swiss domestic trust signal |
| Pricing signals | "From CHF X" on Portrait, Wedding, Family, Event pages | Non-community client price calibration |
| Contact form | 5-field form, Turnstile, Resend, auto-response < 30s | Primary conversion mechanism |
| Analytics | Umami goal event on form submission | Cannot measure success without this from day one |
| SEO | sitemap.xml, robots.txt, hreflang, LocalBusiness schema, per-page metadata | Primary cold-traffic acquisition channel |
| Accessibility | WCAG 2.1 AA, Lighthouse a11y ≥ 95 | Swiss market standard; also correct |

**Scoped out of MVP (explicit):**

| Feature | Why out | When in |
|---|---|---|
| Blog/journal | Zero content at launch; SEO value accrues over time | v1.1 (3–6 months) |
| Dedicated pricing page | "From CHF X" signals sufficient for MVP inquiry volume | v1.1 when Sha settles pricing |
| Dedicated birthday landing page | Covered under Events; own page if inquiry volume warrants | v1.1 |
| Dedicated corporate/B2B page | Covered under Events; own page when Migros-scale references available | v1.2 |
| Private client gallery portal | WeTransfer/Pixieset free tier sufficient for MVP volume | v1.2 |
| Online booking/calendar | Contact form sufficient for 3–8 inquiries/month | v1.2 |
| Photobook showcase/ordering | Service not yet web-promoted | v2.0 |
| Video content | No content exists at launch | v2.0 |
| CMS | Developer manages content directly in code | Out of scope indefinitely |

### Post-MVP Roadmap

Feature roadmap by phase: see Product Scope > Growth Features and Vision.

### Risk Mitigation Strategy

**Technical risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Touch physics implementation fails to feel native | Critical — core differentiator lost | Prototype the gallery component in isolation first; validate on real iOS/Android devices before building pages around it |
| Hero image LCP > 1.5s | High — primary drop-off risk | R2 + Cloudflare CDN with `<link rel="preload">` for hero; measure with Lighthouse at every significant change |
| i18n routing causes SEO issues (duplicate content, hreflang misconfiguration) | Medium — loses cold search traffic | Validate with Google Search Console shortly after launch; verify canonical + hreflang tags manually |
| Resend delivery failure | High — breaks conversion path | Test end-to-end email delivery before launch; monitor Resend dashboard post-launch |

**Market risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Site launches but cold traffic never finds it | High — no SEO organic growth | Google Search Console monitoring from week 1; sitemap submitted at launch |
| Premium positioning alienates community clients | Low — community bookings are not price-sensitive in the same way | About page warmth counterbalances visual premium; pricing signal reframes rather than excludes |
| Competitors launch custom builds within 12 months | Low-medium — advantage narrows | Touch physics cannot be replicated in platform templates; custom build timeline for competitors is 6–12 months minimum |

**Resource risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Content not ready at development completion | Blocks launch | Content collection (images, copy, testimonials) must begin in parallel with development, not after |
| Single developer = no backup | Medium | Architecture kept intentionally simple (no CMS, no complex state, SSG-first); any Next.js developer can pick up |
| Scope creep during development | Medium | PRD is the scope boundary; new ideas go to the v1.1 backlog, not the current build |

## Functional Requirements

### Portfolio Presentation

- **FR1:** Visitors can view a full-bleed hero image that fills the viewport on first load of the home page
- **FR2:** Visitors can navigate to five photography category galleries (Portrait, Wedding, Event, Family, Landscape) from the home page
- **FR3:** Visitors can view a curated set of images within each gallery category
- **FR4:** Visitors can access the About page to read about Sha's background, personality, and approach to photography
- **FR5:** Visitors can access the Contact page from any page on the site without scrolling
- **FR6:** Visitors can read the Impressum and Privacy Policy pages
- **FR7:** Visitors can see a starting price signal on Portrait, Wedding, Family, and Event category pages before reaching the contact form
- **FR8:** Visitors can read attributed testimonials from past clients on gallery category pages

### Gallery Interaction

- **FR9:** Visitors can open a full-screen view of any gallery image from the category grid
- **FR10:** Visitors can pinch to zoom into a full-screen gallery image on a touch device
- **FR11:** Gallery zoom momentum decelerates naturally after a pinch gesture is released
- **FR12:** Gallery zoom rubber-bands at the image limits and returns to a bounded state on release
- **FR13:** Visitors can swipe between gallery images while in full-screen view, with swipe velocity preserved across the transition
- **FR14:** Visitors can dismiss the full-screen gallery view and return to the category grid
- **FR15:** Visitors who prefer reduced motion can browse the gallery without animated transitions

### Bilingual Content

- **FR16:** Visitors can switch the site language between German and English
- **FR17:** Language selection persists across page navigation without requiring re-selection
- **FR18:** All content pages are available with full content parity in both German and English
- **FR19:** Search engines can discover and index both language versions of each page as distinct documents

### Contact & Conversion

- **FR20:** Visitors can submit a contact inquiry via a form providing their name, email address, session type, approximate date, and a message
- **FR21:** The contact form rejects automated spam submissions before they reach the email delivery system
- **FR22:** Submitted contact inquiries are delivered to Sha's email inbox
- **FR23:** Visitors receive an automatic acknowledgement email after submitting a contact inquiry
- **FR24:** Visitors receive a clear success confirmation on the page after submitting the contact form

### Analytics & Measurement

- **FR25:** Each successful contact form submission is recorded as a discrete goal event in the analytics system
- **FR26:** The analytics system captures session-level data including traffic source, pages visited, and time on page, without collecting or storing personal visitor data
- **FR27:** The developer can access analytics data (session counts, goal completions, traffic sources, bounce rates) via a self-hosted dashboard

### Search & Discoverability

- **FR28:** Each page is accessible to search engine crawlers and renders complete content without requiring JavaScript execution
- **FR29:** Each page exposes a unique title, description, and preview image for search engine results and social sharing
- **FR30:** The site exposes structured data identifying Sha as a local business photographer in the Greater Zürich region
- **FR31:** The site publishes a sitemap covering all pages in both language variants for search engine indexing
- **FR32:** Canonical URLs and language relationship declarations are present on all pages

### Accessibility

- **FR33:** All interactive elements on the site are operable via keyboard navigation alone
- **FR34:** All gallery images expose a descriptive text alternative for screen readers
- **FR35:** All contact form fields are programmatically associated with their visible labels and any error messages

### Developer Content Management

- **FR36:** The developer can add images to a gallery category by uploading files to cloud storage and updating a data file, without modifying page or component code
- **FR37:** The developer can update all visitor-facing copy in both languages by editing locale files, without modifying component code

## Non-Functional Requirements

### Performance

- **NFR1:** The Largest Contentful Paint (LCP) for the hero image on the home page must be less than 1.5 seconds on a simulated Swiss 4G connection, measured by Lighthouse
- **NFR2:** The Cumulative Layout Shift (CLS) score across all pages must be less than 0.1, measured by Lighthouse
- **NFR3:** The First Contentful Paint (FCP) must be less than 1.0 second on all static pages, achieved through SSG pre-rendering
- **NFR4:** The Interaction to Next Paint (INP) must be less than 200 milliseconds for all interactive elements
- **NFR5:** The initial JavaScript bundle size delivered to the client must not exceed 150kb gzip
- **NFR6:** Gallery images must be served in modern formats (WebP or AVIF) with responsive sizes appropriate to the requesting device's viewport
- **NFR7:** Gallery touch gesture response (pinch, swipe) must begin within one animation frame of the gesture starting — no perceptible lag between touch input and visual response

### Security

- **NFR8:** All API keys (Resend, Turnstile, R2) must be stored as server-side environment variables and must never be exposed to the client browser
- **NFR9:** Contact form submissions must be transmitted over HTTPS — no plaintext transport of visitor data
- **NFR10:** The Cloudflare Turnstile token must be verified server-side on every form submission — client-side validation alone is not sufficient
- **NFR11:** Contact form data must not be stored in any database or log file — it is transmitted to Sha's email inbox and exists nowhere else in the system

### Accessibility

- **NFR12:** The Lighthouse accessibility score must be ≥ 95 on all pages
- **NFR13:** All colour combinations of text on background must meet WCAG 2.1 AA contrast ratios: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components
- **NFR14:** All touch targets must be at minimum 44×44 CSS pixels
- **NFR15:** The site must be fully operable without a pointer device — all interactions must be achievable via keyboard alone
- **NFR16:** Gallery animations and physics must be suppressed for users with the `prefers-reduced-motion: reduce` media feature active

### Integration Reliability

- **NFR17:** Contact form submissions must be delivered to Sha's inbox with 100% success rate under normal operating conditions — Resend delivery failures must not silently discard submissions
- **NFR18:** The auto-response email must arrive in the visitor's inbox within 30 seconds of form submission under normal operating conditions
- **NFR19:** Cloudflare Turnstile widget must degrade gracefully if the third-party script fails to load — the form must remain submittable with server-side fallback handling
- **NFR20:** Image delivery from Cloudflare R2 must function independently of the CapRover application server — if the application is restarting, previously cached images remain available via CDN

### Reliability & Operations

- **NFR21:** The site must target ≥ 99% uptime, measured monthly — acceptable downtime is planned maintenance only
- **NFR22:** The Umami analytics goal event for form submission must fire on every successful submission from day one of launch — analytics data gaps are not acceptable for the primary KPI
- **NFR23:** All SSG-rendered pages must be served from cache — no page should require a live application server response for a standard gallery or content page load
- **NFR24:** The site must remain functional if the Umami analytics server is unreachable — analytics failure must not block page loads or form submissions




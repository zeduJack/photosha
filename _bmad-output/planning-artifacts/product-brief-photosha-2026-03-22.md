---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/planning-artifacts/research/market-photographer-portfolio-ux-design-research-2026-03-22.md'
date: '2026-03-22'
author: jack
---

# Product Brief: photosha

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

photosha is the portfolio website for Sha, a passionate Thai-Swiss photographer based in the Greater Zürich region, covering weddings, family, portrait, events, and landscape photography. Sha's work is exceptional — warm, real, and technically strong across all five niches. Her current site (photosha.ch, built in 2020 without professional design) does not reflect this quality. It fails to project Swiss market pricing, fails to stand out visually against competitors, and leaves potential premium clients with no compelling reason to choose her.

The solution is a ground-up rebuild: a custom Next.js portfolio site with bold editorial design, native mobile gallery UX (pinch-to-zoom, momentum, rubber-banding), and authentic bilingual DE/EN content — a site that shows Sha's photography the way it deserves to be shown, in a way no competitor in the Greater Zürich market currently does.

The business goal is clear: more inquiries from clients who arrive with Swiss price expectations and who bring the energy Sha loves working with — relaxed, easy-going, comfortable in front of a camera ("locker drauf, angenehme Atmosphäre"). Price flexibility remains Sha's personal choice to offer, not a signal the site should send.

---

## Core Vision

### Problem Statement

Sha's existing website (photosha.ch, 2020) was built without design expertise and has not been redesigned since. It no longer reflects the quality and breadth of her photography work. In a competitive Greater Zürich market where most photographers use visually interchangeable platform templates (Squarespace, Pixieset, Format), the bar for standing out is low — yet photosha.ch currently falls below it. The site does not communicate Swiss premium pricing, lacks a compelling visual identity, and provides no mobile-native gallery experience for the majority of visitors who arrive on mobile devices.

The practical consequence: Sha attracts a client base that does not match her capabilities or desired price point. Clients arrive through community channels — particularly the Thai community in Switzerland — with price expectations well below Swiss market rates. This is not a reflection of Sha's work quality; it is a direct consequence of a website that fails to position her in the right market segment.

### Problem Impact

- Revenue below market rate for equivalent work quality
- Client mix weighted toward community/referral rather than Swiss premium market
- Missing the international destination client segment (couples from abroad booking Swiss weddings)
- No differentiated online presence despite a strong, distinctive photography portfolio
- Mobile visitors — the majority — experience a degraded gallery that doesn't reflect the care in Sha's actual work

### Why Existing Solutions Fall Short

Platform-based sites (Squarespace, Pixieset, Showit) offer speed and convenience but impose template constraints that make visual differentiation impossible at scale. Every major competitor in the Greater Zürich market uses one of these platforms. Their sites are clean but interchangeable. None offer native mobile gallery UX. None present a bold editorial design language. None serve the bilingual DE/EN market authentically. A new platform site for Sha would be a lateral move — faster to build, but strategically equivalent to the current situation.

### Proposed Solution

A custom-built photography portfolio website for photosha — built on Next.js 16.2.1 with React 19, App Router, TypeScript, and Tailwind CSS — that delivers:

- **Editorial visual design** with bold typography, large-format image presentation, and a distinctive design language that immediately differentiates photosha from every platform-template competitor in Zürich
- **Native mobile gallery UX** — pinch-to-zoom, momentum scrolling, rubber-banding at edges — delivering an app-quality experience for the mobile-majority audience
- **Five curated niche galleries** (Portrait, Wedding, Event, Family, Landscape) — 15–20 images each, selected to attract ideal-fit clients in each category
- **Bilingual DE/EN** — authentic, natively written content in both languages serving Swiss domestic clients (German trust signal) and international destination clients (English access)
- **Conversion-optimised contact flow** — minimal-field form, Cloudflare Turnstile spam protection, Resend transactional email, instant auto-response
- **Cloudflare R2 image delivery** — fast, reliable, cost-effective image storage and CDN delivery
- **CapRover deployment** — self-hosted, full control

### Key Differentiators

1. **Mobile-native gallery UX** — unoccupied in the local market; the single largest unaddressed pain point for mobile visitors
2. **Editorial bold design** — occupies empty visual space in a market of minimal white templates
3. **Authentic bilingual DE/EN** — doubles the addressable client segment vs. single-language competitors
4. **Sha's personality front and centre** — warm, passionate, "locker drauf" energy expressed through About page and site tone; attracts the relaxed, easy-going clients Sha loves working with
5. **Custom build = premium signal** — for clients booking CHF 3,000–9,000+ sessions, a website that feels premium reinforces that the investment is worth it

---

## Target Users

### Primary Users

**Persona 1 — Lena & Marco, Swiss Wedding Couple**
Late 20s to mid-30s, Zürich region. Planning a wedding 9–14 months out. Not into stiff, formal photography — they want someone relaxed, easy to be around, who'll document their day authentically rather than pose them constantly. Found Sha on Instagram. Browse on mobile. Budget CHF 3,500–5,500. They'll visit 5–8 photographer websites before contacting anyone. The site must win a silent comparison they never announce.

*Journey:* Instagram → website → gallery browse → About page (personality check) → contact form. Decision made within 2–3 visits.

---

**Persona 2 — Sophie, Swiss Family / Portrait Client**
Mid-30s, Zürich or surrounding area. Referred by a friend who worked with Sha. A little camera-shy — worried the photos will look stiff or unnatural. Wants to feel comfortable, have fun, get images that actually look like her family. Budget CHF 500–900. Booking horizon 2–6 weeks. The About page and testimonials are her primary trust checkpoints — she needs to feel like Sha will *take care of her*, not just take photos of her.

*Journey:* Referral → website → About page first, then gallery → contact form. Fast decision if trust is established.

---

**Persona 3 — James & Mei, International Destination Wedding Couple**
He's British, she's Singaporean (or similar international pairing). Planning a wedding in Switzerland — Zürich, Alps, or lakeside. Found Sha via Google search, WPJA, or mywed.com. The website is their **only** touchpoint before inquiry — they can't meet Sha in person before deciding. Needs English-language content, international payment capability, clear process explanation, and a portfolio that shows Swiss locations. Budget CHF 5,000–9,000+. High-value, referred or search-discovered, not community-dependent.

*Journey:* Google/platform search → website (English) → gallery (Switzerland locations prominent) → process/FAQ → contact form. One shot to impress — no second visit likely.

---

**Persona 4 — Narin, Thai–Swiss Professional**
Thai woman, married to a Swiss professional, living in the Greater Zürich region. Part of the Thai community in Switzerland — knows Sha personally or through community connections. Financially operates at Swiss standards. Books Sha for family sessions, portraits, personal milestones. Appreciates Sha's cultural sensitivity and warmth. Likely to refer other Thai–Swiss couples and families. Currently may be booking at community rates — the new site signals premium positioning without losing this segment.

*Journey:* Direct referral → website (confirmation, not discovery) → contact. Price signal on the site reframes the conversation before inquiry.

---

**Persona 5 — HR Anna, Corporate Events Manager**
Events or HR manager at a mid-to-large Swiss company (Migros-scale or similar). Needs a photographer for company events — team days, milestones, product launches. Currently finds Sha through the Thai–Swiss professional network. Needs professional output: fast turnaround, specific file formats, usage rights clarity. Less emotional than consumer clients, more process and deliverable oriented. Budget is a company budget — less price-sensitive if the brief is met. This segment is currently underdeveloped on photosha.ch; a dedicated Events page with corporate examples would capture it explicitly.

*Journey:* Network referral → website (credibility check, events portfolio) → direct contact (phone or email preferred over form for corporate).

---

**Persona 6 — Beatrice, Birthday / Celebration Client**
Any age, any background. Wants to mark a personal milestone — 30th birthday, 40th, a special occasion — with something more meaningful than a phone photo. May want a photobook as a deliverable. Found Sha through community, Instagram, or referral. Not always aware that professional birthday photography is an option — the site can *create* this demand by showing it explicitly. Budget CHF 300–700. Emotionally driven booking.

*Journey:* Instagram or referral → website (sees birthday/event examples) → realises this is possible → contact form.

---

### Secondary Users

**Jack — Website Maintainer**
Technically capable developer (the person building the site). Updates content directly in code — no CMS required. Primary concern: gallery updates should be straightforward (adding new images to Cloudflare R2 without complex deployment steps). Will maintain bilingual content in both DE and EN.

**Sha — Photographer & Business Owner**
The primary beneficiary of the site. Does not update the site herself. Her input shapes the brief (photography style, personality, niche priorities). Her passion, warmth, and "locker drauf" energy must be reflected in the About page and site tone — this is not a corporate site, it is a personal brand.

---

### User Journey Summary

| Persona | Discovery Channel | Key Trust Checkpoint | Decision Speed |
|---|---|---|---|
| Lena & Marco | Instagram | Gallery + About page | 2–3 visits, 1–2 weeks |
| Sophie | Referral | About page + testimonials | 1 visit, days |
| James & Mei | Google / platform | English portfolio + process | 1 visit, fast |
| Narin | Community / personal | Website confirms premium | Instant (already decided) |
| HR Anna | Network referral | Events portfolio + credibility | Days, process-driven |
| Beatrice | Instagram / referral | Birthday/event examples | Impulse, days |

---

## Success Metrics

### What Success Looks Like

photosha.ch succeeds when it reliably converts visitors into genuine inquiries from clients who arrive with Swiss pricing expectations — and when those inquiry numbers grow over time without Sha needing to rely exclusively on community referrals for new business.

**Baseline:** No historical analytics data exists from the current site. All targets are forward-looking from launch.

### Business Objectives

**3-month target (post-launch):**
- 3–4 genuine inquiries per month via contact form
- At least 1 inquiry from a non-community discovery channel (Google search, Instagram cold traffic, or wedding platform)
- Analytics baseline established — enough data to identify which pages visitors drop off

**6-month target:**
- Average session duration > 2 min 30 sec (signals real engagement, above industry avg of 2:17)
- Bounce rate < 55% on mobile gallery pages
- At least 1 booking traceable to a non-community channel
- Contact form conversion rate ≥ 2% of all sessions

**12-month target:**
- 5–8 inquiries per month (organic growth through SEO compound effect)
- Referral bookings from satisfied non-community clients beginning to appear
- At least 1 international destination wedding inquiry
- Google Search Console showing local keyword impressions for primary target terms

### Key Performance Indicators

**Primary KPI — Contact form submissions per month**
The single most important number. Tracked via Umami goal event on form submission. Target: 3–4/month at launch, growing to 5–8 by month 12.

**Engagement KPIs (tracked via Umami):**
- Average session duration per page (target: >2:30 site-wide)
- Bounce rate per gallery category page (target: <55% on mobile)
- Top traffic sources (Instagram, Google, direct, referral) — reveals which channels are working

**SEO KPIs (tracked via Google Search Console — free, no privacy issue):**
- Impressions and clicks for: "Fotografin Zürich", "Wedding Photographer Zurich", "Familienfotograf Zürich Region"
- Average position for target keywords (target: top 10 within 12 months for primary terms)

**Adjustment signal:**
If average session duration is under 1:30 or bounce rate exceeds 70% on any gallery page → that page needs attention (load speed, image curation, or CTA placement).
If contact form submissions are below 2/month after 3 months → review pricing signal presence and About page strength.

### Analytics Stack

| Tool | Purpose | Cost | Privacy |
|---|---|---|---|
| Umami (self-hosted on CapRover) | Sessions, time on site, bounce rate, form conversions, traffic sources | Free | nFADS compliant, no cookie banner |
| Google Search Console | Keyword impressions, SEO ranking, crawl health | Free | No personal data collected |

No Google Analytics. No cookie consent banner required. Clean, professional, privacy-respecting — appropriate for a premium Swiss brand.

---

## MVP Scope

### Core Features

**Pages (9 total):**

| Page | Purpose |
|---|---|
| Home | Editorial hero, Sha's personality intro, niche preview with CTAs |
| Portrait | Curated gallery (15–20 images), "starting from CHF X" signal, testimonial, CTA |
| Wedding | Curated gallery (15–20 images), "starting from CHF X" signal, testimonial, CTA |
| Event | Curated gallery — corporate + Thai festivals + birthdays (15–20 images), service description mentioning photobooks, CTA |
| Family | Curated gallery (15–20 images), "starting from CHF X" signal, testimonial, CTA |
| Landscape | Curated gallery (15–20 images), CTA |
| About | Sha's story, values, personality ("locker drauf" energy), portrait photo of Sha |
| Contact | Minimal form (Name, Email, Session type, Approximate date, Message), Cloudflare Turnstile, Resend delivery, auto-response |
| Impressum + Privacy | nFADS/GDPR-compliant legal pages (DE primary, EN secondary) |

**Technical requirements (all MVP):**
- Next.js 16.2.1, React 19, App Router, TypeScript, Tailwind CSS
- Native mobile gallery UX: pinch-to-zoom, momentum scrolling, rubber-banding at edges
- Cloudflare R2 image storage + CDN delivery
- Bilingual DE/EN with Next.js i18n routing — full content parity, natively written (not translated)
- Resend transactional email + Cloudflare Turnstile spam protection
- CapRover deployment
- Umami analytics (self-hosted on CapRover) — form submission goal tracking
- Google Search Console integration (sitemap.xml, robots.txt, metadata)
- SEO: page-level metadata, Open Graph tags, structured data for local business

**Pricing signals:** "Starting from CHF X" on Portrait, Wedding, Event, Family pages. No dedicated pricing page.

**Photobooks:** Mentioned in Event page service description. No dedicated page.

**Testimonials:** 3–5 at launch, placed near CTAs on category pages. Collected from Sha's existing client base before launch.

### Out of Scope for MVP

| Feature | Rationale |
|---|---|
| Blog / journal | High SEO value long-term, but zero content at launch — adds no value to MVP |
| Dedicated pricing page | "Starting from CHF X" signals are sufficient for MVP; full packages in v2 |
| Dedicated birthday landing page | Covered under Event for MVP; own page when volume warrants it |
| Dedicated corporate/B2B landing page | Covered under Event for MVP |
| Private client gallery portal | Sha can deliver via third-party (WeTransfer, Pixieset free tier) for now |
| Online booking / calendar integration | Contact form is sufficient for MVP inquiry volume |
| Photobook ordering / showcase | Too early — service not yet web-promoted |
| Video content (BTS, reels) | Desirable later; no content exists at launch |

### MVP Success Criteria

The MVP is considered successful and ready for iteration when:
- All 5 gallery categories live with curated image selection (15–20 per category)
- Native mobile gallery UX fully functional on iOS and Android
- Bilingual DE/EN complete with natively written copy in both languages
- Contact form delivering to Sha's inbox reliably with auto-response confirmed
- Umami tracking form submissions from day one
- 3–4 inquiries per month achieved within 3 months of launch
- At least 1 inquiry from outside the Thai community within 3 months

### Future Vision

**v1.1 — 3–6 months post-launch:**
- Blog/journal section for SEO growth (real shoot stories, Swiss location features)
- Dedicated Birthday landing page if Event category generates specific inquiry volume
- Pricing page with full package breakdowns once Sha has settled on her pricing structure

**v1.2 — 6–12 months:**
- Dedicated Corporate/Events B2B page with Migros-scale client references
- Private client gallery portal (replacing third-party delivery)
- Online booking / availability calendar

**v2.0 — 12+ months:**
- Photobook showcase and ordering
- Video integration (shoot day recaps, BTS reels embedded from Instagram)
- Expansion to national Swiss market beyond Greater Zürich if analytics show demand

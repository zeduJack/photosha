---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-photosha-2026-03-22.md'
  - '_bmad-output/planning-artifacts/research/market-photographer-portfolio-ux-design-research-2026-03-22.md'
---

# UX Design Specification photosha

**Author:** jack
**Date:** 2026-03-22

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

photosha is a custom portfolio website for Sha, a Thai-Swiss photographer based in the Greater Zürich region. The site replaces an outdated 2020 website that fails to project Swiss market pricing or stand out visually against competitors. The UX goal is singular: convert more visitors into genuine inquiries from clients who arrive with Swiss pricing expectations.

The primary design register is **Quiet Luxury** — restrained, spacious, typographically precise. The photography is the hero. The design creates the conditions for the work to land with full impact, then steps back. Every UX decision is evaluated against one question: does this make the photography feel more valuable, or less?

### Target Users

Six personas, two distinct trust journeys:

**Cold traffic** (must be won on first visit): Swiss wedding couples (mobile, Instagram-referred), international destination clients (Google/platform-referred, English-speaking, one shot to impress), birthday/celebration clients (impulse-driven, discover the option on site).

**Warm traffic** (site confirms an existing decision): Thai–Swiss professionals (community-referred, need premium price signal to reframe expectations), Swiss family/portrait clients (referral-driven, About page is the trust checkpoint), corporate event clients (network-referred, need events portfolio and credibility signals).

**Primary device:** Mobile. The gallery experience on mobile is the product's most important UX surface and its clearest competitive differentiator.

### Key Design Challenges

1. **Native mobile gallery** — pinch-to-zoom, momentum scrolling, rubber-banding at edges. Must feel like a native iOS/Android app. No competitor in the Zürich market offers this. Technically the most complex UX requirement; also the most visible differentiator.
2. **Editorial navigation without friction** — quiet luxury design uses negative space and large type, which can obscure wayfinding. Challenge: make it feel like a premium magazine *and* be instantly navigable on mobile.
3. **Bilingual DE/EN without visual disruption** — language switching must feel natural and not break the typographic composition or layout rhythm.
4. **Conversion at the right moment** — CTAs placed at natural end-of-engagement points, not interrupting the browsing experience. Single CTA per page.
5. **Pricing signal integration** — "Starting from CHF X" must appear on category pages without feeling transactional or cheap against the premium visual register.

### Design Opportunities

1. **Mobile gallery as signature experience** — the first time a visitor pinches to zoom on a photo and feels the rubber-band resistance, they understand immediately that this site is different. This moment is unoccupied in the local market.
2. **White space as premium signal** — competitors' platform templates are visually crowded. Sha's site uses restraint as a differentiator. Less is a statement.
3. **Typography as personality** — in a quiet luxury register, the typeface choice carries the personality that the layout won't. A distinctive editorial typeface does the work of expressing character without decoration.
4. **About page as the warm counterpoint** — the rest of the site is quiet and restrained; the About page is where Sha's warmth and passion come through in full. This contrast makes both stronger.

---

## Core User Experience

### Defining Experience

The core loop of photosha is: **Find → See → Feel → Contact.**

A visitor finds Sha via Google Search ("Fotografin Zürich", "Hochzeitsfotograf Zürich"), lands on the site, browses the work, forms an emotional connection, and submits an inquiry. Every design decision exists to serve this loop or get out of its way.

The gallery browse is the product. When a visitor loses track of time looking at Sha's photography, contact is a natural conclusion. When it doesn't happen — when the gallery feels like a web page — the visitor leaves and tries the next result.

The single most important interaction: **a gallery photo landing with full visual impact**, whether on a phone screen or a 27-inch monitor. On desktop, that means edge-to-edge imagery with room to breathe. On mobile, it means native touch physics — smooth pinch-to-zoom, momentum, rubber-banding — that make the experience feel premium and considered.

### Platform Strategy

**Mobile-first in build priority; excellent on both.**

**Why mobile-first:**
- Google uses mobile-first indexing — SEO rankings are determined by the mobile version
- Initial discovery (quick Google search, Instagram second touchpoint) happens predominantly on mobile
- First impressions form on mobile; a poor mobile experience loses the visitor before they ever reach a desktop

**Why desktop must be equally strong:**
- High-consideration purchases (CHF 3,500–9,000+ wedding bookings) involve serious evaluation — comparing 5–10 photographers, looking at work at full resolution, reading the About page carefully
- Couples research together on a shared screen
- A desktop gallery that shows photographs at full scale with proper breathing room is itself a premium signal
- Contact form completion for considered inquiries often happens on desktop

**Input model:** Touch (mobile/tablet) and mouse/keyboard (desktop) both first-class. No interaction pattern works on only one.

**Performance baseline:** Images via Cloudflare R2 + CDN. Sub-1-second first image load on Swiss 4G and home broadband. Next.js Image optimization + responsive srcset mandatory.

**Language:** Bilingual DE/EN via Next.js i18n. Language state persists across navigation. Switcher always accessible, never visually dominant.

### Effortless Interactions

These must require zero conscious effort:

- **Mobile gallery:** swipe between photos, pinch-to-zoom with native physics (momentum, rubber-banding, smooth deceleration)
- **Desktop gallery:** keyboard arrow navigation, full-screen lightbox, smooth image transitions
- **Category navigation:** one tap/click to move between Portrait, Wedding, Event, Family, Landscape — always visible
- **Language switch:** one action, immediate, no page reload
- **Contact form:** keyboard-friendly on mobile, logical tab order on desktop, submit button never hidden below fold

### Critical Success Moments

**Moment 1 — First image loads instantly**
Sub-1-second on both mobile and desktop. A slow first load breaks the impression before it forms.

**Moment 2 — Gallery interaction feels native**
On mobile: first pinch-to-zoom feels like a native app, not a web approximation.
On desktop: full-screen image fills the monitor with no chrome, no distraction.

**Moment 3 — About page creates personal connection**
The visitor reads about Sha and thinks "I want to work with this person." This is the primary booking trigger. Failure here loses the booking at the final stage.

**Moment 4 — Contact form completes without friction**
Visitor submits, receives immediate auto-response. A broken or confusing form destroys a conversion that survived every previous step.

### Experience Principles

1. **Photography first** — if a design element competes with a photograph for attention, the design element loses.
2. **Both screens, one standard** — mobile and desktop receive equal design attention; neither is an afterthought.
3. **Friction is a conversion risk** — every extra tap, scroll, or form field between a visitor and sending an inquiry is a potential dropout.
4. **Restraint signals premium** — white space, typographic precision, and the absence of decoration communicate the same value as the photography itself.
5. **One next step per screen** — no page presents two competing primary actions. Every screen has a single clear path forward.

---

## Desired Emotional Response

### Primary Emotional Goals

A visitor to photosha should move through three emotional states in sequence:

**1. Awe** — "These photos are beautiful."
The first gallery image loads and the visitor stops scrolling. This is not just appreciation — it is the involuntary pause that precedes genuine consideration. Without this moment, nothing else matters.

**2. Recognition** — "This is exactly what I want."
As the visitor browses more work, they see themselves in the photographs. The wedding couple sees intimacy and light that matches their vision. The family client sees natural, unposed moments. This is the psychographic filter working as intended — the right client sees themselves; the wrong client self-selects out.

**3. Confidence** — "I can trust this person with my important day."
After the About page, the testimonials, the clear process — the visitor feels certain. Not just that Sha is talented, but that she is the right choice. This confidence is what converts awe into an inquiry.

### Emotional Journey Mapping

| Stage | Persona state arriving | Target emotion | Design lever |
|---|---|---|---|
| Landing — first image | Evaluating, comparing | Awe, arrested attention | Full-bleed hero, instant load, no chrome |
| Gallery browse | Curious, hopeful | Recognition, desire | Curated images that mirror ideal-client scenarios |
| Pricing signal | Anxious about cost | Relief, accessibility | "Starting from CHF X" — calm, clean, not apologetic |
| About page | Uncertain about fit | Warmth, connection | Sha's story, real portrait photo, personal voice |
| Testimonials | Seeking validation | Trust, certainty | Named testimonials with context, near CTAs |
| Contact form | Ready, slightly nervous | Ease, welcome | Conversational framing, minimal fields, instant confirmation |
| Auto-response received | Waiting, hopeful | Reassurance | Warm, personal tone — not a corporate acknowledgement |

### Micro-Emotions

These smaller emotional moments determine whether a visitor stays or leaves:

- **"This loads fast"** → implicit trust in professionalism (performance = care)
- **"I can zoom in properly"** → delight, native-feeling interaction signals premium
- **"The photos look real, not staged"** → relief for camera-shy clients (Sophie persona)
- **"She sounds human"** → warmth on About page, Sha's voice not a PR bio
- **"I can see the price range"** → relief, no fear of wasting anyone's time
- **"That was easy"** → after contact form submission, no regret, no second-guessing

**Emotions to actively avoid:**
- Price anxiety → mitigated by "starting from" signals appearing before the CTA
- Overwhelm → single CTA per page, curated galleries not dumps
- Distrust → testimonials, Impressum, GDPR notice, professional tone
- Confusion → clear navigation, obvious language switcher, visible category labels

### Design Implications

| Target emotion | UX design approach |
|---|---|
| Awe | Full-bleed images, minimal UI chrome during gallery view, generous white space around photos |
| Recognition | Per-niche gallery curation — show the work each persona wants to see themselves in |
| Relief | Pricing signal styled as informational, not promotional — same weight as body text |
| Warmth | About page breaks the Quiet Luxury restraint intentionally — warmer tones, candid portrait of Sha |
| Trust | Testimonials with name + context placed directly above or below primary CTA on each page |
| Ease | Contact form: 5 fields maximum, conversational placeholder copy, no asterisks, instant confirmation |
| Delight | Mobile gallery: native pinch-to-zoom with rubber-banding — the one moment of technical surprise |

### Emotional Design Principles

1. **Earn awe before asking for action** — no CTA appears before the visitor has seen at least one full gallery image
2. **Recognition is more powerful than persuasion** — curation that mirrors the ideal client's vision converts better than any copy
3. **Anxiety is the enemy of inquiry** — every pricing, process, and form decision should reduce, not defer, client anxiety
4. **Warmth lives on the About page** — the rest of the site is restrained; the About page is the emotional counterweight
5. **Delight must be earned** — the mobile gallery interaction is the one "wow" moment; it works because everything around it is calm

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Editorial Magazines — Kinfolk, Monocle, Wallpaper\***

These publications succeed because they treat white space as content, not absence. The UX principles:

- **Pacing is designed, not accidental** — slow scroll rhythm is engineered through image scale and paragraph spacing; the reader doesn't rush because the layout doesn't push
- **Typography is navigation** — oversized section headers and pull quotes guide the eye without traditional nav chrome; the hierarchy is spatial, not mechanical
- **Full-bleed photography is the rule** — images escape their containers; text wraps around the work, not the other way around
- **One story per spread** — no competing content units on a single viewport; editorial focus = one thing at a time
- **Restraint signals curation** — what's left out is as deliberate as what's included; the magazine doesn't try to show everything

**Luxury Brand Sites — Bottega Veneta, Aesop, The Row**

These brands use UX to communicate the price point before a single product is seen:

- **Absence of decoration is the design** — no promotional banners, no countdown timers, no urgency triggers; the site is quiet because the brand is confident
- **Single primary action per screen** — no page competes with itself; there is always exactly one clear next step, and it is never pushed
- **Photography as product** — product shots fill the viewport; the UI (navigation, cart) recedes to the minimum required to function
- **Generous padding signals quality** — crowding = cheap; room to breathe = premium; this is the direct visual equivalent of a luxury retail store's floor plan
- **Navigation doesn't announce itself** — present but never dominant; users find it when they need it; it doesn't interrupt the browsing experience

**Photographer Portfolio Sites — Jonas Peterson, Jose Villa, KT Merry**

These are the benchmark references for the gallery-first portfolio:

- **The UI disappears when you're looking at the work** — logo and nav are present but visually recessive; the photographer's name and category labels are legible, not decorative
- **Gallery architecture is category-first** — all navigation begins with the niche (Wedding, Portrait, etc.); visitors self-sort before engaging
- **Lightboxes feel inevitable** — the transition from grid to full-screen is smooth and unmotivated; no jarring cut; the image expands as if it was always meant to fill the screen
- **About pages break the visual register deliberately** — the warm, human portrait of the photographer is the designed contrast to the restrained gallery; this contrast makes both sections stronger
- **Trust signals are near the CTA** — testimonials and process notes appear adjacent to the contact entry point, not buried in a separate page

---

### Transferable UX Patterns

**Navigation Patterns**

- **Recessive top navigation** (magazines + luxury brands) — logo left, 4–5 category links centre or right, language switcher right; all at small text weight; disappears on scroll, reappears on scroll-up. Applies to photosha's primary nav.
- **Category-first architecture** (photographer peers) — the five niches (Portrait, Wedding, Event, Family, Landscape) are the primary navigation; no intermediate landing page; one click from anywhere to a gallery. Eliminates friction in the Find phase.
- **Floating minimal nav on mobile** (luxury brands) — bottom-anchored or top-anchored minimal strip with category labels only. Keeps navigation accessible without competing with gallery imagery.

**Interaction Patterns**

- **Single CTA per viewport** (luxury brands + editorial) — no page presents two competing primary actions. Every screen has one path forward. Applies to all 9 photosha pages.
- **Deliberate scroll pacing** (editorial magazines) — section breaks, large white space, and image scale create natural pause points. The visitor doesn't scroll past the work; they stop with it.
- **Lightbox-first gallery viewing** (photographer peers) — tap/click any image → full-screen lightbox with keyboard/swipe navigation. The grid is the index; the lightbox is the experience.
- **Native touch gallery physics** (technical requirement) — pinch-to-zoom, momentum, and rubber-banding that makes mobile gallery feel like a native app. The one technical differentiator unoccupied in the Zürich market.

**Visual Patterns**

- **White space as premium signal** (all three categories) — padding and margin at 1.5–2× what platform templates use. Supports the Quiet Luxury register and the Awe emotional goal.
- **Typography-led hierarchy** (editorial magazines) — section headers large enough to read from a distance; body text small enough to recede. The visual hierarchy is felt before it is read.
- **About page as designed contrast** (photographer peers) — warmer tone, softer palette, personal portrait of Sha. The rest of the site is restrained; the About page is the emotional counterweight.
- **Pricing signal styled as body text** (luxury brands) — "Starting from CHF X" at the same visual weight as descriptive copy; never a badge, callout, or promotional treatment.

---

### Anti-Patterns to Avoid

- **Platform template visual sameness** — Squarespace/Pixieset/Format aesthetic: interchangeable grid layouts, generic serif/sans combinations, templated nav structure. Every major Zürich competitor uses this. Adopting any element erases the differentiation.
- **Thumbnail grid fragmentation** — showing 20+ small images in a tight grid fragments the visual experience; visitors process the grid as information, not emotion. Images must appear at a scale that creates the Awe response.
- **Multiple competing CTAs** — two buttons on one screen split attention and dilute both. One CTA per screen, always.
- **Pop-up interruption patterns** — newsletter overlays, discount modals, exit-intent prompts. Any interruption destroys the Quiet Luxury register and breaks the Awe → Recognition → Confidence journey. The Umami/nFADS analytics stack makes cookie consent pop-ups unnecessary.
- **Auto-play media** — background video, auto-playing audio, animated hero banners. Competes with the photography and adds performance weight.
- **CV-style About page** — listing credentials, awards, and technical camera specs. Visitors don't book credentials; they book people. The About page expresses Sha's personality and warmth.
- **Navigation that competes with imagery** — oversized nav links, bright nav backgrounds, persistent nav bars overlaid on gallery images. The nav should be invisible until needed.

---

### Design Inspiration Strategy

**What to Adopt**

- **Editorial white space and typographic hierarchy** (from magazines) — the visual foundation of the Quiet Luxury register and the single strongest differentiator from platform templates
- **Single CTA per screen** (from luxury brands) — friction is the primary conversion risk; competing actions reduce conversion
- **Gallery-first category architecture** (from photographer peers) — the gallery is the product; navigation must lead there immediately and get out of the way
- **About page as emotional contrast** (from photographer peers) — the Warmth and Connection emotional goals cannot be achieved within the restrained visual register; the About page is where Sha's personality has full expression

**What to Adapt**

- **Magazine editorial pacing** → adapted to vertical mobile-first scroll; the pacing principles apply, the horizontal axis does not
- **Luxury brand restraint** → adapted from product pages to gallery category pages; the visual logic (photography fills viewport, UI recedes) transfers exactly; commerce mechanics do not
- **Lightbox interaction model** (from photographer peers) → enhanced with native mobile touch physics; the interaction concept is proven, the execution is differentiated

**What to Avoid**

- Any visual element borrowed from platform templates (Squarespace, Pixieset) — even good individual choices become contaminated by association with the template aesthetic
- Interruption UX patterns — pop-ups, overlays, urgency signals — incompatible with the Quiet Luxury register and the emotional journey
- Thumbnail-scale gallery presentation — if images can't create the Awe response at the scale they're shown, they should not be shown at that scale

---

## Design System Foundation

### Design System Choice

**Custom design system built on Tailwind CSS + Headless UI primitives**

Zero imported visual styles from any component library. Every design decision — colour, typography, spacing, component shape — is custom to photosha. Tailwind CSS provides the utility foundation; Radix UI (or equivalent headless library) provides accessible, unstyled interactive primitives for complex interactions (lightbox, dialogs, focus management).

| Layer | Tool | Purpose |
|---|---|---|
| Utilities | Tailwind CSS | Spacing, type scale, responsive layout |
| Design tokens | `tailwind.config.ts` | Colour palette, font families, custom spacing scale |
| Headless primitives | Radix UI | Accessible lightbox focus-trapping, keyboard nav, dialogs |
| Touch physics | Custom (use-gesture or react-spring) | Native pinch-to-zoom, momentum scrolling, rubber-banding |
| Visual styles | 100% custom | No MUI, Chakra, shadcn/ui, or any design-system aesthetic defaults |

### Rationale for Selection

- **Visual differentiation is the core product** — all major Zürich competitors use Squarespace, Pixieset, or Format, which derive their aesthetic from the same pool of component libraries (MUI, Chakra). Any imported visual style risks importing the template aesthetic that photosha must not resemble.
- **Tailwind CSS is already the stack** — the project is initialised on Next.js + Tailwind; a custom design system built on this foundation requires no additional toolchain, no conflicts, no framework migrations.
- **Headless primitives solve the hard problems correctly** — the mobile gallery lightbox requires focus trapping, keyboard navigation (arrow keys), escape-to-close, and scroll-lock. Implementing these accessibly from scratch is error-prone. Headless UI handles the behaviour; the visual design remains entirely custom.
- **Jack is a capable developer** — no scaffolding shortcuts are needed. The cost of building custom is appropriate given the differentiation requirement.

### Implementation Approach

1. **Design tokens first** — define the complete token set in `tailwind.config.ts` before writing any component code: primary colour palette, typographic scale, spacing scale, border radii, shadow values, breakpoints.
2. **Component inventory** — identify all UI components required across 9 pages before building. Build each once; reuse consistently. No ad-hoc one-off styles.
3. **Mobile-first throughout** — all Tailwind classes written mobile-first; responsive variants applied upward. No desktop-first overrides.
4. **Typography system** — select typefaces and define the complete type hierarchy (display, heading 1–3, body, caption, label, pricing signal) as named Tailwind utilities before layout work begins.

### Customization Strategy

- **Colour palette**: Near-white background, near-black text, single muted accent (warm grey or dusty sage — TBD in visual design step). No vibrant accent colours; the photography provides all colour.
- **Typographic contrast**: One editorial serif or high-contrast sans for display/headings; one neutral sans for body. The pairing creates personality through contrast, not decoration.
- **Spacing scale**: Extended Tailwind spacing scale with larger values (24, 32, 40, 48, 64 units) to achieve the editorial white space that signals premium.
- **No design-system shadows or elevation** — flat design only. No card shadows, no lifted components. Elevation is communicated through whitespace and scale, not CSS box-shadow.
- **Imagery as the only decoration** — no background patterns, no gradient fills, no decorative SVG elements. Photography does the visual work.

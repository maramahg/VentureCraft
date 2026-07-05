# VentureCraft Homepage Redesign — Current State & Context

## Project Overview

**VentureCraft** is an international deep-tech startup competition by KFUPM (King Fahd University of Petroleum & Minerals) in collaboration with DTV (Dhahran Tech Valley). The competition offers a $245K prize pool and targets student-led ventures building science and technology-based solutions with global impact.

**Website**: Next.js 16 + React 19 + Tailwind CSS 4 + Framer Motion + react-globe.gl + @react-three/fiber

**Brand constraints**: Colors and fonts must remain unchanged:
- Colors: `--color-vc-mint: #4FD1C5`, `--color-vc-teal: #00A383`, `--color-vc-green-dark: #00201D`, `--color-vc-green-medium: #003833`
- Font: Poppins (via `--font-poppins` CSS variable)

## The Task

The user was tasked by their team to **totally redesign the homepage** to make it more modern, visually engaging, and credible. The specific requirements from the team/reviewers:

1. **Revolutionary redesign** — not incremental polish. The layout, structure, and visual language should feel like a brand new site.
2. **3D elements** — The team specifically wants 3D visual elements, particularly the existing globe component.
3. **Scroll-related animations** — Dynamic scroll-driven animations throughout the page.
4. **Images for credibility** — Reviewers gave feedback that the website needs real imagery to prove the competition is legitimate and not fake. Currently using stock photos from Unsplash (no real event photos available yet).
5. **Reference sites** — A reviewer instructed to study these 3 well-known global competitions and extract ideas for structure, tabs, and design:
   - **MIT 100K** (https://www.mit100k.org/) — 3-phase narrative (Pitch → Accelerate → Launch), past participants showcase, Gallery tab
   - **Hult Prize** (https://www.hultprize.org/) — Big stats banner, winner stories with photos/quotes, "Get Involved" section (compete/mentor/sponsor)
   - **Esports World Cup** (https://esportsworldcup.com/en) — Full-screen video hero with countdown, progress visualization, partner logos

## What Was Done (Current State)

The homepage was completely restructured. Here's the current section order and what each component does:

### 1. `GlobeHero` (components/GlobeHero.tsx)
- Full-screen hero with a **stock image background** (startup pitch scene from Unsplash)
- **Mouse-reactive parallax** on all layers: background image, glow orbs, text, and 3 floating glass stat cards
- **Blur-to-focus staggered entrance** — all text elements animate in from blurred to sharp, sequentially
- **3 floating glass stat cards** ($245K Prize Pool, 130+ Countries, 50+ Mentors) positioned around hero edges, drifting with mouse at different parallax depths (desktop only)
- **Ken Burns zoom** on background image (20s loop)
- **Rotating light beams** — conic gradient slowly rotating behind text
- **Floating glow orbs** in brand colors with mouse parallax
- **Subtle grid lines** overlay
- Headline: "Venture Craft" in 9xl font, "Craft" has pulsing glow animation
- CTA buttons: "Discover More" (with shimmer effect) + "Registration Closed"
- Partner logos (KFUPM + DTV) at bottom
- Scroll indicator with expanding ring animation
- **User feedback**: "the hero section looks fine but it's not that attractive" and "you can do better" — the user wants something that really grabs attention and makes users focus on the hero

### 2. `StatsBanner` (components/StatsBanner.tsx)
- Hult Prize-style animated counter strip
- 4 glass cards: $245K Prize Pool, 130+ Countries, 50+ Mentors, 6 Competition Phases
- Numbers count up from 0 when scrolled into view

### 3. `GlobeNarrative` (components/GlobeNarrative.tsx)
- **The centerpiece** — the globe is sticky/fixed while you scroll through 6 timeline phases
- Each phase card slides in alternately from left/right with description
- Progress dots on the right track which phase you're viewing
- The globe stays visible behind the cards throughout
- 6 phases: Idea Submission → Screening → Online Bootcamp → Finalist Notification → Acceleration Program → Final Competition
- Uses the existing `react-globe.gl` globe component (same colors/style)

### 4. `CredibilityGallery` (components/CredibilityGallery.tsx)
- Bento-style image grid with 5 stock photos (pitching, mentorship, deep-tech, teamwork, global network)
- Hover effects with scale and teal tint
- Addresses the reviewer's credibility feedback

### 5. `Prizes` (components/Prizes.tsx)
- Existing component with animated count-up prize amounts ($100K, $60K, $40K)
- Scroll-triggered podium rise animation

### 6. `GetInvolved` (components/GetInvolved.tsx)
- 3 cards with stock images and icons: Compete, Mentor, Sponsor
- Each card has image, icon badge, description, and CTA link
- Inspired by Hult Prize's "Get Involved" section

### 7. `CallToAction` + `Footer`
- Existing components, unchanged

### Other new components:
- `ScrollProgress` (components/ScrollProgress.tsx) — Spring-animated gradient progress bar at top of page

## What Was Removed (from original homepage)
- `HeroScrollDemo` — old hero with globe in a side column (replaced by GlobeHero)
- `ParticleField3D` — R3F particle background (removed, globe is now the visual hero)
- `ThreePillarRow` — 3 interactive pillars (replaced by GetInvolved)
- `AnnualTheme` — annual theme section (removed)
- `Timeline` — old horizontal timeline (replaced by GlobeNarrative)
- Decorative pattern images (no longer needed)

## Current Issues / Open Questions

1. **Hero attractiveness** — The user said the hero "looks fine but it's not that attractive" and wants something that really makes users focus. Multiple iterations were done (basic image → added animations → added mouse parallax + floating cards), but the user still said "you can do better." This is the main unresolved issue.

2. **Globe usage** — The globe was initially used in both the hero and the narrative section (redundant). User pointed this out. Now the globe is only in `GlobeNarrative`. The hero uses a stock image instead.

3. **Stock imagery vs real photos** — No real event photos are available. All images are from Unsplash. This may not fully satisfy the reviewers' credibility concern.

4. **Overall cohesiveness** — The page has many sections but the transitions between them and the overall visual flow may need refinement.

## Tech Stack Details

```
Next.js 16.1.2, React 19.2.3, Tailwind CSS 4, Framer Motion 12.26.2
react-globe.gl 2.37.0, @react-three/fiber 9.5.0, @react-three/drei 10.7.7
lucide-react 0.562.0, three 0.182.0
```

**Image config**: Unsplash is whitelisted in `next.config.ts` for `next/image` optimization.

## File Structure (key files)

```
app/
  page.tsx              — Main homepage (assembles all sections)
  layout.tsx            — Root layout (Navbar, Cursor, Poppins font)
  globals.css           — Brand colors, glass-panel/glass-card styles, scrollbar

components/
  GlobeHero.tsx         — Full-screen image hero with mouse parallax + floating stats
  StatsBanner.tsx       — Animated counter strip
  GlobeNarrative.tsx    — Sticky globe with scroll-driven timeline cards
  CredibilityGallery.tsx — Bento image grid (stock photos)
  GetInvolved.tsx       — 3 path cards (Compete/Mentor/Sponsor)
  Prizes.tsx            — Prize podium with count-up
  ScrollProgress.tsx    — Top progress bar
  CallToAction.tsx      — Final CTA section
  Footer.tsx            — Footer
  ui/globe.tsx          — react-globe.gl globe component (brand colors)
```

## Original Homepage Structure (before redesign)

For reference, the original homepage had:
1. `HeroScrollDemo` — Two-column layout: text on left, globe on right (smaller, decorative)
2. `Prizes` — Prize amounts
3. `ThreePillarRow` — 3 interactive expandable pillars
4. `AnnualTheme` — Annual theme with clickable pillars
5. `Timeline` — Horizontal timeline with phase clicks
6. `CallToAction` — CTA section
7. `Footer`

The original design was text-heavy with no images, simple fade-in animations, and the globe was just a decorative side element.

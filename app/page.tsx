'use client';

import dynamic from 'next/dynamic';
import ScrollProgress from '../components/ScrollProgress';
import { VentureSignalHero } from '../components/home-a/VentureSignalHero';
import Footer from '../components/Footer';

const CompetitionJourney = dynamic(() => import('../components/home-a/CompetitionJourney'));
const PrizePool          = dynamic(() => import('../components/home-a/PrizePool'));
const ThemePillars       = dynamic(() => import('../components/ThemePillars'));
const StickyGlobeTimeline = dynamic(() => import('../components/home-a/StickyGlobeTimeline'));
const ProofWall          = dynamic(() => import('../components/home-a/ProofWall'));
const ProofStrip         = dynamic(() => import('../components/home-a/ProofStrip'));
const GoalsVisionTeaser  = dynamic(() => import('../components/home-a/GoalsVisionTeaser'));
const BenefitsTeaser     = dynamic(() => import('../components/home-a/BenefitsTeaser'));
const GetInvolvedTeaser  = dynamic(() => import('../components/home-a/GetInvolvedTeaser'));
const PartnersTeaser     = dynamic(() => import('../components/home-a/PartnersTeaser'));
const FinalCTA           = dynamic(() => import('../components/home-a/FinalCTA'));

// Note: nothing is deleted — every section stays reachable.
// - StickyGlobeTimeline (6-phase rotating arc cards) is restored on the homepage
//   AND also available at /timeline.
// - VentureAreas (Deep Tech Focus Areas) lives on /about/venture-craft, with a
//   condensed teaser folded into ProofWall's credibility block.
// - GetInvolvedTabs (full interactive version) lives on /about/venture-craft;
//   GetInvolvedTeaser gives it lightweight homepage visibility.
// - PartnersOrganizers (full version) lives on /sponsors; PartnersTeaser gives
//   it lightweight homepage visibility.
// - AboutObjectives (full version) lives on /about/venture-craft;
//   GoalsVisionTeaser gives it lightweight homepage visibility.

export default function DesignA() {
  return (
    <main className="min-h-screen flex flex-col overflow-clip" style={{ background: '#0B2A24' }}>
      <ScrollProgress />

      {/* 1. Cinematic hero — globe, Dhahran signal arcs, mouse parallax stats */}
      <VentureSignalHero />

      {/* 2. Immediate credibility — organizer badges + count-up stats */}
      <ProofStrip />

      {/* 3. Financial prizes — first major hook after the hero */}
      <PrizePool />

      {/* 4. Theme Pillars — 4 strategic pillars as they are on the site */}
      <ThemePillars />

      {/* 5. Competition journey / three-stage overview, with link to full 6-phase timeline */}
      <CompetitionJourney />

      {/* 6. Full 6-phase timeline — rotating stacked semi-circle arc cards */}
      <StickyGlobeTimeline />

      {/* 7. Credibility — KFUPM/DTV + condensed Deep-Tech focus areas */}
      <ProofWall />

      {/* 8. Goals / Vision — compact, elegant */}
      <GoalsVisionTeaser />

      {/* 9. Additional Benefits — compact icon row */}
      <BenefitsTeaser />

      {/* 10. Lightweight teaser into the five Get Involved paths */}
      <GetInvolvedTeaser />

      {/* 11. Lightweight organizer/partner strip */}
      <PartnersTeaser />

      {/* 12. Contact / Final CTA */}
      <FinalCTA />

      <Footer />
    </main>
  );
}

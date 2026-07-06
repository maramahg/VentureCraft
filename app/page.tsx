'use client';

import dynamic from 'next/dynamic';
import ScrollProgress from '../components/ScrollProgress';
import { VentureSignalHero } from '../components/home-a/VentureSignalHero';
import Footer from '../components/Footer';

const CompetitionJourney= dynamic(() => import('../components/home-a/CompetitionJourney'));
const PrizePool         = dynamic(() => import('../components/home-a/PrizePool'));
const ProofWall         = dynamic(() => import('../components/home-a/ProofWall'));
const FinalCTA          = dynamic(() => import('../components/home-a/FinalCTA'));

// Note: StickyGlobeTimeline, VentureAreas, GetInvolvedTabs and PartnersOrganizers
// were removed from the homepage flow to reduce clutter per client feedback.
// Their content has been reorganized, not deleted:
// - StickyGlobeTimeline duplicated CompetitionJourney's six stages and is retired.
// - VentureAreas (Deep Tech Focus Areas) now lives on /about/venture-craft, with a
//   condensed teaser folded into ProofWall's credibility block.
// - GetInvolvedTabs now lives on /about/venture-craft.
// - PartnersOrganizers now lives on /sponsors.

export default function DesignA() {
  return (
    <main className="min-h-screen flex flex-col overflow-clip" style={{ background: '#0B2A24' }}>
      <ScrollProgress />

      {/* 1. Cinematic hero — globe, Dhahran signal arcs, mouse parallax stats */}
      <VentureSignalHero />

      {/* 2. Financial prizes — first major hook after the hero */}
      <PrizePool />

      {/* 3. Competition journey / six stages — merged, single source of truth, with CTA */}
      <CompetitionJourney />

      {/* 4. Credibility — KFUPM/DTV + condensed Deep-Tech focus areas */}
      <ProofWall />

      {/* 5. Contact / Final CTA */}
      <FinalCTA />

      <Footer />
    </main>
  );
}

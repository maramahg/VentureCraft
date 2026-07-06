'use client';

import dynamic from 'next/dynamic';
import ScrollProgress from '../components/ScrollProgress';
import { VentureSignalHero } from '../components/home-a/VentureSignalHero';
import Footer from '../components/Footer';

const ProofStrip        = dynamic(() => import('../components/home-a/ProofStrip'));
const CompetitionJourney= dynamic(() => import('../components/home-a/CompetitionJourney'));
const StickyGlobeTimeline = dynamic(() => import('../components/home-a/StickyGlobeTimeline'));
const PrizePool         = dynamic(() => import('../components/home-a/PrizePool'));
const VentureAreas      = dynamic(() => import('../components/home-a/VentureAreas'));
const ProofWall         = dynamic(() => import('../components/home-a/ProofWall'));
const GetInvolvedTabs   = dynamic(() => import('../components/home-a/GetInvolvedTabs'));
const PartnersOrganizers= dynamic(() => import('../components/home-a/PartnersOrganizers'));
const FinalCTA          = dynamic(() => import('../components/home-a/FinalCTA'));

export default function DesignA() {
  return (
    <main className="min-h-screen flex flex-col overflow-clip" style={{ background: '#0B2A24' }}>
      <ScrollProgress />

      {/* 1. Cinematic hero — globe, Dhahran signal arcs, scramble title, mouse parallax stats */}
      <VentureSignalHero />

      {/* 2. Credibility strip — KFUPM/DTV + animated count-up stats */}
      <ProofStrip />

      {/* 3. Competition journey — Pitch / Accelerate / Launch */}
      <CompetitionJourney />

      {/* 4. Scroll-driven timeline — branded phase indicator, 6 phases */}
      <StickyGlobeTimeline />

      {/* 5. Prize pool — $245K count-up, tier cards */}
      <PrizePool />

      {/* 6. Deep-tech focus areas */}
      <VentureAreas />

      {/* 7. Proof wall — bento credibility grid */}
      <ProofWall />

      {/* 8. Get involved — 5 animated tabs */}
      <GetInvolvedTabs />

      {/* 9. Partners & organizers */}
      <PartnersOrganizers />

      {/* 10. Final CTA */}
      <FinalCTA />

      <Footer />
    </main>
  );
}

'use client';

import dynamic from 'next/dynamic';
import ScrollProgress from '../../components/ScrollProgress';
import { StageHero } from '../../components/home-b/StageHero';
import Footer from '../../components/Footer';

const CompetitionPath   = dynamic(() => import('../../components/home-b/CompetitionPath'));
const PhaseTimeline     = dynamic(() => import('../../components/home-b/PhaseTimeline'));
const AwardShowcase     = dynamic(() => import('../../components/home-b/AwardShowcase'));
const FocusGrid         = dynamic(() => import('../../components/home-b/FocusGrid'));
const CredibilityMosaic = dynamic(() => import('../../components/home-b/CredibilityMosaic'));
const InvolvementCards  = dynamic(() => import('../../components/home-b/InvolvementCards'));
const AlliesSection     = dynamic(() => import('../../components/home-b/AlliesSection'));
const ClosingCTA        = dynamic(() => import('../../components/home-b/ClosingCTA'));

export default function DesignB() {
  return (
    <main className="min-h-screen flex flex-col overflow-clip" style={{ background: '#00120F' }}>
      <ScrollProgress />

      {/* 1. Full-screen bold typographic hero — odometer prize, text scramble, rising keywords, marquee */}
      <StageHero />

      {/* 2. Competition path — alternating editorial layout */}
      <CompetitionPath />

      {/* 3. Phase timeline — 3-column grid */}
      <PhaseTimeline />

      {/* 4. Award showcase — dramatic full-width prize display */}
      <AwardShowcase />

      {/* 5. Focus areas — asymmetric bento grid */}
      <FocusGrid />

      {/* 6. Credibility mosaic — cinematic image strip + press-kit grid */}
      <CredibilityMosaic />

      {/* 7. Involvement cards — 5 hover-expand cards side by side */}
      <InvolvementCards />

      {/* 8. Allies — minimal confident partner display */}
      <AlliesSection />

      {/* 9. Closing CTA — background image with strong overlay */}
      <ClosingCTA />

      <Footer />
    </main>
  );
}

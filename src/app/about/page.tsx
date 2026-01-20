'use client';


import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect } from 'react';
import { GradientOrbs } from '@/components/GradientOrbs';
import AboutHero from '@/components/AboutHero';
import AboutPurposeMission from '@/components/AboutPurposeMission';
import AboutObjectives from '@/components/AboutObjectives';
import AboutTargetAudience from '@/components/AboutTargetAudience';

export default function AboutPage() {
    const missionRef = useScrollAnimation(0.2);

    // Ensure page starts at top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <main className="relative min-h-screen">
                {/* Static background */}
                <div className="fixed inset-0 -z-20 bg-gradient-to-b from-[#0A1F1F] to-[#000000]" aria-hidden="true" />
                <div className="fixed inset-0 -z-10 pointer-events-none">
                    <GradientOrbs />
                </div>
                <AboutHero />
                <AboutPurposeMission missionRef={missionRef.ref} isVisible={missionRef.isVisible} />
                <div className="spacer-lg" />
                <AboutObjectives />
                <div className="spacer-lg" />
                <AboutTargetAudience />
                <div className="w-full spacer-xl" />
            </main>
            <Footer />
        </>
    );
}

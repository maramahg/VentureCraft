import Footer from '@/components/Footer';
import StickyGlobeTimeline from '@/components/home-a/StickyGlobeTimeline';

export default function TimelinePage() {
    return (
        <main className="pt-24 min-h-screen flex flex-col" style={{ background: '#0B2A24' }}>
            <StickyGlobeTimeline />
            <Footer />
        </main>
    );
}

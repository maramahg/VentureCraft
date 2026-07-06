import Footer from '@/components/Footer';
import PartnersOrganizers from '@/components/home-a/PartnersOrganizers';

export default function SponsorsPage() {
    return (
        <main className="pt-24 min-h-screen flex flex-col" style={{ background: '#0B2A24' }}>
            <PartnersOrganizers />
            <Footer />
        </main>
    );
}

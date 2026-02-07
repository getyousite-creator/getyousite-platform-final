import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AIEngine from "@/components/home/AIEngine";
import Showcase from "@/components/home/Showcase";
import PricingEngine from "@/components/payment/PricingEngine";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";
import MaintenanceProtocol from "@/components/home/MaintenanceProtocol";

export default function Home() {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

    if (isMaintenanceMode) {
        return <MaintenanceProtocol />;
    }

    return (
        <main className="bg-black min-h-screen selection:bg-blue-500/30">
            <Header />
            <Hero />
            <Services />
            <AIEngine />
            <Showcase />
            <PricingEngine />
            <Testimonials />
            <CTA />
            <Footer />
        </main>
    );
}

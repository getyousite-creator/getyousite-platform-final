import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AIEngine from "@/components/home/AIEngine";
import Showcase from "@/components/home/Showcase";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
    return (
        <main className="bg-black min-h-screen selection:bg-blue-500/30">
            <Header />
            <Hero />
            <Services />
            <AIEngine />
            <Showcase />
            <Pricing />
            <Testimonials />
            <CTA />
            <Footer />
        </main>
    );
}

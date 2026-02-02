"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trees, Compass, MapPin, Star, Volume2, ArrowRight } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SovereignImage } from "@/components/ui/sovereign-image";
import { SovereignTemplateProps } from "@/lib/types/template";

export default function VermaHospitality({ settings, blueprint }: SovereignTemplateProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;

    // Modular Data Extraction (Sovereign Schema)
    const heroSection = blueprint?.layout?.find((s: any) => s.type === 'hero');
    const heroHeadline = heroSection?.content?.headline || headline;
    const heroSubheadline = heroSection?.content?.subheadline || subheadline;
    const heroImage = heroSection?.content?.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2430";

    // Philosophy/Feature Section
    const philosophySection = blueprint?.layout?.find((s: any) => s.type === 'features');
    const philosophyImage = philosophySection?.content?.image || "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2430";
    const philosophyTitle = philosophySection?.content?.title || "Deep Serenity.";
    const philosophyDesc = philosophySection?.content?.description || "The platform architected to vanish leaving only the experience. No clutter. No noise. Only the pure essence of luxury.";

    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen bg-[#0d0d0d] text-[#e5e5e5] selection:bg-[#c4a47c] selection:text-white"
            style={{ fontFamily }}
        >
            {/* Luxury Nav */}
            <nav className="p-8 flex items-center justify-between border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-3xl z-50">
                <div className="flex items-center gap-3 text-2xl font-black tracking-[0.2em] cursor-pointer" onClick={() => onOpen("Verma Home")}>
                    <Compass className="w-6 h-6" style={{ color: primaryColor }} />
                    VERMA
                </div>
                <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                    <span className="hover:text-white transition-colors cursor-pointer">Sanctuary</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Experience</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Dossier</span>
                    <button
                        onClick={() => onOpen("Verma Reservation")}
                        className="px-10 py-3 rounded-none border border-[#c4a47c] text-[#c4a47c] hover:bg-[#c4a47c] hover:text-white transition-all font-bold"
                    >
                        Book Sanctuary
                    </button>
                </div>
            </nav>

            {/* Cinematic Hero */}
            <section className="relative h-[90vh] flex flex-col justify-center px-10 overflow-hidden">
                <SovereignImage
                    src={heroImage}
                    alt="Luxury Hotel"
                    fill
                    className="object-cover object-center opacity-60 scale-110 animate-subtle-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

                <div className="relative z-10 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-10 text-[9px] font-bold uppercase tracking-[0.6em] text-[#c4a47c]"
                    >
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-4">Ultra-High Fidelity Architecture</span>
                    </motion.div>
                    <h1 className="text-7xl md:text-[10vw] font-black uppercase leading-[0.8] mb-12 tracking-tightest">
                        {heroHeadline}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl leading-relaxed mb-16">
                        {heroSubheadline}
                    </p>
                    <div className="flex flex-wrap gap-8 items-center">
                        <button
                            onClick={() => onOpen("Verma Explore")}
                            className="px-12 py-5 bg-[#c4a47c] text-white font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            Immerse Now
                        </button>
                        <div className="flex items-center gap-6 opacity-40">
                            <div className="w-12 h-[1px] bg-white" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Available in 12 Destinations</span>
                        </div>
                    </div>
                </div>

                {/* Cinematic Controls */}
                <div className="absolute bottom-10 right-10 flex gap-6">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5">
                        <Volume2 className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5">
                        <AnimatePresence>
                            <MapPin className="w-4 h-4 text-zinc-500" />
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-40 px-10 grid grid-cols-1 md:grid-cols-2 gap-40 bg-white text-black rounded-t-[100px]">
                <div className="relative aspect-[4/5] overflow-hidden group">
                    <SovereignImage
                        src={philosophyImage}
                        alt="Pool"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-6xl font-black mb-12 uppercase tracking-tighter italic">{philosophyTitle}</h2>
                    <p className="text-xl text-zinc-500 leading-relaxed mb-12 italic">
                        {philosophyDesc}
                    </p>
                    <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">
                        <li className="flex items-center gap-4"><ArrowRight className="w-4 h-4 text-[#c4a47c]" /> Private Concierge API</li>
                        <li className="flex items-center gap-4"><ArrowRight className="w-4 h-4 text-[#c4a47c]" /> Neural Mood Lighting</li>
                        <li className="flex items-center gap-4"><ArrowRight className="w-4 h-4 text-[#c4a47c]" /> Sovereign Retreat Mode</li>
                    </ul>
                </div>
            </section>
        </motion.div>
    );
}

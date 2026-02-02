"use client";

import { motion } from "framer-motion";
import { Zap, Eye, Code, Cpu, Globe, ArrowDownRight } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SovereignImage } from "@/components/ui/sovereign-image";
import { SovereignTemplateProps } from "@/lib/types/template";

export default function CyberPortfolio({ settings, blueprint }: SovereignTemplateProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;

    // Modular Data Extraction (Sovereign Schema)
    const heroSection = blueprint?.layout?.find((s: any) => s.type === 'hero');
    const heroHeadline = heroSection?.content?.headline || headline;
    const heroSubheadline = heroSection?.content?.subheadline || subheadline;
    const heroImage = heroSection?.content?.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2432";

    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden"
            style={{ fontFamily }}
        >
            {/* GLITCH OVERLAYS */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

            {/* NAVIGATION */}
            <nav className="p-10 flex items-center justify-between relative z-20">
                <div className="text-3xl font-black italic tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => onOpen("CyberHome")}>
                    <div className="w-10 h-10 border-2 border-white flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform">
                        <Code className="-rotate-45 group-hover:-rotate-90 transition-transform" />
                    </div>
                    CYBER.
                </div>
                <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-500">
                    <span className="hover:text-white cursor-crosshair transition-colors">Manifesto</span>
                    <span className="hover:text-white cursor-crosshair transition-colors">Lab_Works</span>
                    <button
                        onClick={() => onOpen("Cyber Connect")}
                        className="px-8 py-3 bg-white text-black font-black hover:invert transition-all"
                    >
                        Terminal_Access
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="px-10 py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-[1px] w-full bg-zinc-800 mb-20 origin-left"
                    />
                    <h1 className="text-[12vw] font-black leading-[0.75] uppercase tracking-tighter mb-20">
                        {heroHeadline}
                    </h1>
                    <div className="flex flex-wrap gap-20 items-start">
                        <div className="max-w-md">
                            <p className="text-xl text-zinc-500 leading-relaxed mb-12">
                                {heroSubheadline}
                            </p>
                            <button
                                onClick={() => onOpen("Portfolio View")}
                                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white"
                            >
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowDownRight className="w-5 h-5" />
                                </div>
                                Explore Operations
                            </button>
                        </div>
                        <div className="flex flex-col gap-8 opacity-40 text-[10px] font-mono tracking-widest">
                            <div>[STATUS: OPTIMAL]</div>
                            <div>[CORE: ACTIVATED]</div>
                            <div>[ENCRYPTION: RSA-4096]</div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 relative aspect-[4/5] bg-zinc-900 border border-white/5 overflow-hidden group cursor-pointer" onClick={() => onOpen("Asset_01")}>
                    <SovereignImage
                        src={heroImage}
                        alt="Cyber Subject"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top delay-100" />
                </div>
            </section>

            {/* CORE CAPABILITIES */}
            <section className="bg-white text-black py-40 px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                    <CapItem icon={Cpu} title="NEURAL LOGIC" desc="Architecting interfaces that learn from human interaction patterns." />
                    <CapItem icon={Globe} title="GLOBAL PROTOCOL" desc="Universal deployment infrastructures for high-fidelity digital assets." />
                    <CapItem icon={Zap} title="FORCE_SYNC" desc="Real-time data orchestration at the speed of thought (0ms)." />
                </div>
            </section>
        </motion.div>
    );
}

function CapItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-8 group">
            <div className="w-20 h-20 bg-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-black italic tracking-tightest">{title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">{desc}</p>
        </div>
    );
}

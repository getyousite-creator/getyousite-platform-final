"use client";

import { motion } from "framer-motion";
import { Terminal, Code, Database, Cpu, Command, GitBranch, ArrowRight } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SovereignImage } from "@/components/ui/sovereign-image";
import { SovereignTemplateProps } from "@/lib/types/template";
import { cn } from "@/lib/utils";

export default function PythonPortfolio({ settings, blueprint }: SovereignTemplateProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;

    // Modular Data Extraction
    const heroSection = blueprint?.layout?.find((s: any) => s.type === 'hero');
    const heroHeadline = heroSection?.content?.headline || headline;
    const heroSubheadline = heroSection?.content?.subheadline || subheadline;
    const heroImage = heroSection?.content?.image || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070";

    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    // Sovereign Green Theme Override
    const accentColor = primaryColor || "#00D09C";

    return (
        <motion.div
            key={updatePulse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen bg-[#0d1117] text-slate-300 font-mono selection:bg-[#00D09C] selection:text-black overflow-x-hidden"
            style={{ fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}
        >
            {/* GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
                style={{ backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            {/* HEADER */}
            <nav className="border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold tracking-tighter" onClick={() => onOpen("PythonHome")}>
                        <Terminal className="w-5 h-5 text-[#00D09C]" />
                        <span>~/portfolio</span>
                        <span className="animate-pulse w-3 h-5 bg-[#00D09C] block ml-1" />
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span className="hover:text-[#00D09C] cursor-pointer transition-colors">./projects</span>
                        <span className="hover:text-[#00D09C] cursor-pointer transition-colors">./stack</span>
                        <button
                            onClick={() => onOpen("HireProtocol")}
                            className="bg-[#00D09C]/10 text-[#00D09C] px-4 py-2 border border-[#00D09C]/20 hover:bg-[#00D09C] hover:text-black transition-all"
                        >
                            sudo hire_me
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO TERMINAL */}
            <section className="relative pt-20 pb-32 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] text-[#00D09C] font-mono">
                            <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
                            INTERPRETER ACTIVE: V3.12.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                            <span className="text-[#00D09C]">def</span> {heroHeadline?.split(' ')[0]}<span className="text-slate-500">(</span>self<span className="text-slate-500">):</span>
                        </h1>

                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg font-mono text-sm relative group">
                            <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center gap-2 px-4 rounded-t-lg">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-[#00D09C]" />
                            </div>
                            <div className="mt-6 space-y-2 text-slate-400">
                                <p><span className="text-purple-400">class</span> <span className="text-yellow-300">Architect</span>:</p>
                                <p className="pl-4">"""</p>
                                <p className="pl-4">{heroSubheadline}</p>
                                <p className="pl-4">"""</p>
                                <p className="pl-4"><span className="text-blue-400">def</span> <span className="text-yellow-300">__init__</span>(self):</p>
                                <p className="pl-8">self.stack = [<span className="text-emerald-300">'Django'</span>, <span className="text-emerald-300">'FastAPI'</span>, <span className="text-emerald-300">'Torch'</span>]</p>
                                <p className="pl-8">self.mission = <span className="text-emerald-300">'Scale Infinite'</span></p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => onOpen("Execute")} className="px-8 py-4 bg-[#00D09C] text-black font-bold uppercase tracking-wider hover:bg-[#00D09C]/80 transition-all flex items-center gap-2">
                                <Command className="w-4 h-4" /> Execute
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-slate-700 text-white font-bold uppercase tracking-wider hover:border-[#00D09C] hover:text-[#00D09C] transition-all">
                                Documentation
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-[#00D09C]/20 blur-[100px] rounded-full opacity-20" />
                        <div className="relative border border-slate-800 bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden aspect-square group">
                            <SovereignImage
                                src={heroImage}
                                alt="Python Dev"
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <div className="bg-slate-900/80 px-3 py-1 rounded border border-slate-700 flex items-center gap-2">
                                        <GitBranch className="w-3 h-3 text-[#00D09C]" />
                                        main
                                    </div>
                                    <div className="text-slate-400">Last commit: 12ms ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES / STACK */}
            <section className="py-24 border-y border-slate-800 bg-[#0b0e13]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StackItem icon={Database} title="PostgreSQL" desc="Relational Supremacy" />
                        <StackItem icon={Cpu} title="Docker" desc="Containerized Logic" />
                        <StackItem icon={Code} title="TypeScript" desc="Type-Safe Frontend" />
                        <StackItem icon={Terminal} title="Linux" desc="Kernel Access" />
                    </div>
                </div>
            </section>

        </motion.div>
    );
}

function StackItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-6 border border-slate-800 bg-slate-900/50 hover:border-[#00D09C]/50 hover:bg-[#00D09C]/5 transition-all group rounded-lg">
            <Icon className="w-8 h-8 text-slate-500 group-hover:text-[#00D09C] mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00D09C] transition-colors">{title}</h3>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{desc}</p>
        </div>
    );
}

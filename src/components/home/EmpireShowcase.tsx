'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Layout, Zap } from 'lucide-react';

const examples = [
    {
        name: "Quantum Consulting",
        niche: "Legal & Professional",
        desc: "A high-conversion law firm portal built in 42 seconds.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Zenith Kitchen",
        niche: "Restaurant & Hospitality",
        desc: "Gourmet visual storytelling for a high-end dining brand.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "CyberCore SaaS",
        niche: "Tech & Software",
        desc: "Modern electric UI for a next-gen software solution.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
    }
];

export default function EmpireShowcase() {
    return (
        <section className="py-32 bg-[#020617] border-t border-white/5 relative overflow-hidden">
            {/* GLOW DECOR */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00D09C] text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3" /> تم الإنتاج بواسطة العبقرية
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">معرض الإمبراطوريات</h2>
                        <p className="text-white/40 text-lg max-w-xl font-light">استعرض المواقع التي تم بناؤها بالكامل بواسطة الذكاء الاصطناعي السيادي في ثوانٍ معدودة.</p>
                    </div>

                    <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                        <span className="text-xs font-black uppercase tracking-widest">جميع النماذج</span>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00D09C] transition-all">
                            <Layout className="w-4 h-4" />
                        </div>
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {examples.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 mb-6">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D09C] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">Neural_Build</span>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-4">
                                        <ExternalLink className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 px-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    <Zap className="w-3 h-3" /> {item.niche}
                                </div>
                                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

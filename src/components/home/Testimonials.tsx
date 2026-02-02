"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "Alex Sterling",
        role: "CEO, FinTech Nexus",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        content: "We launched in 48 hours. The AI optimized our funnel and we saw a 300% ROI in week one. Unbelievable precision.",
    },
    {
        name: "Sarah Chen",
        role: "Founder, Orbital Dynamics",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content: "The German hosting speed is real. Our latency dropped to near zero globally. This is engineering art.",
    },
    {
        name: "Marcus Vole",
        role: "Director, HyperScale",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        content: "I've worked with top agencies for decades. GetYouSite's AI engine outperforms them all. Pure dominance.",
    },
    {
        name: "Elena Kova",
        role: "CTO, Quantum Leap",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        content: "The code quality is immaculate. Zero errors, strict typing, and the animations are fluid as mercury.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Global Alliances</h2>
                <p className="text-zinc-400">Join the elite commanders who have already deployed their empires.</p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                    {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="inline-block w-[350px] bg-zinc-900/50 border border-white/5 rounded-2xl p-8 hover:bg-zinc-900 transition-colors whitespace-normal"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-6 italic leading-relaxed">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                    <Image
                                        src={t.image}
                                        alt={t.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                                    <p className="text-zinc-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

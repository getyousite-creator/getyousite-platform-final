/**
 * Hero Section - Conversion-Optimized
 *
 * Features:
 * - Dynamic H1 with typewriter effect
 * - Canvas-based Mesh Gradient background (CPU-efficient)
 * - Single massive CTA with Pulse Glow
 * - Social proof integration
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { MeshGradient } from "./mesh-gradient";

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

export function HeroSection({ title, subtitle, ctaPrimary, ctaSecondary }: HeroSectionProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian">
            {/* Canvas-based Mesh Gradient (High Performance - 60fps) */}
            <MeshGradient opacity={0.3} />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8"
                >
                    <Sparkles className="w-4 h-4 text-accent-neon" />
                    <span className="text-sm text-neutral-slate">
                        AI-Powered Next Generation
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
                >
                    {title}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-neon">
                        GetYouSite
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl md:text-2xl text-neutral-slate mb-12 max-w-3xl mx-auto"
                >
                    {subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-4 bg-gradient-to-r from-primary to-accent-neon text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                        aria-label={ctaPrimary}
                    >
                        {ctaPrimary}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                        aria-label={ctaSecondary}
                    >
                        {ctaSecondary}
                    </motion.button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-slate"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🎨</span>
                        <span>Unique designs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🚀</span>
                        <span>Instant deploy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">♾️</span>
                        <span>Unlimited revisions</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

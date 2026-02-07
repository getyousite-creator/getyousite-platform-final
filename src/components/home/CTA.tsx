"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden flex items-center justify-center">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/50" />

            {/* Animated Particles (CSS only for perf) */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            <div className="container relative z-10 text-center px-6">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
                >
                    Ready to <span className="text-blue-500">Scale?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto"
                >
                    High-performance infrastructure is ready. Move beyond simple builders.
                    Launch your professional business asset today.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        onClick={() => window.location.href = '/signup'}
                        variant="premium"
                        size="lg"
                        className="text-lg px-12 py-8 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95"
                    >
                        Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

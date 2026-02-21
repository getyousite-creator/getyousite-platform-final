/**
 * CTA Section Component
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
    title: string;
    subtitle: string;
    ctaText: string;
}

export function CTASection({ title, subtitle, ctaText }: CTASectionProps) {
    return (
        <section className="py-20 bg-gradient-to-r from-primary/20 to-accent-neon/20">
            <div className="container mx-auto px-4 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black text-white mb-6"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-xl text-neutral-slate mb-10 max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-10 py-5 bg-gradient-to-r from-primary to-accent-neon text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(190,242,100,0.5)] transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                    {ctaText}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </section>
    );
}

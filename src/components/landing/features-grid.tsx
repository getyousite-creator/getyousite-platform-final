/**
 * Features Grid Component
 */

"use client";

import React from "react";
import { motion } from "framer-motion";

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesGridProps {
    title: string;
    features: Feature[];
}

export function FeaturesGrid({ title, features }: FeaturesGridProps) {
    return (
        <section className="py-20 bg-obsidian/50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
                    {title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-slate">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

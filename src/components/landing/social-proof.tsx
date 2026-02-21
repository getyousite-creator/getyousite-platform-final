/**
 * Social Proof Component
 * 
 * Shows live user activity and statistics
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Globe, Layers } from "lucide-react";

interface SocialProofProps {
    userCount: number;
    sitesBuilt: number;
    countries: number;
}

export function SocialProof({ userCount, sitesBuilt, countries }: SocialProofProps) {
    return (
        <section className="py-16 bg-obsidian/30 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        icon={<Users className="w-8 h-8 text-primary" />}
                        value={userCount.toLocaleString()}
                        label="Active Users"
                        description="Building their digital presence"
                    />
                    <StatCard
                        icon={<Layers className="w-8 h-8 text-accent-neon" />}
                        value={sitesBuilt.toLocaleString()}
                        label="Sites Created"
                        description="Powered by AI"
                    />
                    <StatCard
                        icon={<Globe className="w-8 h-8 text-info" />}
                        value={countries.toString()}
                        label="Countries"
                        description="Worldwide reach"
                    />
                </div>
            </div>
        </section>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
    description: string;
}

function StatCard({ icon, value, label, description }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
        >
            <div className="flex justify-center mb-4">{icon}</div>
            <div className="text-4xl font-black text-white mb-2">{value}</div>
            <div className="text-lg font-bold text-neutral-slate mb-1">{label}</div>
            <div className="text-sm text-neutral-slate/60">{description}</div>
        </motion.div>
    );
}

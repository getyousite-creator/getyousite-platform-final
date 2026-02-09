"use client";

import React from "react";
import { Shield, Eye, Lock, FileLock, Scale } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* LEGAL HEADER */}
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-secondary border border-border text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8"
                        >
                            <Shield className="w-3 h-3 text-primary" />
                            Security_Protocol_v2.0
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black italic tracking-tightest uppercase mb-6 leading-none"
                        >
                            Privacy Anchor
                        </motion.h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">How we protect your signal and data</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-20">
                        <Section
                            icon={Lock}
                            title="1. DATA SOVEREIGNTY"
                            text="Your data is your property. We do not sell, rent, or trade your personal information. Our architecture is designed to minimize data footprint and maximize security."
                        />

                        <Section
                            icon={Eye}
                            title="2. TRACKING & SIGNALS"
                            text="We use minimal tracking for performance optimization and security monitoring. No third-party behavioral tracking is permitted within the Sovereign core."
                        />

                        <Section
                            icon={FileLock}
                            title="3. ENCRYPTION PROTOCOL"
                            text="Every transmission is encrypted at rest and in transit. Your access keys are never stored in plain text and are protected by multi-layer hashing."
                        />

                        <Section
                            icon={Scale}
                            title="4. LEGAL COMPLIANCE"
                            text="We comply with GDPR and Moroccan data protection laws (Law 09-08). You have the right to request a full wipe of your digital signal at any time."
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="pt-20 border-t border-border opacity-40 text-[10px] font-mono leading-relaxed space-y-4"
                        >
                            <p>Last Privacy Update: February 05, 2026.</p>
                            <p>Casablanca, Morocco / Global Sovereign Network.</p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ icon: Icon, title, text }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-10 items-start group"
        >
            <div className="shrink-0 w-16 h-16 bg-secondary border border-border rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="space-y-4">
                <h2 className="text-3xl font-black italic tracking-tightest uppercase">{title}</h2>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">{text}</p>
            </div>
        </motion.div>
    )
}

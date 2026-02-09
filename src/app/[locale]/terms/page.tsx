"use client";

import React from "react";
import { ShieldCheck, Scale, Globe, FileText, Lock, Zap } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
                            <Scale className="w-3 h-3 text-primary" />
                            Legal_Node_v2.0
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black italic tracking-tightest uppercase mb-6 leading-none"
                        >
                            Sovereign Protocol
                        </motion.h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Terms of Service / Operation Logic</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-20">
                        {/* SECTION 1 */}
                        <Section
                            icon={Globe}
                            title="1. ARCHITECTURAL SERVICE"
                            text="GetYouSite functions as a Sovereign Site Architect. By deploying architectures through our engine, you retain 100% ownership of your business logic and customer data. GetYouSite remains the guardian of the underlying core code and hosting infrastructure."
                        />

                        {/* SECTION 2 - PAYMENTS */}
                        <Section
                            icon={ShieldCheck}
                            title="2. MONETIZATION PROTOCOL"
                            text="We provide hybrid payment processing (PayPal & Local Moroccan Transfers). Automated gateways are activated upon transaction confirmation. Manual transfers (CIH, Barid Bank) require verifiable 'Proof of Payment'. Any submission of fraudulent data triggers an immediate and permanent terminal ban."
                        />

                        {/* SECTION 3 - PERFORMANCE */}
                        <Section
                            icon={Zap}
                            title="3. ZERO COMMISSION GUARANTEE"
                            text="Our operational logic is simple: Zero commissions on your revenue. You invest in the infrastructure; every dirham of profit belongs to your empire. This is the Sovereign advantage."
                        />

                        {/* SECTION 4 - SECURITY */}
                        <Section
                            icon={Lock}
                            title="4. CORE SECURITY & DATA"
                            text="All deployments are protected by Enterprise DDOS layers and Military-grade encryption. We do not sell your data; we architect the walls that protect it."
                        />

                        {/* THE FINE PRINT */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="pt-20 border-t border-border opacity-40 text-[10px] font-mono leading-relaxed space-y-4"
                        >
                            <p>Last Protocol Update: February 05, 2026.</p>
                            <p>The service is provided 'As Is'. We are not responsible for user-generated content or 3rd party store transactions. Compliance with local E-commerce laws is the responsibility of the account holder.</p>
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

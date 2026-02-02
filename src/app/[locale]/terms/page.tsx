"use client";

import React from "react";
import { ShieldCheck, Scale, Globe, FileText } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-950 selection:text-white pb-32">
            {/* LEGAL HEADER */}
            <header className="px-8 py-24 md:py-40 bg-zinc-50 border-b border-zinc-100 text-center">
                <div className="flex justify-center mb-10">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-xl">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tightest mb-6">LEGAL PROTOCOL</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Terms of Service / getyousite-platform</p>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-20">
                <div className="space-y-20">
                    {/* SECTION 1 */}
                    <Section
                        icon={Globe}
                        title="1. THE SERVICE"
                        text="GetYouSite-Platform functions as a Sovereign Site Builder. By deploying sites through our infrastructure, you acknowledge that you retain ownership of your content, while GetYouSite remains the architect and provider of the underlying codebase and hosting bridge."
                    />

                    {/* SECTION 2 - PAYMENTS */}
                    <Section
                        icon={ShieldCheck}
                        title="2. MONETIZATION & HYBRID PAYMENTS"
                        text="We offer both automated (PayPal) and manual (Moroccan Local Bank) payment flows. Automated payments are activated instantly. Manual transfers (CIH, Barid Bank, CashPlus) require submission of a valid 'Proof of Payment'. GetYouSite reserves the right to reject any proof deemed fraudulent or manipulated. Excessive submission of fake proofs will result in a permanent terminal ban."
                    />

                    {/* SECTION 3 - NO COMMISSION */}
                    <Section
                        icon={FileText}
                        title="3. ZERO COMMISSION POLICY"
                        text="Unlike traditional platforms, GetYouSite does not take a percentage of your sales. You pay for the infrastructure; your profit is 100% yours. This is our core operational logic for the Moroccan market."
                    />

                    {/* THE FINE PRINT */}
                    <div className="pt-20 border-t border-zinc-100 opacity-40 text-[9px] font-mono leading-relaxed space-y-4">
                        <p>Dernière mise à jour: 02 Fevrier 2026.</p>
                        <p>The service is provided 'As Is'. We are not responsible for user-generated content or store transactions. Users must comply with Moroccan E-commerce laws.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Section({ icon: Icon, title, text }: any) {
    return (
        <div className="flex gap-8 items-start group">
            <div className="shrink-0 w-12 h-12 border border-zinc-200 rounded-xl flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all duration-500">
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-4">
                <h2 className="text-xl font-black italic tracking-tighter">{title}</h2>
                <p className="text-zinc-500 font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    )
}

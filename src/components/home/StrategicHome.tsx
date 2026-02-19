"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { track } from "@vercel/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles, Globe2, PenLine, Search, Palette, Layers3 } from "lucide-react";

const COPY = {
    ar: {
        heroTitle: "???? ????? ????????? ??????? ????????? ?? ?????",
        heroSub: "?? ????? ???? ????????? ??? ???? ???? ?????: ????? ?????? ?????? ????? ??? ????.",
        inputPlaceholder: "????? ?????? ????? ???? ??????...",
        startFree: "???? ??????",
        exploreTemplates: "?????? ???????",
        trustedBy: "????? ?? ??? ???? ??????? ?????",
        featuresTitle: "????? GetYouSite",
        howTitle: "??? ???? ??????",
        legalTitle: "???????? ??????",
    },
    default: {
        heroTitle: "Create Your Professional AI Website In Minutes",
        heroSub:
            "Describe your business once, and launch a production-ready website with content, structure, and a clear publishing path.",
        inputPlaceholder: "Restaurant, clinic, store, legal office...",
        startFree: "Start For Free",
        exploreTemplates: "Explore Templates",
        trustedBy: "Trusted by teams shipping websites faster",
        featuresTitle: "Why GetYouSite",
        howTitle: "How It Works",
        legalTitle: "Trust And Compliance",
    },
};

const TRUST_LOGOS = ["Atlas Studio", "Nexa Clinic", "Beldi Coffee", "Flux Legal", "Nova Beauty"];

export default function StrategicHome() {
    const locale = useLocale();
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const isArabic = locale === "ar";
    const t = isArabic ? COPY.ar : COPY.default;

    const submitPrompt = () => {
        const vision = prompt.trim();
        if (!vision) return;
        track("funnel_home_prompt_start", { locale, prompt_length: vision.length });
        router.push(`/customizer?vision=${encodeURIComponent(vision)}&trial=1`);
    };

    return (
        <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#020617] text-white">
            <Header />

            <main className="pt-32">
                <section className="container mx-auto px-6 py-16 md:py-24">
                    <div className="mx-auto max-w-5xl text-center">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            {t.heroTitle}
                        </h1>
                        <p className="mt-6 text-base md:text-xl text-white/70 max-w-3xl mx-auto">
                            {t.heroSub}
                        </p>

                        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-3 md:p-4 backdrop-blur-xl">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && submitPrompt()}
                                placeholder={t.inputPlaceholder}
                                className="w-full rounded-2xl bg-[#0b1227] border border-white/10 px-4 md:px-6 py-4 md:py-5 text-base md:text-xl placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                            />
                            <div className="mt-3 flex flex-col md:flex-row gap-3">
                                <button
                                    onClick={submitPrompt}
                                    className="flex-1 rounded-xl bg-primary text-[#020617] font-bold py-3 px-5 hover:bg-[#5ea9ff] transition-colors"
                                >
                                    {t.startFree}
                                </button>
                                <Link
                                    href="/playground"
                                    className="flex-1 rounded-xl border border-white/20 text-white/90 font-bold py-3 px-5 hover:bg-white/5 transition-colors"
                                >
                                    {t.exploreTemplates}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-6 pb-10">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                        {t.trustedBy}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                        {TRUST_LOGOS.map((name) => (
                            <div
                                key={name}
                                className="rounded-xl border border-white/10 bg-white/[0.03] py-4 text-center text-sm text-white/70"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </section>

                <section id="features" className="container mx-auto px-6 py-14">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-8">
                        {t.featuresTitle}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[FEATURE_ITEMS[0], FEATURE_ITEMS[1], FEATURE_ITEMS[3]].map((item) => (
                            <article
                                key={item.title}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                            >
                                <item.icon className="w-6 h-6 text-cyan-300 mb-3" />
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-white/65 text-sm">{item.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="container mx-auto px-6 py-14">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-8">
                        {t.howTitle}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            "1. Describe Your Business",
                            "2. AI Generates Instantly",
                            "3. Publish & Share",
                        ].map((step) => (
                            <div
                                key={step}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 font-semibold text-white/85"
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container mx-auto px-6 pb-20">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">
                        {t.legalTitle}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                            href="/about"
                            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/terms"
                            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
                        >
                            Terms Of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

const FEATURE_ITEMS = [
    {
        icon: Sparkles,
        title: "AI Site Generation",
        desc: "From intent to complete site structure.",
    },
    { icon: PenLine, title: "Persona Content", desc: "Copy adapts to your business tone." },
    { icon: Globe2, title: "Multilingual", desc: "Arabic, English, French, Spanish ready." },
    { icon: Palette, title: "Style Control", desc: "Theme, colors, typography in one flow." },
    { icon: Search, title: "SEO Foundation", desc: "Metadata and schema-ready publishing." },
    { icon: Layers3, title: "Template Playground", desc: "Try templates before registration." },
];

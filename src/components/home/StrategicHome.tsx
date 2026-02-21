"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { track } from "@vercel/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles, Globe2, PenLine, Search, Palette, Layers3 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

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
    const [typed, setTyped] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [previewIndex, setPreviewIndex] = useState(0);
    const isArabic = locale === "ar";
    const t = isArabic ? COPY.ar : COPY.default;
    const words = isArabic
        ? ["مطعم", "عيادة", "استشارات", "متجر إلكتروني", "شركة تقنية"]
        : ["Restaurant", "Clinic", "Consulting", "Ecommerce", "AI Startup"];

    // typewriter
    useEffect(() => {
        const current = words[wordIndex % words.length];
        let i = 0;
        const raf = requestAnimationFrame(() => setTyped(""));
        const interval = setInterval(() => {
            i += 1;
            setTyped(current.slice(0, i));
            if (i >= current.length) {
                clearInterval(interval);
                setTimeout(() => setWordIndex((w) => (w + 1) % words.length), 1000);
            }
        }, 90);
        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
        };
    }, [wordIndex, words]);

    // rotating live preview deck
    const previews = [
        { title: isArabic ? "مطعم راقٍ" : "Fine Dining", desc: isArabic ? "قائمة موسمية وصور أطباق عالية الدقة" : "Seasonal menu with cinematic food shots" },
        { title: isArabic ? "شركة تقنية" : "Tech SaaS", desc: isArabic ? "لوحة أسعار حديثة وتجربة تسجيل سلسة" : "Modern pricing + smooth onboarding" },
        { title: isArabic ? "متجر إلكتروني" : "Ecommerce", desc: isArabic ? "سلة سريعة مع بوابات دفع مدمجة" : "Fast cart with embedded payments" },
    ];
    useEffect(() => {
        const id = setInterval(() => {
            setPreviewIndex((p) => (p + 1) % previews.length);
        }, 5000);
        return () => clearInterval(id);
    }, [previews.length]);

    // mesh gradient parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const translateX = useTransform(mouseX, [0, 1], [-8, 8]);
    const translateY = useTransform(mouseY, [0, 1], [-8, 8]);

    const submitPrompt = () => {
        const vision = prompt.trim();
        if (!vision) return;
        track("funnel_home_prompt_start", { locale, prompt_length: vision.length });
        router.push(`/customizer?vision=${encodeURIComponent(vision)}&trial=1`);
    };

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-[var(--neutral-obsidian,#020617)] text-white overflow-hidden"
            onMouseMove={(e) => {
                const { innerWidth, innerHeight } = window;
                mouseX.set(e.clientX / innerWidth);
                mouseY.set(e.clientY / innerHeight);
            }}
        >
            <Header />

            <main className="pt-32">
                <section className="relative container mx-auto px-6 py-16 md:py-24 overflow-hidden">
                    {/* Mesh gradient */}
                    <motion.div
                        style={{ x: translateX, y: translateY }}
                        className="pointer-events-none absolute inset-[-20%] blur-3xl opacity-60"
                    >
                        <div className="absolute w-[70%] h-[70%] top-10 left-10 rounded-full"
                            style={{ background: "radial-gradient(circle at 30% 30%, rgba(190,242,100,0.25), transparent 60%)" }} />
                        <div className="absolute w-[60%] h-[60%] bottom-10 right-10 rounded-full"
                            style={{ background: "radial-gradient(circle at 70% 70%, rgba(6,78,59,0.4), transparent 70%)" }} />
                    </motion.div>

                    <div className="mx-auto max-w-5xl text-center relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-lime-200/80 text-[10px] uppercase tracking-[0.25em]">
                            <Sparkles className="w-3 h-3" />
                            Zero-Learning UI · 5s Rule
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            {t.heroTitle}
                            <br />
                            <span className="text-lime-200">
                                {typed}
                                <span className="animate-pulse">|</span>
                            </span>
                        </h1>
                        <p className="text-base md:text-xl text-white/70 max-w-3xl mx-auto">
                            {t.heroSub}
                        </p>

                        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && submitPrompt()}
                                placeholder={t.inputPlaceholder}
                                className="w-full rounded-2xl bg-[#0b1227] border border-white/10 px-5 md:px-6 py-4 md:py-5 text-base md:text-xl placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-lime-300/60"
                            />
                            <button
                                onClick={submitPrompt}
                                className="mt-4 w-full vip-button py-4 text-lg font-black uppercase tracking-[0.2em] magnetic-hover relative overflow-hidden"
                            >
                                <span className="relative z-10">{t.startFree}</span>
                                <motion.span
                                    className="absolute inset-0 bg-white/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.3, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity }}
                                />
                            </button>
                            <p className="text-xs text-white/60 mt-3">
                                {isArabic ? "انضم إلى +5000 مستخدم نشروا مواقعهم اليوم" : "Join 5,000+ users who launched today"}
                            </p>

                            {/* Live interactive preview */}
                            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1227]/70 p-4">
                                <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                                    <span>{isArabic ? "معاينة حية" : "Live Preview"}</span>
                                    <span className="text-lime-200/80">AI / {previews[previewIndex].title}</span>
                                </div>
                                <motion.div
                                    key={previewIndex}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-xl bg-gradient-to-br from-[#0f172a] via-[#0b1227] to-[#022C22] border border-white/10 p-4 text-left"
                                >
                                    <p className="text-sm font-bold text-lime-200 mb-2">{previews[previewIndex].title}</p>
                                    <p className="text-xs text-white/70">{previews[previewIndex].desc}</p>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-white/60">
                                        <span className="bg-white/5 rounded-lg px-2 py-1">Hero + CTA</span>
                                        <span className="bg-white/5 rounded-lg px-2 py-1">SEO Schema</span>
                                        <span className="bg-white/5 rounded-lg px-2 py-1">Responsive</span>
                                    </div>
                                </motion.div>
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

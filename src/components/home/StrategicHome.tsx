"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { track } from "@vercel/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles, Globe2, PenLine, Search, Palette, Layers3, Shield, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const COPY = {
    ar: {
        heroTitle: "هندسة الحضور الرقمي السيادي",
        heroSub: "حدد قصدك الاستراتيجي. مجالسنا الهندسية ستقوم بتوليف بنية تحتية رقمية محصنة إنتاجياً بسيادة معمارية مطلقة.",
        inputPlaceholder: "مطعم، عيادة، متجر، مكتب محاماة...",
        startFree: "تفعيل البروتوكول",
        exploreTemplates: "استكشاف الهياكل",
        trustedBy: "موثوق من قبل المؤسسات الرقمية الأكثر نمواً",
        featuresTitle: "المعايير الهندسية لـ GYS Global",
        howTitle: "بروتوكول التشغيل الهيكلي",
        legalTitle: "السيادة والامتثال",
        councilsTitle: "المجالس الهندسية الاستراتيجية",
        councilsSub: "يتم تخطيط كل كائن رقمي وتوليفه تحت إشراف مجالسنا المتخصصة لضمان السيادة المطلقة."
    },
    default: {
        heroTitle: "Architect Your Sovereign Digital Presence",
        heroSub:
            "Define your strategic intent. Our engineering councils synthesize a production-hardened digital infrastructure with total architectural sovereignty.",
        inputPlaceholder: "Restaurant, clinic, store, legal office...",
        startFree: "Activate Protocol",
        exploreTemplates: "Explore Blueprints",
        trustedBy: "Trusted by digital empires shipping with total authority",
        featuresTitle: "Engineering Standards of GYS Global",
        howTitle: "Structural Operating Protocol",
        legalTitle: "Sovereignty And Compliance",
        councilsTitle: "Strategic Engineering Councils",
        councilsSub: "Every digital asset is architected and synthesized under the oversight of our specialized councils to ensure absolute sovereignty."
    },
};

const TRUST_LOGOS = ["Atlas Executive", "Nexa Clinical", "Beldi Strategic", "Flux Juris", "Nova Global"];

const COUNCILS = [
    { title: "Architectural Council", ar: "المجلس المعماري", role: "Structural Integrity & Scalability" },
    { title: "Strategic Synthesis Team", ar: "فريق التوليف الاستراتيجي", role: "Market Dominance & Resonance" },
    { title: "UX Governance Board", ar: "مجلس حوكمة تجربة المستخدم", role: "Frictionless Behavioral Engineering" },
    { title: "Global Security Ops", ar: "عمليات الأمن العالمي", role: "Hardened Infrastructure Sovereignty" },
];

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
        ? ["مطعم فاخر", "مركز طبي عيادي", "مكتب استشارات استراتيجي", "إمبراطورية تجارة إلكترونية", "شركة تقنية سيادية"]
        : ["Fine Dining", "Clinical Center", "Strategic Advisory", "Ecommerce Empire", "Sovereign Tech"];

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
        { title: isArabic ? "بنية مطعم راقٍ" : "Fine Dining Architecture", desc: isArabic ? "قائمة موسمية وتوليف هوية بصرية عيادي" : "Seasonal layout with clinical brand synthesis" },
        { title: isArabic ? "منصة تقنية سيادية" : "Sovereign Tech SaaS", desc: isArabic ? "محرك أسعار متطور وتكامل مع شبكة الحافة" : "Advanced pricing engine with Edge synchronization" },
        { title: isArabic ? "إمبراطورية تجارة" : "Ecommerce Empire", desc: isArabic ? "هندسة سلة سريعة ووحدات دفع محصنة" : "Fast-cart engineering with hardened payment silos" },
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
                            style={{ background: "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.2), transparent 60%)" }} />
                        <div className="absolute w-[60%] h-[60%] bottom-10 right-10 rounded-full"
                            style={{ background: "radial-gradient(circle at 70% 70%, rgba(0,208,156,0.1), transparent 70%)" }} />
                    </motion.div>

                    <div className="mx-auto max-w-5xl text-center relative z-10 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                        >
                            <Shield className="w-3 h-3 text-cyan-400" />
                            Sovereign Engineering Kernel // v7.2-SIP
                        </motion.div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            {isArabic ? "تجسيد الأصول" : "Manifest"}{" "}
                            <span className="text-cyan-400 not-italic underline decoration-white/10 underline-offset-[12px]">
                                {typed}
                            </span>
                            <br />
                            {isArabic ? "الرقمية السيادية" : "Sovereign Assets"}
                        </h1>

                        <p className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
                            {t.heroSub}
                        </p>

                        <div className="relative mt-12 max-w-3xl mx-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-3 shadow-2xl">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && submitPrompt()}
                                        placeholder={t.inputPlaceholder}
                                        className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-6 py-5 text-xl placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/[0.08] transition-all"
                                    />
                                    <button
                                        onClick={submitPrompt}
                                        className="vip-button px-10 py-5 text-lg font-black uppercase tracking-widest relative overflow-hidden group/btn shadow-vip-glow hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ backgroundColor: '#00D09C' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 bg-[length:200%_100%] animate-shimmer opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                        <span className="relative z-10 flex items-center gap-2 text-[#0A2540]">
                                            {t.startFree}
                                            <Sparkles className="w-5 h-5 text-[#0A2540]" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
                            {isArabic ? "توليف برمجيات عيادي • أتمتة معمارية شاملة" : "Clinical Software Synthesis • Global Edge Orchestration"}
                        </p>
                    </div>
                </section>

                <section className="container mx-auto px-6 pb-20">
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-white/40 mb-8">
                        {t.trustedBy}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
                        {TRUST_LOGOS.map((name) => (
                            <div
                                key={name}
                                className="rounded-xl border border-white/5 bg-white/[0.02] py-6 text-center text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </section>

                {/* THE ENGINEERING COUNCILS (NEW SECTION) */}
                <section className="bg-white/[0.02] border-y border-white/5 py-32">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl space-y-4 mb-20">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">{t.councilsTitle}</h2>
                            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-2xl">{t.councilsSub}</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6">
                            {COUNCILS.map((council) => (
                                <div key={council.title} className="p-8 rounded-[2rem] border border-white/5 bg-black/40 hover:border-cyan-400/30 transition-all group">
                                    <div className="w-8 h-1 bg-cyan-400/20 mb-6 group-hover:w-12 group-hover:bg-cyan-400 transition-all duration-500" />
                                    <h3 className="text-xl font-black mb-2 uppercase">{isArabic ? council.ar : council.title}</h3>
                                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest leading-relaxed">{council.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="features" className="container mx-auto px-6 py-32">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-16 italic">
                        {t.featuresTitle}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[FEATURE_ITEMS[0], FEATURE_ITEMS[1], FEATURE_ITEMS[3]].map((item) => (
                            <article
                                key={item.title}
                                className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 space-y-6 hover:bg-white/[0.05] transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                                    <item.icon className="w-7 h-7 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-relaxed">{item.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="container mx-auto px-6 py-20">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-8">
                        {t.howTitle}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            isArabic ? "1. تعريف القصد الاستراتيجي" : "1. Strategic Intent Definition",
                            isArabic ? "2. التوليف الهيكلي تحت إشراف المجلس" : "2. Structural Synthesis Under Council Oversight",
                            isArabic ? "3. تفعيل البروتوكول العالمي" : "3. Global Protocol Activation",
                        ].map((step) => (
                            <div
                                key={step}
                                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 font-black text-white/50 uppercase text-[10px] tracking-widest flex items-center gap-4"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
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
        title: "Sovereign Synthesis",
        desc: "From intent to complete site structure.",
    },
    { icon: PenLine, title: "Persona Content", desc: "Copy adapts to your business tone." },
    { icon: Globe2, title: "Multilingual", desc: "Arabic, English, French, Spanish ready." },
    { icon: Palette, title: "Style Control", desc: "Theme, colors, typography in one flow." },
    { icon: Search, title: "SEO Foundation", desc: "Metadata and schema-ready publishing." },
    { icon: Layers3, title: "Template Playground", desc: "Try templates before registration." },
];

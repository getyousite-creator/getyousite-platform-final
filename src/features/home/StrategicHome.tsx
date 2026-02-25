"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import NextImage from "next/image";
import { useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { track } from "@vercel/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MeshGradient from "@/shared/components/MeshGradient";
import { Sparkles, Globe2, PenLine, Search, Palette, Layers3, Zap, ShieldCheck, Users, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

const COPY = {
    ar: {
        heroTitle: "هندسة إمبراطوريتك الرقمية بدقة عالمية",
        heroSub: "إطار عمل معماري متطور يتجاوز التصميم التقليدي لهندسة منطق الأعمال القوي. نحن ندمج الحرفية البرمجية مع التوليف العصبي لتقديم أصول رقمية عالية العائد.",
        inputPlaceholder: "حدد رؤيتك التجارية الاستراتيجية هنا...",
        startFree: "تأسيس المشروع",
        trustedBy: "موثوق من قبل فرق تشحن البنى التحتية بشكل أسرع",
        featuresTitle: "لماذا معيار GYS",
        howTitle: "دورة حياة الهندسة السيادية",
        legalTitle: "الثقة والامتثال المؤسسي",
        socialProof: "انضم إلى +5,000 مهندس قاموا بتحصين بنيتهم التحتية اليوم",
        pricingMonthly: "استثمار ربع سنوي",
        pricingYearly: "تغطية سنوية سيادية",
        save: "تحسين التكلفة بنسبة 20%",
        selectPlan: "تفعيل البروتوكول"
    },
    default: {
        heroTitle: "Engineer Your Digital Empire with Global Precision.",
        heroSub: "A sophisticated architectural framework that transcends traditional design to engineer robust business logic. We merge expert software craftsmanship with high-frequency Strategic synthesis.",
        inputPlaceholder: "Define your strategic commercial vision here...",
        startFree: "Establish Project",
        trustedBy: "Trusted by entities shipping infrastructure faster",
        featuresTitle: "Why GYS Standard",
        howTitle: "Sovereign Engineering Lifecycle",
        legalTitle: "Enterprise Trust & Compliance",
        socialProof: "Join +5,000 architects fortifying their infrastructure today",
        pricingMonthly: "Quarterly Investment",
        pricingYearly: "Sovereign Annual Coverage",
        save: "20% Cost Optimization",
        selectPlan: "Activate Protocol"
    },
};

const TRUST_LOGOS = ["Atlas Strategic", "Nexa Clinical", "Beldi Logistics", "Flux compliance", "Nova Infrastructure"];

const PRICING_PLANS = [
    { name: "Growth Node", monthly: 29, yearly: 290, features: ["Foundational Logic Unit", "Standard Mesh Access", "Community Support"] },
    { name: "Sovereign System", monthly: 79, yearly: 790, features: ["Unlimited Logic Units", "Custom Domain Protocols", "Priority Synthesis", "Strategic Analytics"], popular: true },
    { name: "Enterprise Core", monthly: 299, yearly: 2990, features: ["Dedicated Infrastructure", "Whitelabel Synthesis Core", "24/7 Engineering Response", "SLA Mandate"] }
];

export default function StrategicHome() {
    const locale = useLocale();
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [typed, setTyped] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isYearly, setIsYearly] = useState(true);
    const isArabic = locale === "ar";
    const t = isArabic ? COPY.ar : COPY.default;
    const words = isArabic
        ? ["مؤسسة كبرى", "كيان طبي", "مجموعة استشارية", "منصة تجارة", "شركة ناشئة تقنية"]
        : ["Enterprise", "Clinical Unit", "Strategic Group", "Commerce Node", "Tech Sovereign"];

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
                const timeout = setTimeout(() => setWordIndex((w) => (w + 1) % words.length), 1000);
                return () => clearTimeout(timeout);
            }
        }, 90);
        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
        };
    }, [wordIndex, words]);

    // rotating live preview deck
    const previews = [
        { title: isArabic ? "مطعم راقٍ" : "Fine Dining", desc: isArabic ? "قائمة موسميةوصور أطباق عالية الدقة" : "Seasonal menu with cinematic food shots", color: "from-orange-500/20" },
        { title: isArabic ? "شركة تقنية" : "Tech SaaS", desc: isArabic ? "لوحة أسعار حديثة وتجربة تسجيل سلسة" : "Modern pricing + smooth onboarding", color: "from-blue-500/20" },
        { title: isArabic ? "متجر إلكتروني" : "Ecommerce", desc: isArabic ? "سلة سريعة مع بوابات دفع مدمجة" : "Fast cart with embedded payments", color: "from-emerald-500/20" },
    ];

    useEffect(() => {
        const id = setInterval(() => {
            setPreviewIndex((p) => (p + 1) % previews.length);
        }, 5000);
        return () => clearInterval(id);
    }, [previews.length]);

    const submitPrompt = () => {
        const vision = prompt.trim();
        if (!vision) return;
        track("funnel_home_prompt_start", { locale, prompt_length: vision.length });
        router.push(`/customizer?vision=${encodeURIComponent(vision)}&trial=1`);
    };

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative"
        >
            <MeshGradient />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "GYS Global",
                        "url": "https://GYS Global.com",
                        "description": t.heroSub,
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "All",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })
                }}
            />

            <Header />

            <main className="pt-32 relative z-10">
                <section className="relative container mx-auto px-6 py-16 md:py-24">
                    <div className="mx-auto max-w-5xl text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neon-lime text-[9px] font-black uppercase tracking-[0.3em] shadow-vip-glow"
                        >
                            <Sparkles className="w-3 h-3" />
                            Sovereign Protocol · v3.1 Gold
                        </motion.div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            {isArabic ? "ابنِ إمبراطوريتك" : "Build Your"}{" "}
                            <span className="text-neon-lime not-italic underline decoration-white/10 underline-offset-[12px]">
                                {typed}
                            </span>
                            <br />
                            {isArabic ? "في ثوانٍ معدودة" : "In Seconds"}
                        </h1>

                        <p className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
                            {t.heroSub}
                        </p>

                        <div className="relative mt-12 max-w-3xl mx-auto group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-neon-lime/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-3 shadow-2xl">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && submitPrompt()}
                                        placeholder={t.inputPlaceholder}
                                        aria-label="Describe your business vision"
                                        className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-6 py-5 text-xl placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-neon-lime/30 focus:bg-white/[0.08] transition-all"
                                    />
                                    <button
                                        onClick={submitPrompt}
                                        aria-label="Establish Infrastructure"
                                        className="vip-button px-10 py-5 text-lg font-black uppercase tracking-widest relative overflow-hidden group/btn shadow-vip-glow hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-lime via-white/20 to-neon-lime bg-[length:200%_100%] animate-shimmer opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            {t.startFree}
                                            <Sparkles className="w-5 h-5" />
                                        </span>
                                        <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(190,242,100,0.4)] animate-pulse-slow pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SOCIAL PROOF */}
                        <div className="flex flex-col items-center gap-4 mt-6">
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <Users className="w-3 h-3 text-neon-lime" />
                                {t.socialProof}
                            </p>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-obsidian bg-zinc-800 flex items-center justify-center text-[8px] font-bold overflow-hidden relative">
                                        <NextImage
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                            alt="Sovereign User"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INTERACTIVE PREVIEW ENGINE */}
                        <Suspense fallback={<div className="h-[400px] animate-pulse bg-white/5 rounded-3xl" />}>
                            <div className="mt-16 relative group/preview">
                                <div className="absolute -inset-4 bg-neon-lime/5 blur-3xl rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity duration-1000" />
                                <div className="relative rounded-3xl border border-white/10 bg-black/60 backdrop-blur-3xl overflow-hidden shadow-2xl max-w-3xl mx-auto border-t-white/20">
                                    <div className="h-6 bg-white/5 border-b border-white/10 flex items-center px-4 gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                        <div className="flex-1 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 text-center">
                                            Sovereign_Preview_v3.1_Active
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 text-left relative min-h-[400px]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={previewIndex}
                                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                                transition={{ duration: 0.6, ease: "circOut" }}
                                                className="space-y-6"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${previews[previewIndex].color} to-transparent border border-white/10 text-[10px] font-black uppercase tracking-widest text-neon-lime`}>
                                                        {isArabic ? "قالب نشط" : "Active_Template"}
                                                    </div>
                                                    <Zap className="w-5 h-5 text-neon-lime animate-pulse" />
                                                </div>
                                                <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                                                    {previews[previewIndex].title}
                                                </h3>
                                                <p className="text-lg md:text-xl text-white/40 max-w-lg leading-relaxed uppercase font-black tracking-widest">
                                                    {previews[previewIndex].desc}
                                                </p>
                                                <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {[1, 2, 3, 4].map(j => (
                                                        <div key={j} className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-neon-lime shadow-[0_0_10px_rgba(190,242,100,0.5)]"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "100%" }}
                                                                transition={{ duration: 5, ease: "linear" }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </Suspense>
                    </div>
                </section>

                {/* TRUST LOGOS */}
                <section className="container mx-auto px-6 pb-24">
                    <p className="text-center text-[10px] uppercase tracking-[0.5em] text-white/20 mb-12 font-black">
                        {t.trustedBy}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        {TRUST_LOGOS.map((name) => (
                            <div
                                key={name}
                                className="rounded-2xl border border-white/5 bg-white/[0.01] py-6 text-center text-[10px] font-black text-white/50 border-t-white/10 uppercase tracking-widest"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="container mx-auto px-6 py-24 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-12 h-12 rounded-2xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-neon-lime" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tightest uppercase italic">
                            {t.featuresTitle}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURE_ITEMS.slice(0, 3).map((item) => (
                            <article
                                key={item.title}
                                className="group p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 border-t-white/10 relative overflow-hidden"
                            >
                                <item.icon className="w-8 h-8 text-neon-lime mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="font-black text-xl mb-4 uppercase italic tracking-tighter">{item.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">{item.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* PRICING ENGINE */}
                <section id="pricing" className="container mx-auto px-6 py-24 border-t border-white/5">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                            {isArabic ? "اختر خطة إمبراطوريتك" : "Choose Your Empire Plan"}
                        </h2>
                        {/* PRICING SWITCH */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-xs font-black uppercase tracking-widest ${!isYearly ? 'text-neon-lime' : 'text-white/40'}`}>{t.pricingMonthly}</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                aria-label="Toggle Billing Cycle"
                                className="w-14 h-7 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all"
                            >
                                <motion.div
                                    animate={{ x: isYearly ? (isArabic ? -28 : 28) : 0 }}
                                    className="w-5 h-5 rounded-full bg-neon-lime shadow-vip-glow"
                                />
                            </button>
                            <span className={`text-xs font-black uppercase tracking-widest ${isYearly ? 'text-neon-lime' : 'text-white/40'}`}>{t.pricingYearly}</span>
                            <span className="px-2 py-1 rounded-md bg-neon-lime/10 text-neon-lime text-[8px] font-black uppercase">{t.save}</span>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {PRICING_PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`p-8 rounded-[2.5rem] border ${plan.popular ? 'border-neon-lime shadow-vip-glow bg-neon-lime/5' : 'border-white/5 bg-white/[0.01]'} relative overflow-hidden group`}
                            >
                                {plan.popular && <div className="absolute top-0 right-10 px-4 py-1 bg-neon-lime text-obsidian text-[8px] font-black uppercase rounded-b-lg">Most Popular</div>}
                                <h3 className="text-xl font-black uppercase italic mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black">${isYearly ? Math.floor(plan.yearly / 12) : plan.monthly}</span>
                                    <span className="text-white/40 text-xs font-bold uppercase">/ {isArabic ? "شهر" : "mo"}</span>
                                </div>
                                <ul className="space-y-4 mb-12">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
                                            <CheckCircle2 className="w-4 h-4 text-neon-lime" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-neon-lime text-obsidian' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                                    {t.selectPlan}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container mx-auto px-6 py-24 bg-neon-lime/5 rounded-[4rem] border border-neon-lime/10 mb-24">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neon-lime text-obsidian text-[10px] font-black uppercase tracking-[0.4em] shadow-vip-glow">
                            <ShieldCheck className="w-4 h-4" />
                            {isArabic ? "بروتوكول التحقق السيادي" : "Sovereign Verification Protocol"}
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-none uppercase italic">
                            {t.howTitle}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Define", desc: "Describe your business vision once." },
                                { title: "Synthesize", desc: "Sovereign engine architects logic & structure." },
                                { title: "Deploy", desc: "Launch to production in one click." }
                            ].map((step, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="text-6xl font-black text-neon-lime/20">{idx + 1}</div>
                                    <h4 className="font-black uppercase tracking-tighter text-xl italic">{step.title}</h4>
                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

const FEATURE_ITEMS = [
    { icon: Sparkles, title: "Architectural Synthesis", desc: "From intent to complete site structure." },
    { icon: PenLine, title: "Engineered Content", desc: "Copy adapts to your business tone." },
    { icon: Globe2, title: "Global Propagation", desc: "Arabic, English, French, Spanish ready." },
];

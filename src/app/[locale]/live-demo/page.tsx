"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const COPY = {
    en: {
        badge: "STRATEGIC PREVIEW MODE",
        title: "Test The Synthesis Core Before Deployment",
        subtitle:
            "Define your strategic project requirements, manifest a preliminary architecture, then refine within the Management Center.",
        placeholder: "e.g. Enterprise logistic hub for global shipping operations",
        generate: "Manifest Architecture",
        generating: "Synthesizing Blueprint",
        ready: "Blueprint Manifested",
        continueBuilder: "Continue To Management Center",
        savePublish: "Initialize Sovereignty To Save/Deploy",
    },
    ar: {
        badge: "وضع المعاينة الاستراتيجية",
        title: "اختبر نواة التوليف قبل النشر",
        subtitle:
            "حدد المتطلبات الاستراتيجية لمشروعك، جسد معمارية أولية، ثم قم بالتحسين داخل مركز الإدارة.",
        placeholder: "مثال: مركز لوجستي للمؤسسات لعمليات الشحن العالمية",
        generate: "تجسيد المعمارية",
        generating: "جاري توليد المخطط",
        ready: "المخطط جاهز",
        continueBuilder: "المتابعة إلى مركز الإدارة",
        savePublish: "تفعيل السيادة للحفظ والنشر",
    },
    fr: {
        badge: "MODE APERCU STRATÉGIQUE",
        title: "Testez le Noyau de Synthèse avant Déploiement",
        subtitle:
            "Définissez vos exigences stratégiques, manifestez une architecture préliminaire, puis affinez au sein du Centre de Gestion.",
        placeholder: "ex: Hub logistique d'entreprise pour opérations mondiales",
        generate: "Manifester l'Architecture",
        generating: "Synthèse du Blueprint en cours",
        ready: "Blueprint Manifesté",
        continueBuilder: "Continuer vers le Centre de Gestion",
        savePublish: "Initialiser la Souveraineté pour Sauvegarder/Déployer",
    },
    es: {
        badge: "MODO PREVIA ESTRATÉGICA",
        title: "Pruebe el Núcleo de Síntesis antes del Despliegue",
        subtitle:
            "Defina sus requisitos estratégicos, manifieste una arquitectura preliminar y luego refine en el Centro de Gestión.",
        placeholder: "ej: Hub logístico empresarial para operaciones de transporte global",
        generate: "Manifestar Arquitectura",
        generating: "Sintetizando Blueprint",
        ready: "Blueprint Manifestado",
        continueBuilder: "Continuar al Centro de Gestión",
        savePublish: "Inicializar Soberanía para Guardar/Desplegar",
    },
} as const;

export default function LiveDemoPage() {
    const locale = useLocale() as keyof typeof COPY;
    const router = useRouter();
    const t = COPY[locale] || COPY.en;
    const [vision, setVision] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    const demoSections = useMemo(
        () => [
            "Hero with CTA",
            "Services grid",
            "Testimonials strip",
            "Contact form + map",
        ],
        [],
    );

    const generatePreview = async () => {
        if (!vision.trim()) return;
        setIsGenerating(true);
        setPreviewReady(false);
        await new Promise((r) => setTimeout(r, 1600));
        setIsGenerating(false);
        setPreviewReady(true);
    };

    return (
        <main className="min-h-screen bg-[#020617]">
            <Header />
            <section className="pt-36 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold tracking-widest">
                            <Sparkles className="w-4 h-4 text-primary" />
                            {t.badge}
                        </span>
                        <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-white">{t.title}</h1>
                        <p className="mt-4 text-white/50 max-w-3xl mx-auto">{t.subtitle}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-8 backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                placeholder={t.placeholder}
                                className="flex-1 h-14 rounded-2xl bg-black/30 border border-white/10 px-5 text-white placeholder:text-white/30 outline-none focus:border-primary/50"
                            />
                            <Button
                                onClick={generatePreview}
                                disabled={!vision.trim() || isGenerating}
                                className="h-14 rounded-2xl px-8 bg-primary text-[#020617] font-black uppercase tracking-wider"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t.generating}
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        {t.generate}
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1220] overflow-hidden">
                            <div className="h-10 border-b border-white/10 bg-black/30 px-4 flex items-center justify-between">
                                <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">AI_PREVIEW</span>
                                {previewReady && (
                                    <span className="text-[10px] text-emerald-400 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t.ready}
                                    </span>
                                )}
                            </div>
                            <div className="p-6 md:p-8 space-y-4">
                                <div className="h-16 rounded-xl bg-white/5 border border-white/10" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    {demoSections.map((section) => (
                                        <div key={section} className="h-24 rounded-xl bg-white/5 border border-white/10 p-3">
                                            <span className="text-xs text-white/60 font-semibold">{section}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row gap-3">
                            <Button
                                disabled={!previewReady}
                                onClick={() => router.push(`/customizer?vision=${encodeURIComponent(vision)}&source=live-demo`)}
                                className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                            >
                                {t.continueBuilder}
                            </Button>
                            <Link href="/signup" className="inline-flex">
                                <Button variant="outline" className="h-12 rounded-xl border-white/20 text-white hover:bg-white/10">
                                    {t.savePublish}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}


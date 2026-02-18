"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { templates } from "@/data/template-data";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import TrustLayer from "@/components/trust/TrustLayer";

const PLAYGROUND_TEMPLATE_IDS = [
    "dr-khalil",
    "luxe-cart",
    "law-silo",
    "zen-food",
    "studio-zero",
    "tech-grid",
];

export default function PlaygroundPage() {
    const router = useRouter();
    const locale = useLocale();
    const isArabic = locale === "ar";

    const items = PLAYGROUND_TEMPLATE_IDS.map((id) =>
        templates.find((template) => template.id === id),
    ).filter(Boolean);

    useEffect(() => {
        track("funnel_playground_open", { locale });
    }, [locale]);

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-[#020617] text-white px-5 py-10 md:py-16 md:px-10"
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-3 md:mb-4">
                    Playground
                </h1>
                <p className="text-center text-white/60 mb-8 md:mb-12">
                    اختر قالبًا وابدأ التعديل مباشرة بدون تسجيل.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((template) => (
                        <button
                            key={template!.id}
                            onClick={() => {
                                track("funnel_playground_template_selected", {
                                    locale,
                                    template_id: template!.id,
                                });
                                router.push(`/playground/${template!.id}`);
                            }}
                            className="group text-left rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-cyan-400/50 transition-colors"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={template!.image}
                                    alt={template!.title}
                                    fill
                                    className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                                />

                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <motion.div
                                        animate={{ y: ["0%", "-18%", "0%"] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={template!.image}
                                            alt={`${template!.title} live preview`}
                                            fill
                                            className="object-cover scale-110"
                                        />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                                    <div className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full bg-cyan-500/90 text-black font-black uppercase tracking-widest">
                                        Live
                                    </div>
                                </motion.div>
                            </div>

                            <div className="p-5">
                                <h2 className="text-xl font-black mb-2">{template!.title}</h2>
                                <p className="text-sm text-white/65">{template!.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-10 md:mt-14">
                    <TrustLayer locale={locale} />
                </div>
            </div>
        </main>
    );
}

"use client";

import { ShieldCheck, LockKeyhole, Activity, HelpCircle } from "lucide-react";

interface TrustLayerProps {
    compact?: boolean;
    locale?: string;
}

function copy(locale?: string) {
    const isArabic = locale === "ar";
    if (isArabic) {
        return {
            title: "طبقة الثقة السيادية",
            subtitle: "أمان وتشغيل واستمرارية موثقة قبل النشر.",
            badges: ["SSL مشفّر", "GDPR متوافق", "جاهزية تشغيل 99.9%"],
            faqTitle: "أسئلة شائعة قبل النشر",
            faqs: [
                {
                    q: "هل أحتاج تسجيلًا قبل التجربة؟",
                    a: "لا. يمكنك التجربة مباشرة، ويطلب التسجيل فقط عند النشر.",
                },
                {
                    q: "هل يمكنني تعديل النصوص والألوان؟",
                    a: "نعم، التعديل متاح داخل وضع التجربة قبل النشر.",
                },
                {
                    q: "ماذا يحدث بعد انتهاء الخمس دقائق؟",
                    a: "يتوقف التحرير وتنتقل لخطوة التسجيل لإكمال النشر.",
                },
            ],
        };
    }

    return {
        title: "Sovereign Trust Layer",
        subtitle: "Verified security, uptime, and launch continuity.",
        badges: ["SSL Encrypted", "GDPR Compliant", "99.9% Uptime Ready"],
        faqTitle: "Pre-Launch FAQ",
        faqs: [
            {
                q: "Do I need to sign up before trying?",
                a: "No. You can try first and sign up only when publishing.",
            },
            {
                q: "Can I edit copy and colors?",
                a: "Yes, both are editable inside trial mode before publish.",
            },
            {
                q: "What happens after 5 minutes?",
                a: "Editing is locked and you continue by signing up to publish.",
            },
        ],
    };
}

export default function TrustLayer({ compact = false, locale = "en" }: TrustLayerProps) {
    const t = copy(locale);

    return (
        <section
            className={`rounded-3xl border border-white/10 bg-white/[0.03] ${compact ? "p-4" : "p-6 md:p-8"}`}
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base md:text-lg font-black text-white">{t.title}</h3>
                    <p className="text-xs md:text-sm text-white/60">{t.subtitle}</p>
                </div>
                <HelpCircle className="w-5 h-5 text-cyan-300 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl border border-white/10 bg-[#0b1222] px-3 py-2 text-xs font-bold text-white/85 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    {t.badges[0]}
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0b1222] px-3 py-2 text-xs font-bold text-white/85 flex items-center gap-2">
                    <LockKeyhole className="w-4 h-4 text-cyan-300" />
                    {t.badges[1]}
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0b1222] px-3 py-2 text-xs font-bold text-white/85 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-300" />
                    {t.badges[2]}
                </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">{t.faqTitle}</p>
            <div className="space-y-2">
                {t.faqs.map((item) => (
                    <details
                        key={item.q}
                        className="rounded-xl border border-white/10 bg-[#0b1222] px-4 py-3"
                    >
                        <summary className="cursor-pointer text-sm font-bold text-white/85">
                            {item.q}
                        </summary>
                        <p className="text-xs text-white/60 mt-2">{item.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

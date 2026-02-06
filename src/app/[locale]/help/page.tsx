"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export default function HelpPage() {
    const t = useTranslations('Help');
    const router = useRouter();

    const faqs = [
        {
            q: "كيف يمكنني البدء في إنشاء موقعي؟",
            a: "ببساطة، قم بالتسجيل واختر القالب المناسب لنشاطك. سيتم إرشادك خطوة بخطوة لتخصيص موقعك."
        },
        {
            q: "ما هي مدة تسليم الموقع؟",
            a: "نلتزم بتسليم موقعك الكامل خلال 48 ساعة من تأكيد الطلب والدفع."
        },
        {
            q: "هل يمكنني تعديل الموقع بنفسي بعد التسليم؟",
            a: "نعم! نوفر لك لوحة تحكم سهلة الاستخدام لتحديث المحتوى والصور في أي وقت."
        },
        {
            q: "ما هي وسائل الدفع المتاحة؟",
            a: "نقبل الدفع عبر PayPal والتحويل البنكي المحلي (CIH، Barid Bank) للعملاء في المغرب."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8"
                        >
                            <HelpCircle className="w-3 h-3" />
                            {t('badge')}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase mb-8 leading-none"
                        >
                            {t('title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6 mb-16">
                        <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter text-center">{t('faq_title')}</h2>
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-slate-900/50 border border-white/5 rounded-2xl text-start"
                            >
                                <h3 className="text-lg font-bold mb-3 text-white">{faq.q}</h3>
                                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto text-center">
                        <div className="p-10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl">
                            <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">لا تجد إجابة؟</h3>
                            <p className="text-slate-400 mb-6">فريق الدعم الفني لدينا جاهز لمساعدتك على مدار الساعة</p>
                            <Button
                                onClick={() => router.push('/contact')}
                                className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                {t('contact_support')}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

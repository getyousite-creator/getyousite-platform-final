"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Testimonials() {
    const t = useTranslations('Testimonials');

    // Load testimonials dynamically from locale files
    const testimonials = [
        {
            name: t('items.0.name'),
            role: t('items.0.role'),
            content: t('items.0.content'),
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar"
        },
        {
            name: t('items.1.name'),
            role: t('items.1.role'),
            content: t('items.1.content'),
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        {
            name: t('items.2.name'),
            role: t('items.2.role'),
            content: t('items.2.content'),
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine"
        },
        {
            name: t('items.3.name'),
            role: t('items.3.role'),
            content: t('items.3.content'),
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
        }
    ];

    return (
        <section className="py-32 bg-[#020617] overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="container mx-auto px-6 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mb-10"
                >
                    Testimonial Validation Layer
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{t('title')}</h2>
                <p className="text-white/40 text-xl font-light max-w-2xl mx-auto">{t('subtitle')}</p>
            </div>

            {/* Marquee Container with GYS-V2 Styling */}
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-10 py-10">
                    {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
                        <div
                            key={i}
                            className="inline-block w-[400px] bg-[#1e293b]/40 border border-white/5 rounded-[2rem] p-10 hover:border-primary/30 transition-all whitespace-normal backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-1.5 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-[#10B981] text-[#10B981]" />
                                ))}
                            </div>
                            <p className="text-white/60 mb-10 leading-relaxed text-base font-light">"{testimonial.content}"</p>
                            <div className="flex items-center gap-5">
                                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-1">
                                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase tracking-wider text-sm">{testimonial.name}</h4>
                                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edge Fades for better visual flow */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#020617] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#020617] to-transparent z-10" />
            </div>
        </section>
    );
}

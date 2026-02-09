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
        <section className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t('title')}</h2>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                    {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
                        <div
                            key={i}
                            className="inline-block w-[350px] bg-[#0A2540]/5 border border-white/5 rounded-3xl p-8 hover:border-[#00D09C]/30 transition-all whitespace-normal backdrop-blur-sm shadow-xl"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-[#00D09C] text-[#00D09C]" />
                                ))}
                            </div>
                            <p className="text-blue-100/60 mb-6 italic leading-relaxed text-sm">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00D09C]/20 bg-[#00D09C]/10">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase tracking-tighter text-sm italic">{testimonial.name}</h4>
                                    <p className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

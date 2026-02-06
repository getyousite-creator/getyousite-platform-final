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
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('title')}</h2>
                <p className="text-zinc-400">{t('subtitle')}</p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                    {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
                        <div
                            key={i}
                            className="inline-block w-[350px] bg-zinc-900/50 border border-white/5 rounded-2xl p-8 hover:bg-zinc-900 transition-colors whitespace-normal"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                                    <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

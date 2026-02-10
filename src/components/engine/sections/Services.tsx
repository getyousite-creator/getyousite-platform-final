'use client';

import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

export default function Services({ content, primaryColor }: any) {
    const services = content?.items || [
        { name: 'الاستشارة الاستراتيجية', price: 'من 2000 د.م', description: 'تخطيط شامل لنمو عملك في السوق الرقمي.' },
        { name: 'التصميم الإبداعي', price: 'من 5000 د.م', description: 'هوية بصرية كاملة تميزك عن جميع منافسيك.' },
        { name: 'التطوير المتكامل', price: 'من 8000 د.م', description: 'حلول برمجية متطورة مصممة خصيصاً لاحتياجاتك.' }
    ];

    return (
        <section className="py-24 px-8 bg-card">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tight">خدماتنا المتميزة</h2>
                        <p className="text-muted-foreground max-w-xl">نقدم حلولاً متكاملة تجمع بين الفن الرقمي والذكاء البرمجي لتحقيق أقصى درجات التأثير.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground bg-background px-4 py-2 rounded-full border border-border">
                        <Star className="w-4 h-4 fill-current" /> باقات احترافية
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service: any, i: number) => (
                        <div key={i} className="p-10 bg-background rounded-[2.5rem] border border-border hover:border-border/10 transition-all duration-500 group relative overflow-hidden shadow-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold">{service.name}</h4>
                                    <p className="text-3xl font-black" style={{ color: primaryColor }}>{service.price}</p>
                                </div>

                                <p className="text-muted-foreground leading-relaxed italic">
                                    "{service.description}"
                                </p>

                                <ul className="space-y-4 pt-4">
                                    {['دعم فني 24/7', 'تحديثات مجانية', 'ضمان الجودة'].map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} /> {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-4 rounded-2xl border-2 font-bold uppercase text-xs tracking-widest transition-all hover:bg-foreground hover:text-background" style={{ borderColor: primaryColor, color: primaryColor } as any}>
                                    احجز الآن
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

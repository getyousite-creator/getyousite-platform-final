'use client';

import React from 'react';

export default function Stats({ content, primaryColor }: any) {
    const stats = content?.items || [
        { label: 'عميل سعيد', value: '500+' },
        { label: 'مشروع منجز', value: '1,200+' },
        { label: 'سنة خبرة', value: '15+' },
        { label: 'جائزة دولية', value: '25+' }
    ];

    return (
        <section className="py-20 px-8 bg-card relative">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                {stats.map((stat: any, i: number) => (
                    <div key={i} className="text-center space-y-2 group">
                        <h3 className="text-5xl font-black tracking-tighter transition-transform group-hover:scale-110 duration-500" style={{ color: primaryColor }}>
                            {stat.value}
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

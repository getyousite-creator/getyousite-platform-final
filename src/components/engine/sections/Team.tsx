'use client';

import React from 'react';

export default function Team({ content, primaryColor }: any) {
    const members = content?.members || [
        { name: 'أمين العلمي', role: 'المدير التنفيذي', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
        { name: 'سارة بناني', role: 'مديرة التصميم', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { name: 'ياسين تازي', role: 'كبير المهندسين', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' }
    ];

    return (
        <section className="py-24 px-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black tracking-tight">فريقنا المبدع</h2>
                    <p className="text-muted-foreground">نخبة من الخبراء المتخصصين في تحويل الرؤى إلى واقع رقمي ملموس.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {members.map((member: any, i: number) => (
                        <div key={i} className="group relative">
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-secondary shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                    <h4 className="text-xl font-bold text-white">{member.name}</h4>
                                    <p className="text-sm text-white/60 font-medium">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import React from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactForm({ content, primaryColor }: any) {
    return (
        <section className="py-24 px-8 bg-background relative overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tight">
                            {content?.title || 'تواصل معنا'}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {content?.description || 'نحن هنا للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">اتصل بنا</p>
                                <p className="text-lg font-bold">{content?.phone || '+212 600 000 000'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">البريد الإلكتروني</p>
                                <p className="text-lg font-bold">{content?.email || 'contact@example.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">الموقع</p>
                                <p className="text-lg font-bold">{content?.address || 'الدار البيضاء، المغرب'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-10 rounded-3xl border border-border shadow-2xl relative">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">الاسم</label>
                                <input type="text" className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all" style={{ '--tw-ring-color': primaryColor } as any} placeholder="اسمي هو..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">البريد الإلكتروني</label>
                                <input type="email" className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all" style={{ '--tw-ring-color': primaryColor } as any} placeholder="email@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">الرسالة</label>
                            <textarea rows={4} className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all" style={{ '--tw-ring-color': primaryColor } as any} placeholder="أريد أن أسأل عن..."></textarea>
                        </div>
                        <button className="w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ backgroundColor: primaryColor }}>
                            إرسال الرسالة <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

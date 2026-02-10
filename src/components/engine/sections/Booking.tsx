'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingSectionProps {
    content: {
        headline?: string;
        subheadline?: string;
        ctaText?: string;
        options?: string[];
    };
    primaryColor?: string;
}

export default function BookingSection({ content, primaryColor = '#00D09C' }: BookingSectionProps) {
    return (
        <section className="py-24 relative overflow-hidden bg-black/20 backdrop-blur-md border-y border-white/5">
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-[120px] rounded-full" style={{ backgroundColor: primaryColor }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            <Calendar className="w-3 h-3" style={{ color: primaryColor }} /> نظام الحجز السيادي
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            {content.headline || "Ready to Start Your Journey?"}
                        </h2>
                        <p className="text-white/40 text-lg font-medium leading-relaxed max-w-lg uppercase tracking-widest">
                            {content.subheadline || "Experience high-fidelity coordination and real-time scheduling for your ultimate convenience."}
                        </p>

                        <div className="space-y-4">
                            {(content.options || ["Instant Confirmation", "24/7 Availability", "Secure Authentication"]).map((opt, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
                                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                    </div>
                                    <span className="text-[11px] text-white/60 font-black uppercase tracking-widest">{opt}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 md:p-14 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Select Date</label>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-white/60 hover:border-white/30 cursor-pointer transition-all">
                                        <span className="text-xs font-bold">Pick_Day</span>
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Guests</label>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-white/60 hover:border-white/30 cursor-pointer transition-all">
                                        <span className="text-xs font-bold">Volume</span>
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Preferred Time</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['10:00', '14:00', '20:00'].map(t => (
                                        <div key={t} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-[10px] font-black text-white/30 hover:bg-white/10 hover:text-white hover:border-primary cursor-pointer transition-all tracking-widest">
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl text-white font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] border-none"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {content.ctaText || "Book_Session"} <ArrowRight className="w-5 h-5 ml-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


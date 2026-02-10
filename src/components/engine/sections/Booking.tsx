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
    }
}

export default function BookingSection({ content }: BookingSectionProps) {
    return (
        <section className="py-24 relative overflow-hidden bg-black/20 backdrop-blur-md border-y border-white/5">
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20 text-[#00D09C] text-[10px] font-black uppercase tracking-[0.2em]">
                            <Calendar className="w-3 h-3" /> نظام الحجز السيادي
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                            {content.headline || "Ready to Start Your Journey?"}
                        </h2>
                        <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg">
                            {content.subheadline || "Experience high-fidelity coordination and real-time scheduling for your ultimate convenience."}
                        </p>

                        <div className="space-y-4">
                            {(content.options || ["Instant Confirmation", "24/7 Availability", "Secure Authentication"]).map((opt, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#00D09C]/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-[#00D09C]" />
                                    </div>
                                    <span className="text-sm text-white/60 font-medium">{opt}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Date</label>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-white/60 hover:border-[#00D09C]/40 cursor-pointer transition-all">
                                        <span className="text-sm">Pick a day</span>
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Guests</label>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-white/60 hover:border-[#00D09C]/40 cursor-pointer transition-all">
                                        <span className="text-sm">Number</span>
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Preferred Time</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['10:00 AM', '02:00 PM', '08:00 PM'].map(t => (
                                        <div key={t} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center text-[11px] font-bold text-white/40 hover:bg-[#00D09C]/20 hover:text-white hover:border-[#00D09C] cursor-pointer transition-all">
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full h-14 rounded-xl bg-[#00D09C] hover:bg-[#00B085] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#00D09C]/20">
                                {content.ctaText || "Book Your Session"} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

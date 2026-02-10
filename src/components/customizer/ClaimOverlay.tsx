'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stars, ArrowRight, Lock } from 'lucide-react';

interface ClaimOverlayProps {
    isVisible: boolean;
    onClaim: () => void;
}

export default function ClaimOverlay({ isVisible, onClaim }: ClaimOverlayProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl px-4"
        >
            <div className="bg-[#051423]/95 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-center justify-between gap-10 ring-1 ring-white/5">
                <div className="space-y-3 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-primary font-black text-[11px] uppercase tracking-[0.4em]">
                        <Stars className="w-5 h-5 animate-pulse" /> Identity_Synthesis_Complete
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter leading-tight">
                        هل أنت جاهز لتملك إمبراطوريتك؟
                    </h3>
                    <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] leading-relaxed">
                        بضغطة واحدة، اربط هذا الصرح الرقمي بهويتك السيادية. <br className="hidden md:block" /> لا كلمات مرور، لا انتظار.
                    </p>
                </div>

                <button
                    onClick={onClaim}
                    className="group relative px-12 py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_60px_rgba(59,130,246,0.3)] hover:scale-[1.05] active:scale-[0.95] transition-all overflow-hidden border-none shrink-0"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-4">
                        احفظ موقعي العبقري الآن <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                </button>
            </div>
        </motion.div>
    );
}


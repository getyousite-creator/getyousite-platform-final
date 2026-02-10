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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl"
        >
            <div className="bg-black/95 backdrop-blur-3xl border border-primary/30 p-8 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                        <Stars className="w-4 h-4" /> تم توليد إمبراطوريتك
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">هل تود امتلاك هذا التصميم؟</h3>
                    <p className="text-white/40 text-[11px] uppercase tracking-wide">احفظ موقعك الآن بضغطة زر واحدة مجاناً.</p>
                </div>

                <button
                    onClick={onClaim}
                    className="group relative px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-3">
                        احجز موقعي الآن <ArrowRight className="w-4 h-4" />
                    </span>
                </button>
            </div>
        </motion.div>
    );
}

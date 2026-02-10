'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Command, ArrowRight, Zap, RefreshCcw } from 'lucide-react';

interface AICommandBarProps {
    onCommand: (cmd: string) => Promise<void> | void;
    isProcessing: boolean;
}

export default function AICommandBar({ onCommand, isProcessing }: AICommandBarProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isProcessing) {
            onCommand(input);
            setInput('');
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto px-4">
            {/* SHADOW PULSE */}
            <div className="absolute inset-x-4 -top-1 bottom-0 bg-[#00D09C]/5 blur-2xl rounded-full" />

            <form
                onSubmit={handleSubmit}
                className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-[#00D09C]/30 focus-within:border-[#00D09C]/40 group shadow-2xl"
            >
                <div className="flex items-center gap-2 pl-4 text-white/40 group-focus-within:text-[#00D09C] transition-colors">
                    <Command size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">AI_Command:</span>
                </div>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI to change anything... (e.g., 'Make it more professional')"
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 placeholder:text-white/20"
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all
            ${input.trim() && !isProcessing
                            ? 'bg-[#00D09C] text-white shadow-lg hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'}
          `}
                >
                    {isProcessing ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Execute <ArrowRight size={14} />
                        </>
                    )}
                </button>
            </form>

            <div className="flex gap-4 mt-3 px-2">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Suggestions:</span>
                {['Modernize colors', 'Add more sections', 'Translate to AR'].map(s => (
                    <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="text-[9px] text-white/50 hover:text-[#00D09C] transition-colors font-mono"
                    >
                        /{s.replace(' ', '_').toLowerCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}

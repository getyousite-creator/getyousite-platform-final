'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export default function FloatingChat() {
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const personaName = locale === 'ar' ? 'يوسف' : 'JO';
    const isRTL = locale === 'ar';

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`/${locale}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages, locale }),
            });

            if (!response.ok) throw new Error('Neural Bridge Failure');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Stream Decoder Failure');

            const assistantMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

            let accumulatedContent = '';
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Note: the Vercel AI SDK 'toDataStreamResponse' sends a specific format
                // In v4/v6 it might send JSON-serialized chunks. 
                // However, for gpt-4o-mini via streamText, standard decoding of raw text is often sufficient 
                // if we handle the stream decoding properly.

                const chunk = decoder.decode(value);
                // Vercel AI SDK v3/v4 data stream format: 0:"text"
                const parts = chunk.split('\n').filter(Boolean);

                for (const part of parts) {
                    if (part.startsWith('0:')) {
                        const text = JSON.parse(part.slice(2));
                        accumulatedContent += text;
                        setMessages(prev =>
                            prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m)
                        );
                    }
                }
            }
        } catch (error) {
            console.error('CHAT_NEURAL_FAILURE:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("fixed bottom-8 z-[200]", isRTL ? "left-8" : "right-8")}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[380px] h-[500px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{personaName}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Neural Network Active</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Sparkles className="w-8 h-8 text-blue-500/50" />
                                    <p className="text-xs text-slate-500 font-medium max-w-[200px]">
                                        {isRTL ? "أنا يوسف، مستشارك الرقمي. كيف يمكنني مساعدتك اليوم؟" : "I am JO, your digital consultant. How can I architect your success today?"}
                                    </p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "flex gap-3",
                                        m.role === 'user' ? (isRTL ? "flex-row" : "flex-row-reverse") : (isRTL ? "flex-row-reverse" : "flex-row")
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                        m.role === 'user' ? "bg-slate-800" : "bg-blue-600/20 text-blue-400"
                                    )}>
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'user'
                                            ? "bg-slate-900 text-slate-200"
                                            : "bg-blue-600/5 text-slate-300 border border-blue-500/10"
                                    )} dir={isRTL ? "rtl" : "ltr"}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={onFormSubmit} className="p-4 border-t border-white/5 bg-slate-900/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRTL ? "اسأل يوسف..." : "Ask JO..."}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-600/50 transition-colors"
                                    dir={isRTL ? "rtl" : "ltr"}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "absolute top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50",
                                        isRTL ? "left-4" : "right-4"
                                    )}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}

                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
            </motion.button>
        </div>
    );
}

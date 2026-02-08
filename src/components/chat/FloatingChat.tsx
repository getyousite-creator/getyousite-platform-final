'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function FloatingChat() {
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
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

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        const updatedMessages: Message[] = [...messages, userMsg];
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

                const chunk = decoder.decode(value, { stream: true });

                // Robust parsing for Vercel AI SDK Data Stream Format
                // Format: code:"payload"
                // 0: text, 1: data, etc.
                const lines = chunk.split('\n').filter(Boolean);
                for (const line of lines) {
                    try {
                        const firstColonIndex = line.indexOf(':');
                        if (firstColonIndex === -1) continue;

                        const type = line.slice(0, firstColonIndex);
                        const content = line.slice(firstColonIndex + 1);

                        if (type === '0') {
                            const text = JSON.parse(content);
                            accumulatedContent += text;
                            setMessages(prev =>
                                prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m)
                            );
                        } else if (type === '9') {
                            const toolCall = JSON.parse(content);
                            setMessages(prev =>
                                prev.map(m => m.id === assistantMsgId ? {
                                    ...m,
                                    toolInvocations: [...((m as any).toolInvocations || []), toolCall]
                                } : m)
                            );
                        } else if (type === 'a') {
                            const toolResult = JSON.parse(content);
                            setMessages(prev =>
                                prev.map(m => m.id === assistantMsgId ? {
                                    ...m,
                                    toolInvocations: ((m as any).toolInvocations || []).map((ti: any) =>
                                        ti.toolCallId === toolResult.toolCallId ? { ...ti, result: toolResult.result } : ti
                                    )
                                } : m)
                            );
                        }
                    } catch (e) {
                        console.warn('STREAM_PARSE_RECOVERABLE_ERROR:', e);
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
                        className="mb-4 w-[380px] h-[500px] bg-card/90 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                    <Bot className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">{personaName}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Neural Network Active</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Sparkles className="w-8 h-8 text-blue-500/50" />
                                    <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
                                        {isRTL ? "أنا يوسف، مستشارك الرقمي. كيف يمكنني مساعدتك اليوم؟" : "I am JO, your digital consultant. How can I architect your success today?"}
                                    </p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <div key={m.id} className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            m.role === 'user' ? (isRTL ? "flex-row" : "flex-row-reverse") : (isRTL ? "flex-row-reverse" : "flex-row")
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                            m.role === 'user' ? "bg-card text-foreground" : "bg-primary/20 text-primary-foreground"
                                        )}>
                                            {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-card/80 text-foreground font-medium"
                                                : "bg-primary/5 text-muted-foreground border border-primary/10"
                                        )} dir={isRTL ? "rtl" : "ltr"}>
                                            {m.content}
                                        </div>
                                    </motion.div>

                                    {/* TOOL INVOCATION VISUALS (Logic Layer) */}
                                    {(m as any).toolInvocations?.map((toolInvocation: any) => {
                                        const toolCallId = toolInvocation.toolCallId;
                                        const addResult = 'result' in toolInvocation;

                                        return (
                                            <div key={toolCallId} className="px-11">
                                                <div className="p-4 rounded-2xl bg-card/5 border border-border flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full animate-pulse",
                                                            addResult ? "bg-emerald-500" : "bg-amber-500"
                                                        )} />
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural_Action</p>
                                                            <p className="text-xs font-bold text-muted-foreground uppercase italic">
                                                                {toolInvocation.toolName.replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {addResult && (
                                                        <div className="text-[9px] font-black text-emerald-500 uppercase">Success</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={onFormSubmit} className="p-4 border-t border-border bg-card/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRTL ? "اسأل يوسف..." : "Ask JO..."}
                                    className="w-full bg-card border border-border rounded-xl py-3 px-4 pr-12 text-sm text-foreground focus:outline-none focus:border-blue-600/50 transition-colors"
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
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-primary-foreground shadow-[0_10px_30px_rgba(37,99,235,0.4)] relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}

                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                )}
            </motion.button>
        </div>
    );
}

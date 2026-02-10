'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, ArrowLeft, Stars, CheckCircle2 } from 'lucide-react';

interface Step {
    id: number;
    question: string;
    field: string;
    type: 'text' | 'choice' | 'multi';
    options?: { value: string; label: string; icon?: string }[];
}

const steps: Step[] = [
    {
        id: 1,
        question: "ما هو اسم مشروعك أو علامتك التجارية؟",
        field: "brandName",
        type: "text"
    },
    {
        id: 2,
        question: "صف لي عملك في جملتين (مثلاً: مطعم بحري عائلي، أو محامٍ مستقل).",
        field: "description",
        type: "text"
    },
    {
        id: 3,
        question: "ما هو الهدف الرئيسي من موقعك؟",
        field: "goal",
        type: "choice",
        options: [
            { value: 'showcase', label: 'عرض خدماتي', icon: '🎯' },
            { value: 'booking', label: 'استقبال حجوزات', icon: '📅' },
            { value: 'portfolio', label: 'معرض أعمال', icon: '🎨' },
            { value: 'leads', label: 'جمع عملاء', icon: '📧' }
        ]
    },
    {
        id: 4,
        question: "اختر النمط البصري الذي يمثلك:",
        field: "style",
        type: "choice",
        options: [
            { value: 'modern', label: 'عصري وبسيط', icon: '✨' },
            { value: 'classic', label: 'رسمي ومهني', icon: '🏛️' },
            { value: 'warm', label: 'دافئ وودود', icon: '🏠' },
            { value: 'bold', label: 'جريء وإبداعي', icon: '🚀' }
        ]
    }
];

export const AIConversation = ({ onComplete }: { onComplete: (data: any) => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [inputValue, setInputValue] = useState('');

    const step = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setInputValue(answers[steps[currentStep + 1]?.field] || '');
        } else {
            onComplete(answers);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setInputValue(answers[steps[currentStep - 1]?.field] || '');
        }
    };

    const updateAnswer = (val: any) => {
        setAnswers({ ...answers, [step.field]: val });
        if (step.type === 'choice') {
            // Auto advance for choices
            setTimeout(() => {
                if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setInputValue(answers[steps[currentStep + 1]?.field] || '');
                } else {
                    onComplete({ ...answers, [step.field]: val });
                }
            }, 400);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="mb-8 flex justify-between items-center">
                <div className="flex gap-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>
                <span className="text-xs text-white/50 font-mono">الخطوة {currentStep + 1} من {steps.length}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold text-white leading-tight">
                        {step.question}
                    </h2>

                    {step.type === 'text' && (
                        <div className="relative">
                            <input
                                autoFocus
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setAnswers({ ...answers, [step.field]: e.target.value });
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && inputValue && handleNext()}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="اكتب هنا..."
                            />
                        </div>
                    )}

                    {step.type === 'choice' && (
                        <div className="grid grid-cols-2 gap-4">
                            {step.options?.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateAnswer(opt.value)}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${answers[step.field] === opt.value
                                            ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-3xl">{opt.icon}</span>
                                    <span className="font-medium">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                    <ArrowRight className="w-4 h-4" /> العودة
                </button>

                <button
                    onClick={handleNext}
                    disabled={step.type === 'text' && !inputValue}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${step.type === 'text' && !inputValue
                            ? 'bg-white/10 text-white/20 cursor-not-allowed'
                            : 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                        }`}
                >
                    {currentStep === steps.length - 1 ? 'ابدأ العبقرية' : 'المتابعة'} <Stars className="w-4 h-4 fill-current" />
                </button>
            </div>
        </div>
    );
};

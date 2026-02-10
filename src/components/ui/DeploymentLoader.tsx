"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Server, Smartphone, Globe, CheckCircle2, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPLOYMENT_STEPS = [
    { id: 1, label: "بناء النواة العبقرية", icon: Cpu },
    { id: 2, label: "توليد المعمارية السيادية", icon: Server },
    { id: 3, label: "هندسة تجربة المستخدم", icon: Smartphone },
    { id: 4, label: "تحسين محركات البحث بالذكاء الاصطناعي", icon: Globe },
    { id: 5, label: "تأمين الأصل الرقمي النهائي", icon: Shield }
];

interface DeploymentLoaderProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export default function DeploymentLoader({ isVisible, onComplete }: DeploymentLoaderProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isVisible) {
            setCurrentStep(0);
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < DEPLOYMENT_STEPS.length - 1) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    setTimeout(() => onComplete?.(), 800);
                    return prev;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-[#020617]/95 backdrop-blur-3xl"
                >
                    {/* Logic Mesh Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
                    </div>

                    <div className="max-w-lg w-full px-8 relative z-10">
                        <div className="space-y-12">
                            {/* RADAR SCANNER */}
                            <div className="relative flex justify-center">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="w-24 h-24 rounded-full border-t-2 border-r-2 border-primary border-b-transparent border-l-transparent shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Cpu className="w-10 h-10 text-white animate-pulse" />
                                </div>
                            </div>

                            {/* STEPS */}
                            <div className="space-y-4">
                                {DEPLOYMENT_STEPS.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index === currentStep;
                                    const isPast = index < currentStep;

                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: isActive || isPast ? 1 : 0.3,
                                                x: 0,
                                                scale: isActive ? 1.02 : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                "flex items-center gap-5 p-4 rounded-xl border transition-all duration-300",
                                                isActive
                                                    ? "bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                                    : "bg-white/5 border-white/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2.5 rounded-lg transition-colors",
                                                isActive ? "bg-primary text-[#020617]" : "bg-white/10 text-white/40"
                                            )}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn(
                                                    "text-[11px] font-bold uppercase tracking-[0.15em]",
                                                    isActive ? "text-white" : "text-white/40"
                                                )}>
                                                    {step.label}
                                                </p>
                                            </div>
                                            {isPast && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle2 size={18} className="text-primary" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span>حالة بناء النظام</span>
                                    <span>{Math.round(((currentStep + 1) / DEPLOYMENT_STEPS.length) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${((currentStep + 1) / DEPLOYMENT_STEPS.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

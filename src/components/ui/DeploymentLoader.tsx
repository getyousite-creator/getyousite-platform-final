"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Cpu, Zap, Cloud, CheckCircle } from "lucide-react";

const DEPLOYMENT_STEPS = [
    { id: 1, label: "Analyzing Vision Core...", icon: Shield, color: "text-blue-400" },
    { id: 2, label: "Injecting German Engineering...", icon: Cpu, color: "text-purple-400" },
    { id: 3, label: "Orchestrating Blueprint...", icon: Zap, color: "text-yellow-400" },
    { id: 4, label: "Sovereign Cloud Uplink...", icon: Cloud, color: "text-green-400" },
    { id: 5, label: "Mission Complete: Site Active", icon: CheckCircle, color: "text-emerald-400" }
];

interface DeploymentLoaderProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export default function DeploymentLoader({ isVisible, onComplete }: DeploymentLoaderProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < DEPLOYMENT_STEPS.length - 1) return prev + 1;
                    clearInterval(interval);
                    setTimeout(() => onComplete?.(), 1000);
                    return prev;
                });
            }, 1200);
            return () => clearInterval(interval);
        } else {
            setCurrentStep(0);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                >
                    <div className="max-w-md w-full px-8">
                        <div className="space-y-8">
                            {/* LOGO AREA */}
                            <div className="flex justify-center mb-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 rounded-full border-t-2 border-blue-500 border-r-2 border-transparent"
                                />
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
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: isActive || isPast ? 1 : 0.2,
                                                x: 0,
                                                scale: isActive ? 1.05 : 1
                                            }}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"
                                        >
                                            <div className={`p-2 rounded-lg bg-black/40 ${step.color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-white" : "text-zinc-500"}`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                            {isPast && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle size={16} className="text-emerald-500" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${((currentStep + 1) / DEPLOYMENT_STEPS.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

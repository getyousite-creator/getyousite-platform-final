"use client";

import { captureLead } from "@/actions/capture-lead";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Rocket, Sparkles, CheckCircle2, AlertCircle, Activity, MessageSquare, Shield, Cpu, ChevronRight, ChevronLeft } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import DeploymentLoader from "@/shared/components/ui/DeploymentLoader";
import { toast } from "sonner";

export default function LaunchModal() {
    const { isOpen, onClose, visionPrefill, storeContext } = useLaunchModal();
    const t = useTranslations('LaunchModal');
    const [step, setStep] = useState(0);
    const [isDeploying, setIsDeploying] = useState(false);
    const [success, setSuccess] = useState(false);
    const { updateBlueprint } = useTemplateEditor();

    const [formValues, setFormValues] = useState({
        email: "",
        businessName: "",
        activity: visionPrefill || "",
        goal: "showcase"
    });

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setSuccess(false);
            setIsDeploying(false);
            setFormValues(prev => ({ ...prev, activity: visionPrefill || "" }));
        }
    }, [isOpen, visionPrefill]);

    const steps = [
        {
            id: 'email',
            title: t('steps.email'),
            label: t('labels.email'),
            field: 'email',
            placeholder: t('placeholders.email'),
            icon: Shield
        },
        {
            id: 'name',
            title: t('steps.name'),
            label: t('labels.name'),
            field: 'businessName',
            placeholder: t('placeholders.name'),
            icon: Activity
        },
        {
            id: 'activity',
            title: t('steps.activity'),
            label: t('labels.activity'),
            field: 'activity',
            placeholder: t('placeholders.activity'),
            icon: Cpu
        },
        {
            id: 'goal',
            title: t('steps.goal'),
            label: t('labels.goal'),
            field: 'goal',
            type: 'select',
            options: ['showcase', 'lead_gen', 'cv', 'landing_page'],
            icon: Rocket
        }
    ];

    const currentStepData = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleFinalSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleFinalSubmit = async () => {
        setIsDeploying(true);

        const formData = new FormData();
        formData.append("email", formValues.email);
        formData.append("vision", `${formValues.businessName}: ${formValues.activity}. Goal: ${formValues.goal}`);
        formData.append("siteType", "business");
        formData.append("budget", "pro");

        try {
            const { captureLead } = await import("@/actions/capture-lead");
            const result = await captureLead({ success: false }, formData);

            if (result.success && result.blueprint) {
                updateBlueprint(result.blueprint);
                setSuccess(true);
            } else {
                setIsDeploying(false);
                toast.error(result.message || "Protocol Breach: Generation failed.");
            }
        } catch (error) {
            setIsDeploying(false);
            toast.error("Critical Failure in Sovereign Orchestration.");
        }
    };

    const handleDeploymentComplete = () => {
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <>
            <DeploymentLoader isVisible={isDeploying} onComplete={handleDeploymentComplete} />

            <Dialog open={isOpen && !isDeploying} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] bg-[#020617] border-white/5 p-0 overflow-hidden outline-none shadow-[0_0_100px_rgba(59,130,246,0.15)] rounded-[2rem]">
                    <div className="relative p-10 font-sans overflow-hidden">
                        {/* Logic Mesh Overlay */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] -z-10 rounded-full" />

                        <div className="relative z-10 space-y-8">
                            {/* Step Indicator */}
                            {!success && (
                                <div className="flex items-center gap-2 mb-8">
                                    {steps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "h-1 rounded-full transition-all duration-500",
                                                idx === step ? "w-12 bg-primary" : "w-4 bg-white/10"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-12 space-y-8"
                                    >
                                        <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                                            <CheckCircle2 className="w-12 h-12 text-primary" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-white italic tracking-tightest">
                                                {t('success.title')}
                                            </h3>
                                            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.4em] max-w-xs mx-auto">
                                                {t('success.desc')}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                                                    <currentStepData.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <h2 className="text-2xl font-black text-white italic tracking-tightest uppercase">
                                                    {currentStepData.title}
                                                </h2>
                                            </div>
                                            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">
                                                {t('desc')}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D09C] ml-1">
                                                    {currentStepData.label}
                                                </Label>

                                                {currentStepData.type === 'select' ? (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {currentStepData.options?.map((opt) => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => setFormValues({ ...formValues, goal: opt })}
                                                                className={cn(
                                                                    "p-4 rounded-2xl border text-left transition-all",
                                                                    formValues.goal === opt
                                                                        ? "bg-primary/20 border-primary text-primary shadow-premium"
                                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                                                                )}
                                                            >
                                                                <span className="text-[10px] font-black uppercase tracking-widest block">
                                                                    {t(`type_options.${opt}`)}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Input
                                                        value={formValues[currentStepData.field as keyof typeof formValues]}
                                                        onChange={(e) => setFormValues({ ...formValues, [currentStepData.field]: e.target.value })}
                                                        placeholder={currentStepData.placeholder}
                                                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-white text-sm focus:ring-primary focus:border-primary transition-all font-medium"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 pt-4">
                                                {step > 0 && (
                                                    <Button
                                                        onClick={handleBack}
                                                        variant="ghost"
                                                        className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 border border-white/5"
                                                    >
                                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                                        {t('buttons.back')}
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={!formValues[currentStepData.field as keyof typeof formValues]}
                                                    className="flex-1 h-14 rounded-2xl bg-primary hover:bg-[#2563eb] text-[#020617] font-black uppercase tracking-[0.2em] text-[10px] shadow-vip-glow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    {step === steps.length - 1 ? t('buttons.submit') : t('buttons.next')}
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

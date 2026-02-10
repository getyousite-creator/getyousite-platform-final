"use client";

import { ActionState, captureLead } from "@/actions/capture-lead";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Sparkles, CheckCircle2, AlertCircle, Activity, MessageSquare } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";
import { LeadFormValues, LeadSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import DeploymentLoader from "@/components/ui/DeploymentLoader";
import { toast } from "sonner";
import { AIConversation } from "@/components/engine/AIConversation";

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
        goal: "showcase",
        pages: "Home, About, Services, Contact",
        style: "Modern Dark"
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
            title: "Identity Access",
            label: "What is your professional email?",
            field: 'email',
            placeholder: "operator@domain.com",
            icon: Rocket
        },
        {
            id: 'name',
            title: "Protocol Domain",
            label: "What is your business name?",
            field: 'businessName',
            placeholder: "Nexus Solutions",
            icon: Activity
        },
        {
            id: 'activity',
            title: "Action Core",
            label: "Describe your activity in one sentence.",
            field: 'activity',
            placeholder: "A high-end restaurant serving global fusion cuisine...",
            icon: Sparkles
        },
        {
            id: 'goal',
            title: "Logic Goal",
            label: "What is the primary target of this site?",
            field: 'goal',
            type: 'select',
            options: ['showcase', 'lead_gen', 'cv', 'landing_page'],
            icon: MessageSquare
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
            toast.error("Critical Failure in AI Orchestration.");
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
                <DialogContent className="sm:max-w-[600px] bg-[#020617] border-white/5 p-0 overflow-hidden outline-none shadow-[0_0_100px_rgba(59,130,246,0.1)]">
                    <div className="relative p-12 font-sans overflow-hidden">
                        {/* Logic Mesh Overlay */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full" />

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 space-y-8"
                            >
                                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                                    <CheckCircle2 className="w-12 h-12 text-primary" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-white tracking-tight text-center">
                                        تم تأمين البروتوكول بنجاح
                                    </h3>
                                    <p className="text-white/40 text-[11px] uppercase font-bold tracking-[0.3em] text-center">
                                        لقد تم تحليل وتجميع معمارية موقعك بنجاح.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">
                                        إطلاق الإمبراطورية الرقمية
                                    </h2>
                                    <p className="text-white/40 text-sm">
                                        أكد البروتوكول النهائي لنشر موقعك على الإنترنت فوراً
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-[#00D09C]">رابط موقعك السيادي</Label>
                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white/60">
                                            <span className="text-sm font-mono">{storeContext?.name?.toLowerCase().replace(/\s+/g, '-') || 'my-site'}.getyousite.com</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleFinalSubmit()}
                                        className="w-full h-14 rounded-xl bg-[#00D09C] hover:bg-[#00B085] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#00D09C]/20"
                                    >
                                        تأكيد ونشر البروتوكول <Rocket className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

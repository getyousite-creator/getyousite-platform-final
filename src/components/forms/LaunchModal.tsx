"use client";

import { ActionState, captureLead } from "@/actions/capture-lead";
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

export default function LaunchModal() {
    const { isOpen, onClose, visionPrefill, storeContext } = useLaunchModal();
    const t = useTranslations('LaunchModal');
    const [success, setSuccess] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const { updateBlueprint } = useTemplateEditor();

    // 1. FORM SETUP (Context Aware)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LeadFormValues & { fullName?: string, message?: string }>({
        resolver: zodResolver(LeadSchema.extend({
            fullName: z.string().optional(),
            message: z.string().optional()
        })),
        defaultValues: {
            vision: visionPrefill || "",
            budget: "pro",
            email: "",
            siteType: "business",
            fullName: "",
            message: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                vision: visionPrefill || "",
                budget: "pro",
                email: "",
                siteType: "business",
                fullName: "",
                message: ""
            });
            setSuccess(false);
            setIsDeploying(false);
        }
    }, [isOpen, visionPrefill, reset]);

    const onSubmit = async (data: any) => {
        if (storeContext) {
            // GENIUS PATH: Site Lead Capture
            try {
                const { captureStoreLeadAction } = await import("@/actions/lead-actions");
                const res = await captureStoreLeadAction({
                    storeId: storeContext.id,
                    email: data.email,
                    fullName: data.fullName,
                    message: data.message || data.vision
                });
                if (res.success) setSuccess(true);
            } catch (err) {
                console.error("LEAD_CAPTURE_CRITICAL_FAILURE", err);
            }
            return;
        }

        // LEGACY PATH: GetYouSite Blueprint Initiation
        setIsDeploying(true);
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("vision", data.vision);
        formData.append("budget", data.budget);
        formData.append("siteType", data.siteType);

        try {
            const { captureLead } = await import("@/actions/capture-lead");
            const result = await captureLead({ success: false }, formData);

            if (result.success && result.blueprint) {
                updateBlueprint(result.blueprint);
                setSuccess(true);
            } else {
                setIsDeploying(false);
                toast.error(result.message || "Failed to initialize protocol.");
            }
        } catch (error: unknown) {
            setIsDeploying(false);
            console.error("ORCHESTRATION_BREACH:", error);
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
                <DialogContent className="sm:max-w-[500px] bg-[#0A2540] border-white/10 p-0 overflow-hidden outline-none sovereign">
                    <div className="relative p-8 font-sans">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="w-20 h-20 bg-[#00D09C]/20 rounded-full flex items-center justify-center mx-auto border border-[#00D09C]/30 shadow-[0_0_30px_rgba(0,208,156,0.2)]">
                                    <CheckCircle2 className="w-10 h-10 text-[#00D09C]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic">
                                        {storeContext ? "Transmission Successful" : t('success.title')}
                                    </h3>
                                    <p className="text-blue-100/60 text-[10px] uppercase font-bold tracking-widest">
                                        {storeContext ? `Your request has been routed to the administrative hub of ${storeContext.name}.` : t('success.desc')}
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <DialogHeader className="mb-8">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20 text-[#00D09C] text-[10px] font-black uppercase tracking-widest w-fit mb-4">
                                        <Activity className="w-3 h-3" />
                                        {storeContext ? "Sovereign Link" : t('init_sequence')}
                                    </div>
                                    <DialogTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">
                                        {storeContext ? `Contact ${storeContext.name}` : t('title')}
                                    </DialogTitle>
                                    <DialogDescription className="text-blue-200/50 text-[10px] uppercase font-bold tracking-widest mt-4">
                                        {storeContext ? "Establish a direct communication line with the node operator." : t('desc')}
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        {storeContext && (
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">Operator Name</Label>
                                                <Input
                                                    id="fullName"
                                                    {...register("fullName")}
                                                    placeholder="Identification required"
                                                    className="bg-white/5 border-white/10 text-white h-12 focus:ring-[#00D09C]/50 rounded-xl"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">{t('email_label')}</Label>
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder={t('email_placeholder')}
                                                className="bg-white/5 border-white/10 text-white h-12 focus:ring-[#00D09C]/50 rounded-xl"
                                            />
                                            {errors.email && (
                                                <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1 uppercase">
                                                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {!storeContext ? (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="siteType" className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">{t('type_label')}</Label>
                                                    <select
                                                        id="siteType"
                                                        {...register("siteType")}
                                                        className="w-full bg-white/5 border-white/10 rounded-xl h-12 text-sm text-white px-3 focus:outline-none focus:ring-[#00D09C]/50 appearance-none"
                                                    >
                                                        <option value="blog" className="bg-[#0A2540]">{t('type_options.blog')}</option>
                                                        <option value="business" className="bg-[#0A2540]">{t('type_options.business')}</option>
                                                        <option value="store" className="bg-[#0A2540]">{t('type_options.store')}</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="vision" className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">{t('vision_label')}</Label>
                                                    <Input
                                                        id="vision"
                                                        {...register("vision")}
                                                        placeholder={t('vision_placeholder')}
                                                        className="bg-white/5 border-white/10 text-white h-12 focus:ring-[#00D09C]/50 rounded-xl"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">Transmission Message</Label>
                                                <textarea
                                                    id="message"
                                                    {...register("message")}
                                                    placeholder="Enter your inquiry..."
                                                    className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-[#00D09C]/50 min-h-[100px]"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 font-black uppercase tracking-widest bg-[#00D09C] text-[#0A2540] hover:bg-[#00D09C]/90 border-0 rounded-2xl shadow-[0_0_20px_rgba(0,208,156,0.3)] transition-all"
                                    >
                                        {isSubmitting ? "Transmitting..." : (storeContext ? "Submit Inquiry" : t('submit'))}
                                        <Rocket className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

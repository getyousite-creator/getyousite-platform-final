"use client";

import { ActionState, captureLead } from "@/actions/capture-lead";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";
import { LeadFormValues, LeadSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import DeploymentLoader from "@/components/ui/DeploymentLoader";

export default function LaunchModal() {
    const { isOpen, onClose, visionPrefill } = useLaunchModal();
    const t = useTranslations('LaunchModal');
    const [success, setSuccess] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const { updateBlueprint } = useTemplateEditor();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LeadFormValues>({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            vision: visionPrefill || "",
            budget: "pro",
            email: "",
            siteType: "business"
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset({ vision: visionPrefill || "", budget: "pro", email: "", siteType: "business" });
            setSuccess(false);
            setIsDeploying(false);
        }
    }, [isOpen, visionPrefill, reset]);

    const onSubmit = async (data: LeadFormValues) => {
        setIsDeploying(true); // Trigger futuristic loader

        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("vision", data.vision);
        formData.append("budget", data.budget);
        formData.append("siteType", data.siteType);

        try {
            const result = await captureLead({ success: false }, formData);

            if (result.success && result.blueprint) {
                updateBlueprint(result.blueprint);
                setSuccess(true);
            } else {
                setIsDeploying(false);
                alert(result.message || "Failed to initialize protocol.");
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
                <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden outline-none">
                    <div className="relative p-8">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight uppercase">{t('success.title')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('success.desc')}</p>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <DialogHeader className="mb-8">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest w-fit mb-4">
                                        <Sparkles className="w-3 h-3" />
                                        {t('init_sequence')}
                                    </div>
                                    <DialogTitle className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">
                                        {t('title')}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground text-sm mt-4">
                                        {t('desc')}
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">{t('email_label')}</Label>
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder={t('email_placeholder')}
                                                className="bg-background border-input text-foreground h-12 focus:ring-primary/50"
                                            />
                                            {errors.email && (
                                                <p className="text-[10px] text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="siteType" className="text-xs font-bold text-muted-foreground uppercase">{t('type_label')}</Label>
                                            <select
                                                id="siteType"
                                                {...register("siteType")}
                                                className="w-full bg-background border-input rounded-md h-12 text-sm text-foreground px-3 focus:outline-none focus:ring-primary/50 appearance-none"
                                            >
                                                <option value="blog" className="bg-secondary">{t('type_options.blog')}</option>
                                                <option value="business" className="bg-secondary">{t('type_options.business')}</option>
                                                <option value="store" className="bg-secondary">{t('type_options.store')}</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="vision" className="text-xs font-bold text-muted-foreground uppercase">{t('vision_label')}</Label>
                                            <Input
                                                id="vision"
                                                {...register("vision")}
                                                placeholder={t('vision_placeholder')}
                                                className="bg-background border-input text-foreground h-12 focus:ring-primary/50"
                                            />
                                            {errors.vision && (
                                                <p className="text-[10px] text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.vision.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase">{t('tier_label')}</Label>
                                            <select
                                                {...register("budget")}
                                                className="w-full bg-background border-input rounded-md h-12 text-sm text-foreground px-3 focus:outline-none focus:ring-primary/50 appearance-none"
                                            >
                                                <option value="starter" className="bg-secondary">{t('tier_options.starter')}</option>
                                                <option value="pro" className="bg-secondary">{t('tier_options.pro')}</option>
                                                <option value="business" className="bg-secondary">{t('tier_options.business')}</option>
                                                <option value="enterprise" className="bg-secondary">{t('tier_options.enterprise')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        variant="glow"
                                        className="w-full h-14 font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border-0"
                                    >
                                        {isSubmitting ? t('submitting') : t('submit')}
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

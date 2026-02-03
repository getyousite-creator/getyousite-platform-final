"use client";

import { ActionState, captureLead } from "@/actions/capture-lead";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { LeadFormValues, LeadSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import DeploymentLoader from "@/components/ui/DeploymentLoader";

export default function LaunchModal() {
    const { isOpen, onClose, visionPrefill } = useLaunchModal();
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
                <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 p-0 overflow-hidden outline-none">
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
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">Transmission Received</h3>
                                    <p className="text-zinc-500 text-sm">Your sovereign site is active. Initializing UI...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <DialogHeader className="mb-8">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest w-fit mb-4">
                                        <Sparkles className="w-3 h-3" />
                                        Initialize Sequence
                                    </div>
                                    <DialogTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                        Launch Your <br />
                                        <span className="text-blue-500">Digital Empire</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-500 text-sm mt-4">
                                        Confirm your professional vision and initiate the Sovereign Protocol deployment.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase">Comm_Link (Email)</Label>
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder="commander@getyousite.com"
                                                className="bg-white/5 border-white/10 text-zinc-100 h-12 focus:ring-blue-500/50"
                                            />
                                            {errors.email && (
                                                <p className="text-[10px] text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="siteType" className="text-xs font-bold text-zinc-500 uppercase">What are you building?</Label>
                                            <select
                                                id="siteType"
                                                {...register("siteType")}
                                                className="w-full bg-white/5 border border-white/10 rounded-md h-12 text-sm text-zinc-100 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                            >
                                                <option value="blog" className="bg-zinc-900">Personal / Blog Presence</option>
                                                <option value="business" className="bg-zinc-900">Professional Business Site</option>
                                                <option value="store" className="bg-zinc-900">E-commerce / Online Store</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="vision" className="text-xs font-bold text-zinc-500 uppercase">Vision_Matrix (Description)</Label>
                                            <Input
                                                id="vision"
                                                {...register("vision")}
                                                placeholder="AI-powered ecosystem for luxury real estate..."
                                                className="bg-white/5 border-white/10 text-zinc-100 h-12 focus:ring-blue-500/50"
                                            />
                                            {errors.vision && (
                                                <p className="text-[10px] text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.vision.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-zinc-500 uppercase">Service_Tier</Label>
                                            <select
                                                {...register("budget")}
                                                className="w-full bg-white/5 border border-white/10 rounded-md h-12 text-sm text-zinc-100 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                            >
                                                <option value="starter" className="bg-zinc-900">Starter - Personal Presence</option>
                                                <option value="pro" className="bg-zinc-900">Pro - Professional Empire</option>
                                                <option value="business" className="bg-zinc-900">Business - Scalable Infrastructure</option>
                                                <option value="enterprise" className="bg-zinc-900">Enterprise - Sovereign Custom</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        variant="glow"
                                        className="w-full h-14 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white border-0"
                                    >
                                        {isSubmitting ? "Orchestrating..." : "Launch Protocol"}
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

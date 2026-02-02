"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, DollarSign, ShieldCheck, Upload, CheckCircle2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Script from "next/script";
import { submitPaymentProofAction } from "@/app/actions/payment-actions";

interface CheckoutModuleProps {
    planId: "starter" | "pro" | "business" | "enterprise";
    siteType: "blog" | "business" | "store";
    currency: "MAD" | "USD";
    amount: string;
    onSuccess: () => void;
}

export const CheckoutModule = ({ planId, siteType, currency, amount, onSuccess }: CheckoutModuleProps) => {
    const [method, setMethod] = useState<"card" | "local">("card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    // PAYPAL INTEGRATION (BASED ON USER DATA)
    const PAYPAL_CLIENT_ID = "BAAQAqL5S1GSIIaFYyUFHc1spAUiiwg2iQT2tfIvyNhtLOXQj5RBD9nhPNPlIhwl2XTlNoovU6U_Vmq2Zc";
    const HOSTED_BUTTON_ID = "7CNRL6QR9UFM2";

    useEffect(() => {
        // Force re-render of PayPal button when method changes to 'card'
        if (method === 'card' && (window as any).paypal) {
            renderPayPalButtons();
        }
    }, [method]);

    const renderPayPalButtons = () => {
        const container = document.getElementById("paypal-container-7CNRL6QR9UFM2");
        if (container) {
            container.innerHTML = ""; // Clear
            if ((window as any).paypal) {
                (window as any).paypal.HostedButtons({
                    hostedButtonId: HOSTED_BUTTON_ID,
                }).render("#paypal-container-7CNRL6QR9UFM2");
            }
        }
    };

    const handleLocalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Logic: Submit Payment Request to Supabase via Server Action
            const result = await submitPaymentProofAction(planId, siteType, 'cih', 'https://placeholder-receipt.com'); // Placeholder URL for now

            if (result.success) {
                setIsUploaded(true);
                toast.success("Reçu envoyé avec succès. Validation en cours.");
                onSuccess();
            } else {
                toast.error(result.error || "Failed to submit request.");
            }
        } catch (error) {
            toast.error("An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-2xl max-w-xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black italic tracking-tight">SOVEREIGN CHECKOUT</h2>
                <div className="px-4 py-1.5 bg-zinc-950 text-white text-[10px] font-bold uppercase rounded-full">
                    {planId} TIERS
                </div>
            </div>

            {/* METHOD SELECTOR */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setMethod("card")}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === "card" ? "border-zinc-950 bg-zinc-950 text-white shadow-xl" : "border-zinc-100 text-zinc-400 hover:border-zinc-200"
                        }`}
                >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Card / PayPal</span>
                </button>
                <button
                    onClick={() => setMethod("local")}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === "local" ? "border-zinc-950 bg-zinc-950 text-white shadow-xl" : "border-zinc-100 text-zinc-400 hover:border-zinc-200"
                        }`}
                >
                    <Landmark className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Morocco Local</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {method === "card" ? (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="p-6 bg-zinc-50 rounded-2xl flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Total_Amount</div>
                                <div className="text-3xl font-black">{amount} {currency}</div>
                            </div>
                            <ShieldCheck className="w-10 h-10 text-emerald-500" />
                        </div>

                        {/* PAYPAL CONTAINER */}
                        <div id="paypal-container-7CNRL6QR9UFM2" className="min-h-[150px] flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-2xl bg-white">
                            {!(window as any).paypal && <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />}
                        </div>

                        <Script
                            src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&currency=USD`}
                            onLoad={renderPayPalButtons}
                        />

                        <p className="text-[10px] text-center text-zinc-400 font-medium">
                            Secured by PayPal Encryption. SSL Protected.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="local"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* LOCAL BANK DETAILS */}
                        <div className="p-6 bg-zinc-950 text-white rounded-3xl space-y-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Transfer Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-[10px] font-bold uppercase text-zinc-400">CIH Bank</span>
                                        <span className="text-xs font-mono font-bold">230 450 1234567890 01</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-[10px] font-bold uppercase text-zinc-400">Barid Bank</span>
                                        <span className="text-xs font-mono font-bold">181 330 9876543210 55</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase text-zinc-400">CashPlus</span>
                                        <span className="text-xs font-bold italic">REDA EL MOURADI</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                        </div>

                        {/* PROOF UPLOAD */}
                        <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-8 text-center bg-zinc-50 hover:bg-zinc-100/50 transition-colors cursor-pointer relative overflow-hidden">
                            {isUploaded ? (
                                <div className="space-y-4 py-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">Reçu Téléchargé</h4>
                                    <p className="text-[10px] text-zinc-400 font-medium">Votre demande est en cours de traitement par notre équipe.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 py-4" onClick={() => setIsUploaded(true)}>
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-zinc-400">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">Upload Your Receipt</h4>
                                    <p className="text-[10px] text-zinc-400 font-medium italic">Veuillez envoyer une capture d'écran du virement.</p>
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full h-16 rounded-2xl bg-zinc-950 text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                            onClick={handleLocalSubmit}
                            disabled={!isUploaded || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Confirm Payment Request"
                            )}
                        </Button>

                        <div className="flex gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-[9px] text-blue-600 font-medium leading-relaxed uppercase tracking-tighter">
                                La validation manuelle peut prendre de 1 à 12 heures. Pour une activation immédiate, utilisez PayPal.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

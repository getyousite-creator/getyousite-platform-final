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

const BankPortal = ({ name, account, rib }: { name: string, account: string, rib: string }) => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} Copied to Clipboard`);
    };

    return (
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3 group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{name}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleCopy(account, 'Account Number')}
                        className="text-[8px] font-black uppercase tracking-tighter text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                    >
                        Copy_Acc
                    </button>
                    <button
                        onClick={() => handleCopy(rib, 'RIB')}
                        className="text-[8px] font-black uppercase tracking-tighter text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-md"
                    >
                        Copy_RIB
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-zinc-300 select-all">{rib}</span>
                <span className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Acc: {account}</span>
            </div>
        </div>
    );
};

export const CheckoutModule = ({ planId, siteType, currency, amount, onSuccess }: CheckoutModuleProps) => {
    const [method, setMethod] = useState<"card" | "local">(currency === "MAD" ? "local" : "card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    // PAYPAL INTEGRATION (Dynamic Environment Logic)
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAAQAqL5S1GSIIaFYyUFHc1spAUiiwg2iQT2tfIvyNhtLOXQj5RBD9nhPNPlIhwl2XTlNoovU6U_Vmq2Zc";
    const HOSTED_BUTTON_ID = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID || "7CNRL6QR9UFM2";

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
            if (isCouponApplied) {
                const { activateInstantSubscriptionAction } = await import("@/app/actions/payment-actions");
                const result = await activateInstantSubscriptionAction(planId, siteType);
                if (result.success) {
                    toast.success("SOVEREIGN_ACCESS_ACTIVATED: Welcome Architect.");
                    onSuccess();
                } else {
                    toast.error(result.error || "Activation Failure");
                }
                return;
            }

            // Logic: Submit Payment Request to Supabase via Server Action
            const result = await submitPaymentProofAction(planId, siteType, 'cih', 'https://placeholder-receipt.com'); // Placeholder URL for now
            // ...

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

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'RAZANETEST') {
            setDiscount(1.0);
            setIsCouponApplied(true);
            toast.success("COUPON_RAZANE_ACTIVATED: 100% Discount Applied");
        } else {
            toast.error("INVALID_COUPON: Authentication Breach");
        }
    };

    const finalAmount = isCouponApplied ? "0.00" : amount;

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

            {/* COUPON INPUT */}
            {!isCouponApplied && (
                <div className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="ENTER_COUPON"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-zinc-300 transition-colors"
                    />
                    <Button
                        onClick={handleApplyCoupon}
                        variant="ghost"
                        className="bg-zinc-950 text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl"
                    >
                        APPLY
                    </Button>
                </div>
            )}
            {isCouponApplied && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Coupon_Active: RAZANETEST (-100%)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
            )}

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
                                <div className="text-3xl font-black">{finalAmount} {currency}</div>
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
                        <div className="p-6 bg-zinc-950 text-white rounded-3xl space-y-6 relative overflow-hidden border border-white/5 shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Official_Financial_Channels</h3>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                                </div>
                                <div className="space-y-5">
                                    <BankPortal
                                        name="CIH BANK"
                                        account="4682850211031600"
                                        rib="230022468285021103160034"
                                    />
                                    <BankPortal
                                        name="BARID BANK"
                                        account="1762740"
                                        rib="350810000000000176274005"
                                    />
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">CashPlus_Transfer</span>
                                            <div className="text-[11px] font-black text-white uppercase italic">REDA EL MOURADI</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative background accent */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
                        </div>

                        {/* WARNING: IDENTITY TAGGING */}
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-amber-200/80 font-bold uppercase tracking-tight leading-relaxed font-arabic">
                                <span className="text-amber-500">تحذير:</span> يجب وضع اسم المستخدم أو البريد الإلكتروني في وصف التحويل لضمان تفعيل حسابك.
                                <br />
                                <span className="text-amber-400">NOTE:</span> Always include your Email in the transfer description.
                            </p>
                        </div>

                        {/* PROOF UPLOAD PROTOCOL (Bypassed if Coupon Applied) */}
                        {!isCouponApplied && (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-8 text-center bg-zinc-50 hover:bg-zinc-100/50 transition-all cursor-pointer group" onClick={() => setIsUploaded(true)}>
                                    {isUploaded ? (
                                        <div className="space-y-2 py-2">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-[11px] font-black uppercase tracking-tight">Receipt_Uploaded</h4>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 py-2">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-zinc-400 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Step 1: Upload_Receipt</h4>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase">Click to browse files</p>
                                        </div>
                                    )}
                                </div>

                                <motion.div
                                    className="p-5 bg-zinc-950 rounded-2xl border border-white/10 shadow-xl"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-600/30">
                                            <span className="text-blue-500 text-[10px] font-black">2</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Express_Activation (30-min)</h4>
                                            <p className="text-[9px] text-zinc-400 font-bold leading-relaxed uppercase tracking-tight">
                                                Forward your receipt image to <span className="text-blue-400 select-all">GETYOUSITE@GMAIL.COM</span> for rapid validation protocol.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        <Button
                            className="w-full h-16 rounded-2xl bg-zinc-950 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.01] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                            onClick={handleLocalSubmit}
                            disabled={(!isUploaded && !isCouponApplied) || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                isCouponApplied ? "ACTIVATE_FREE_TRIAL" : "ACTIVATE_SOVEREIGN_PROTOCOL"
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";

interface PaymentModuleProps {
    siteId: string;
}

export function PaymentModule({ siteId }: PaymentModuleProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-8 border-t border-white/5"
        >
            <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-black mb-4 text-center">
                    Secure Sovereign Payment
                </p>
                <div className="overflow-hidden rounded-xl">
                    <PayPalButtons
                        style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                        createOrder={async () => {
                            const res = await fetch('/api/paypal/create-order', {
                                method: 'POST',
                                body: JSON.stringify({ siteId })
                            });
                            const data = await res.json();
                            return data.id;
                        }}
                        onApprove={async (data) => {
                            const res = await fetch('/api/paypal/capture-order', {
                                method: 'POST',
                                body: JSON.stringify({ orderId: data.orderID })
                            });
                            const result = await res.json();
                            if (result.success) {
                                router.push(`/success/${result.siteId}`);
                            }
                        }}
                    />
                </div>
            </div>
            <p className="text-[9px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                Instant AI Infrastructure Activation
            </p>
        </motion.div>
    );
}

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import { CustomizerEngine } from '@/lib/engine/customizer';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BlueprintPersistence } from '@/lib/engine/persistence';
import { CommandCenter } from '@/components/customizer/CommandCenter';
import { PreviewCanvas } from '@/components/customizer/PreviewCanvas';
import { PaymentModule } from '@/components/customizer/PaymentModule';

export default function CustomizerPage() {
    const { blueprint, updateBlueprint, isGenerating, setIsGenerating } = useTemplateEditor();
    const [vision, setVision] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [selectedId, setSelectedId] = useState("t1-quantum");
    const [showPay, setShowPay] = useState(false);

    const triggerGeneration = useCallback(async () => {
        if (!vision || !businessName) return;

        setIsGenerating(true);
        try {
            const finalBlueprint = await CustomizerEngine.generateFinalBlueprint({
                businessName,
                niche: "General Innovation",
                vision,
                selectedId
            });
            updateBlueprint(finalBlueprint);
            setShowPay(true);
            await BlueprintPersistence.archive(finalBlueprint);
        } catch (error) {
            console.error("ORCHESTRATION_FAILURE:", error);
        } finally {
            setIsGenerating(false);
        }
    }, [vision, businessName, selectedId, setIsGenerating, updateBlueprint]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (vision && businessName) triggerGeneration();
        }, 1500);
        return () => clearTimeout(timer);
    }, [vision, businessName, selectedId, triggerGeneration]);

    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            currency: "USD",
            intent: "capture"
        }}>
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
                {/* LEFT SIDE: COMMAND CENTER */}
                <aside className="w-full md:w-1/3 border-r border-white/5 p-8 overflow-y-auto bg-zinc-950/50 backdrop-blur-xl z-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                    <CommandCenter
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        vision={vision}
                        setVision={setVision}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        isGenerating={isGenerating}
                        onGenerate={triggerGeneration}
                    />

                    {showPay && (
                        <PaymentModule siteId={blueprint?.id || "temp_id"} />
                    )}
                </aside>

                {/* RIGHT SIDE: LIVE PREVIEW CANVAS */}
                <main className="flex-1 bg-zinc-900 overflow-hidden relative p-8 md:p-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                    <PreviewCanvas blueprint={blueprint} isGenerating={isGenerating} />
                </main>
            </div>
        </PayPalScriptProvider>
    );
}

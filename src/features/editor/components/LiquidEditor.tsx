"use client";

import React, { useState, useEffect, useCallback } from 'react';
import SiteSandbox from './SiteSandbox';
import ContextualOmniBar from './ContextualOmniBar';
import SynthesisCommandHub from './SynthesisCommandHub';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Laptop, Save, Undo2, Redo2, ChevronLeft, Activity, Zap } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useEditorStore } from '../store/useEditorStore';
import { getStoreAction, saveStoreAction } from '@/app/actions/store-actions';
import { convertEntitiesToBlueprint } from '@/lib/editor/bridge';
import { SiteBlueprint } from '@/lib/schemas';
import { toast } from 'sonner';

export default function LiquidEditor() {
    const { siteId } = useParams();
    const router = useRouter();
    const [viewport, setViewport] = useState('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [originalBlueprint, setOriginalBlueprint] = useState<SiteBlueprint | null>(null);

    const [isPublishing, setIsPublishing] = useState(false);
    const [deploymentStage, setDeploymentStage] = useState(0);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [userTier, setUserTier] = useState('starter');

    const { entities, rootIds, loadBlueprint, isHydrated, undo, redo, historyIndex, history } = useEditorStore();

    const DEPLOY_STAGES = [
        "Synthesizing_Genetic_Material...",
        "Provisioning_Quantum_Edge...",
        "Polishing_Sovereign_Assets...",
        "Propagating_Empire_Nodes...",
        "Sovereignty_Established!"
    ];

    // HYDRATION CIRCUIT
    useEffect(() => {
        if (!siteId) return;

        const hydrate = async () => {
            // Parallel fetch: Store + Subscription
            const [storeRes, billingRes] = await Promise.all([
                getStoreAction(siteId as string),
                import('@/app/actions/billing-actions').then(m => m.getSubscriptionStatusAction())
            ]);

            if (storeRes.success && storeRes.data?.blueprint) {
                setOriginalBlueprint(storeRes.data.blueprint);
                loadBlueprint(storeRes.data.blueprint);
            }

            if (billingRes.success && billingRes.data) {
                setUserTier(billingRes.data.tier);
            }
        };

        hydrate();
    }, [siteId, loadBlueprint]);

    // SAVE CIRCUIT
    const handleSave = async (silent = false) => {
        if (!originalBlueprint || !siteId) return false;
        if (!silent) setIsSaving(true);

        try {
            const nextBlueprint = convertEntitiesToBlueprint(entities, rootIds, originalBlueprint);
            const result = await saveStoreAction(
                nextBlueprint,
                originalBlueprint.name,
                originalBlueprint.description,
                siteId as string
            );

            if (result.success) {
                if (!silent) toast.success("Site Synced Successfully");
                setOriginalBlueprint(nextBlueprint);
                return true;
            } else {
                if (!silent) toast.error(result.error || "Sync Failed");
                return false;
            }
        } catch (e) {
            if (!silent) toast.error("Network anomaly in Sync Protocol");
            return false;
        } finally {
            if (!silent) setIsSaving(false);
        }
    };

    // PUBLISH CIRCUIT (The Moment of Triumph)
    const handlePublish = async () => {
        // 1. Economic Guard: Radical Truth
        if (userTier === 'starter') {
            setShowUpgradeDialog(true);
            return;
        }

        setIsPublishing(true);
        setDeploymentStage(0);

        // 2. Final Sync
        const synced = await handleSave(true);
        if (!synced) {
            setIsPublishing(false);
            return;
        }

        // 3. Orchestration Sequence
        for (let i = 0; i < DEPLOY_STAGES.length - 1; i++) {
            setDeploymentStage(i);
            await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
        }

        setDeploymentStage(DEPLOY_STAGES.length - 1);
        toast.success("Empire Deployed Successfully");

        setTimeout(() => {
            setIsPublishing(false);
            router.push(`/dashboard`);
        }, 2000);
    };

    const handleUpgrade = async () => {
        const { initiateUpgradeAction } = await import('@/app/actions/billing-actions');
        const tid = toast.loading("Provisioning Empire Access...");
        const res = await initiateUpgradeAction(siteId as string);

        if (res.success) {
            setUserTier('pro');
            setShowUpgradeDialog(false);
            toast.success("Empire_Status: PRO Activated", { id: tid });
        } else {
            toast.error(res.error || "Handshake Failure", { id: tid });
        }
    };

    const currentViewport = VIEWPORTS.find(v => v.id === viewport) || VIEWPORTS[3];

    if (!isHydrated) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center text-white">
                <Activity className="w-12 h-12 text-neon-lime animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing_Liquid_State...</span>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col overflow-hidden text-white">
            {/* Strategic DEPLOYMENT HUD Overlay */}
            <AnimatePresence>
                {isPublishing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-obsidian/95 backdrop-blur-3xl flex flex-col items-center justify-center"
                    >
                        <div className="w-full max-w-sm px-12">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neon-lime mb-1">Strategic_Deployment</span>
                                    <span className="text-[8px] font-bold text-white/30 tracking-tighter uppercase">{originalBlueprint?.id}</span>
                                </div>
                                <Activity className="w-5 h-5 text-neon-lime animate-spin" />
                            </div>

                            <div className="space-y-4 mb-12">
                                {DEPLOY_STAGES.map((s, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={deploymentStage >= idx ? { x: 0, opacity: 1 } : { x: -10, opacity: 0.2 }}
                                        className={`flex items-center gap-3 ${deploymentStage === idx ? 'text-neon-lime scale-105 origin-left transition-all' : 'text-white/40'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${deploymentStage >= idx ? 'bg-neon-lime shadow-[0_0_10px_#bef264]' : 'bg-white/10'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(deploymentStage / (DEPLOY_STAGES.length - 1)) * 100}%` }}
                                    className="h-full bg-neon-lime shadow-[0_0_20px_#bef264]"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SOVEREIGN HEADER */}
            <header className="h-16 border-b border-white/5 bg-obsidian flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push(`/dashboard`)}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-lime">Sovereign_Editor v3.2</span>
                        <span className="text-xs font-bold text-white/60 truncate max-w-[120px]">{originalBlueprint?.name || 'Loading_Asset...'}</span>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <SynthesisCommandHub originalBlueprint={originalBlueprint} />
                </div>

                {/* VIEWPORT CONTROLS */}
                <div className="flex items-center bg-white/5 rounded-2xl p-1 gap-1 border border-white/5">
                    {VIEWPORTS.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setViewport(v.id)}
                            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${viewport === v.id ? 'bg-neon-lime text-obsidian shadow-vip-glow' : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <v.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 mr-4">
                        <button
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                        >
                            <Undo2 className="w-4 h-4" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Undo (Step {historyIndex})</span>
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 disabled:opacity-20 disabled:cursor-not-allowed group relative"
                        >
                            <Redo2 className="w-4 h-4" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Redo</span>
                        </button>
                    </div>

                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving || isPublishing}
                        className={`px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sync
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={`px-6 py-2.5 rounded-xl bg-neon-lime text-obsidian text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-vip-glow`}
                    >
                        <Zap className="w-4 h-4" />
                        Go_Live
                    </button>
                </div>
            </header>

            {/* CANVAS AREA */}
            <main className="flex-1 relative flex items-center justify-center p-12 bg-[#020617] overflow-auto custom-scrollbar">
                <motion.div
                    animate={{ width: currentViewport.width }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="h-full bg-white rounded-t-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative"
                >
                    <div className="absolute top-0 inset-x-0 h-6 bg-zinc-100 border-b border-zinc-200 flex items-center justify-center gap-1.5 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                    </div>
                    <div className="pt-6 h-full">
                        <SiteSandbox />
                    </div>
                </motion.div>
            </main>

            <ContextualOmniBar />

            {/* UPGRADE DIALOG - Economic Authority */}
            <AnimatePresence>
                {showUpgradeDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[210] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-obsidian border border-neon-lime/30 p-10 rounded-[3rem] max-w-lg w-full text-center space-y-8 shadow-[0_0_100px_rgba(190,242,100,0.1)]"
                        >
                            <div className="w-20 h-20 bg-neon-lime/10 rounded-3xl border border-neon-lime/20 flex items-center justify-center mx-auto">
                                <Zap className="w-10 h-10 text-neon-lime" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Empire_Expansion_Required</h2>
                                <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Protocol Limit: STARTER_NODE cannot propagate to GLOBAL_EDGE.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-left">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-neon-lime shadow-[0_0_10px_#bef264]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Custom Domain Sovereignty</span>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-neon-lime shadow-[0_0_10px_#bef264]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Unlimited Strategic Generations</span>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    onClick={handleUpgrade}
                                    className="w-full py-5 bg-neon-lime text-obsidian font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-vip-glow"
                                >
                                    Initiate_Upgrade ($99/mo)
                                </button>
                                <button
                                    onClick={() => setShowUpgradeDialog(false)}
                                    className="w-full py-4 text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                                >
                                    Return_to_Sandbox
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const VIEWPORTS = [
    { id: 'mobile', icon: Smartphone, width: 375, label: 'Mobile' },
    { id: 'tablet', icon: Tablet, width: 768, label: 'Tablet' },
    { id: 'laptop', icon: Laptop, width: 1024, label: 'Laptop' },
    { id: 'desktop', icon: Monitor, width: 1440, label: 'Desktop' },
];

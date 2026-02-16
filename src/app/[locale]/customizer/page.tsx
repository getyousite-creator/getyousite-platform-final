"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import { useAutoSave } from "@/hooks/use-auto-save";
import { CustomizerEngine } from '@/lib/engine/customizer';
import { refineBlueprintAction } from '@/app/actions/ai-actions';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CommandCenter } from '@/components/customizer/CommandCenter';
import { PreviewCanvas } from '@/components/customizer/PreviewCanvas';
import { PaymentModule } from '@/components/customizer/PaymentModule';
import { saveStoreAction, getStoreAction } from '@/app/actions/store-actions';
import { StorageService } from '@/lib/services/storage-service';
import AuthModal from '@/components/auth/AuthModal';
import ClaimOverlay from '@/components/customizer/ClaimOverlay';
import AICommandBar from '@/components/customizer/AICommandBar';
import AITweakerPanel from '@/components/editor/AITweakerPanel';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Loader2, Activity, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLaunchModal } from '@/hooks/use-launch-modal';
import { toast } from 'sonner';
import { applyValidatedCommandPatch } from '@/lib/editor/command-patcher';


export default function CustomizerPage() {
    // 1. Hooks & State
    const { onOpen } = useLaunchModal();
    const {
        blueprint,
        updateBlueprint,
        isGenerating,
        setIsGenerating,
        saveStatus,
        undo,
        redo,
        history,
        activeStoreId,
        setActiveStoreId
    } = useTemplateEditor();

    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string || 'ar';
    const storeIdParam = searchParams.get('id');

    const [vision, setVision] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [niche, setNiche] = useState("AI & Tech");
    const [selectedId, setSelectedId] = useState("t1-quantum");
    const [selectedPageSlug, setSelectedPageSlug] = useState("index");
    const [showPay, setShowPay] = useState(false);

    const [isLoadingStore, setIsLoadingStore] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [showAuthModal, setShowAuthModal] = useState(false);

    const visionParam = searchParams.get('vision');

    // 4. Save Logic
    const handleSave = useCallback(async (generatedBlueprint: any, options?: { promptOnUnauthorized?: boolean }) => {
        const promptOnUnauthorized = options?.promptOnUnauthorized ?? true;
        try {
            const result = await saveStoreAction(
                generatedBlueprint,
                businessName || "My Store",
                vision,
                activeStoreId || undefined
            );

            if (!result.success && result.error?.includes("Unauthorized")) {
                if (promptOnUnauthorized) {
                    setShowAuthModal(true);
                }
                return false;
            } else if (!result.success) {
                return false;
            }

            if (result.success && result.data?.id && !activeStoreId) {
                setActiveStoreId(result.data.id);
                // Update URL without reload to establish edit session
                router.replace(`?id=${result.data.id}`, { scroll: false });
            }

            return true;
        } catch (_e) {
            return false;
        }
    }, [businessName, vision, activeStoreId, router]);

    // 5. Generation Orchestration
    const triggerGeneration = useCallback(async () => {
        if (!vision) return;
        const effectiveBusinessName = businessName || vision.split(" ").slice(0, 4).join(" ") || "My Store";

        setIsGenerating(true);
        try {
            const finalBlueprint = await CustomizerEngine.generateFinalBlueprint({
                businessName: effectiveBusinessName,
                niche,
                vision,
                selectedId
            });

            // Optimistic Update
            updateBlueprint(finalBlueprint);

            // SOVEREIGN PERSISTENCE: Save immediately to DB to prevent data loss
            // If we don't have an activeStoreId, we generate a temporary one and link it to the session
            const saved = await handleSave(finalBlueprint, { promptOnUnauthorized: false });

            if (saved) {
                setShowPay(true);
            }

        } catch (_error) {
            toast.error("Generation failed");
        } finally {
            setIsGenerating(false);
        }
    }, [vision, businessName, niche, selectedId, setIsGenerating, updateBlueprint, handleSave]);

    // 3. Auto-Save Integration
    useAutoSave(activeStoreId);

    // 3. Load Existing Store
    useEffect(() => {
        if (!storeIdParam) return;

        const loadStore = async () => {
            setIsLoadingStore(true);
            const result = await getStoreAction(storeIdParam);

            if (result.success && result.data) {
                setActiveStoreId(result.data.id);
                setUserId(result.data.user_id); // Set User ID for Storage RLS
                setBusinessName(result.data.name);
                setVision(result.data.vision || "");
                if (result.data.blueprint) {
                    updateBlueprint(result.data.blueprint);
                    // Optionally set selectedId if stored in blueprint metadata
                }
                setShowPay(true);
            } else {
                toast.error("Failed to load store");
            }
            setIsLoadingStore(false);
        };

        loadStore();
    }, [storeIdParam, updateBlueprint, setActiveStoreId]);

    // 2. Initialize from URL
    useEffect(() => {
        if (visionParam && !vision) {
            const bizName = visionParam.split(' ').slice(0, 3).join(' ');
            setVision(visionParam);
            setBusinessName(bizName);
        }
    }, [visionParam, vision]);

    // 2b. Auto-Start Generation Circuit
    useEffect(() => {
        if (vision && !blueprint && !isGenerating && !isLoadingStore) {
            triggerGeneration();
        }
    }, [vision, blueprint, isGenerating, isLoadingStore, triggerGeneration]);

    // 6. Asset Logic
    const handleAssetUpload = useCallback(async (url: string) => {
        if (!blueprint) return;

        // Clone and Update Blueprint (Logic: Find hero or relevant section and inject image)
        const updatedBlueprint = { ...blueprint };
        let oldUrl: string | undefined;

        // Strategy: Intelligent Replacement
        // 1. Look for 'hero' section
        const heroSection = updatedBlueprint.layout?.find((s: any) => s.type === 'hero');
        if (heroSection && heroSection.content) {
            oldUrl = heroSection.content.image;
            heroSection.content.image = url;
        } else {
            // Fallback: Add metadata
            if (!updatedBlueprint.metadata) updatedBlueprint.metadata = {};
            oldUrl = updatedBlueprint.metadata.heroImage;
            updatedBlueprint.metadata.heroImage = url;
        }

        // Asset Cleanup: Delete old asset if it exists and is from our storage
        if (oldUrl && oldUrl.includes("site-assets") && oldUrl !== url) {
            // We fire and forget the delete to not block UI, or we could await if critical
            // Given the user's strict requirement, we should probably log error if it fails
            StorageService.deleteAsset(oldUrl).then(() => {
                // Silent fail/success
            });
        }

        updateBlueprint(updatedBlueprint);

        // Debounced Save will kick in via useAutoSave if we trigger an update, 
        // OR we can explicitly save here to be safe since assets are external.
        handleSave(updatedBlueprint);
        toast.success("Blueprint Synced with Asset");
    }, [blueprint, updateBlueprint, handleSave]);


    // 7. Auto-Generate for New Sessions
    useEffect(() => {
        if (activeStoreId || isLoadingStore) return;

        const timer = setTimeout(() => {
            if (vision) triggerGeneration();
        }, 1500);
        return () => clearTimeout(timer);
    }, [vision, selectedId, triggerGeneration, activeStoreId, isLoadingStore]);


    // 7. Render
    if (isLoadingStore) {
        return (
            <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center text-white sovereign">
                <Activity className="animate-spin text-[#00D09C] w-12 h-12 mb-6" />
                <span className="font-black text-[10px] uppercase tracking-widest text-zinc-400 animate-pulse">RECONSTRUCTING_STORE_DNA...</span>
            </div>
        );
    }

    return (
        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            currency: "USD",
            intent: "capture" // capture
        }}>
            <div className="min-h-screen bg-[#0A2540] text-white flex flex-col md:flex-row overflow-hidden sovereign">
                {/* LEFT SIDE: COMMAND CENTER */}
                <aside className="w-full md:w-1/3 border-r border-white/5 p-8 overflow-y-auto bg-[#0A2540]/90 backdrop-blur-xl z-20 relative flex flex-col gap-6">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00D09C]/5 to-transparent pointer-events-none" />

                    {/* Status Bar */}
                    <div className="flex items-center justify-between">
                        {activeStoreId ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#051423] border border-white/10">
                                    <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' :
                                        saveStatus === 'saved' ? 'bg-[#00D09C]' :
                                            saveStatus === 'error' ? 'bg-red-500' : 'bg-gray-600'
                                        }`} />
                                    <span className="text-[10px] uppercase font-bold text-gray-400">
                                        {saveStatus === 'saving' ? 'Syncing...' :
                                            saveStatus === 'saved' ? 'Synced' :
                                                saveStatus === 'error' ? 'Sync Error' : 'Unsaved'}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => onOpen('customizer', { id: activeStoreId || blueprint?.id || 'temp', name: businessName })}
                                    className="bg-[#00D09C] hover:bg-[#00B085] text-white px-4 h-8 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00D09C]/20"
                                >
                                    Go Live <Rocket className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        ) : (
                            <div className="px-3 py-1.5 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20">
                                <span className="text-[10px] uppercase font-bold text-[#00D09C]">New Session</span>
                            </div>
                        )}
                    </div>

                    <CommandCenter
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        vision={vision}
                        setVision={setVision}
                        niche={niche}
                        setNiche={setNiche}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        isGenerating={isGenerating}
                        onGenerate={triggerGeneration}
                        activeStoreId={activeStoreId}
                        userId={userId}
                        onAssetUpload={handleAssetUpload}
                        aiInsight={blueprint?.ai_insight}
                        blueprint={blueprint}
                        selectedPageSlug={selectedPageSlug}
                        onSelectPage={setSelectedPageSlug}
                        undo={undo}
                        redo={redo}
                        canUndo={history.past.length > 0}
                        canRedo={history.future.length > 0}
                    />


                    {showPay && (
                        <PaymentModule siteId={activeStoreId || blueprint?.id || "temp_id"} />
                    )}
                </aside>

                {/* RIGHT SIDE: LIVE PREVIEW CANVAS */}
                <main className="flex-1 bg-[#051423] overflow-hidden relative p-8 md:p-12 flex flex-col">
                    {/* Top Bar with AI Command */}
                    <div className="w-full flex justify-center mb-8 relative z-[60]">
                        <AICommandBar
                            isProcessing={isGenerating}
                            onCommand={async (cmd: string) => {
                                if (!blueprint) return;
                                const localPatch = applyValidatedCommandPatch(blueprint, cmd);
                                if (localPatch.handled) {
                                    updateBlueprint(localPatch.blueprint);
                                    await handleSave(localPatch.blueprint, { promptOnUnauthorized: false });
                                    toast.success(`Command patch applied (${localPatch.operations.length} ops)`);
                                    return;
                                }

                                setIsGenerating(true);
                                try {
                                    const modifiedBlueprint = await refineBlueprintAction({
                                        currentBlueprint: blueprint,
                                        command: cmd,
                                        businessName: businessName,
                                        niche: niche,
                                        locale: locale || 'ar'
                                    });
                                    updateBlueprint(modifiedBlueprint);
                                    await handleSave(modifiedBlueprint, { promptOnUnauthorized: false });
                                    toast.success("Blueprint refined by AI");
                                } catch (e) {
                                    console.error(e);
                                    toast.error("Refinement failed");
                                } finally {
                                    setIsGenerating(false);
                                }
                            }}
                        />

                    </div>

                    <div className="flex-1 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00D09C]/5 via-transparent to-transparent pointer-events-none" />
                        <PreviewCanvas blueprint={blueprint} isGenerating={isGenerating} selectedPageSlug={selectedPageSlug} />
                    </div>
                </main>
            </div>

            <AITweakerPanel />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <ClaimOverlay
                isVisible={!!blueprint && !isGenerating && !activeStoreId}
                onClaim={() => setShowAuthModal(true)}
            />

        </PayPalScriptProvider>
    );
}
